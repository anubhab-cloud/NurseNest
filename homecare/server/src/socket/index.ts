import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { ChatMessage, Conversation } from '../models/ChatMessage';
import { User } from '../models';

// ─── Socket.io + Redis Adapter Initialization ──────────────────────────────────
// This architecture ensures horizontal scalability:
// Multiple Node.js instances behind a load balancer can all serve
// real-time events because Redis pub/sub synchronizes state across instances.

export const initializeSocket = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: config.clientUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
  });

  // ─── Redis Adapter for Multi-Instance Scaling ──────────────────────────────
  const pubClient = new Redis(config.redis.url);
  const subClient = pubClient.duplicate();

  Promise.all([pubClient.ping(), subClient.ping()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    console.log('[Socket.io] Redis adapter connected - horizontal scaling enabled');
  }).catch((err) => {
    console.error('[Socket.io] Redis adapter connection failed:', err);
  });

  // ─── Authentication Middleware ─────────────────────────────────────────────
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token ||
                    socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; role: string };
      const user = await User.findById(decoded.userId).select('firstName lastName role');

      if (!user) {
        return next(new Error('User not found'));
      }

      // Attach user data to socket
      (socket as any).userId = decoded.userId;
      (socket as any).userRole = decoded.role;
      (socket as any).userName = `${user.firstName} ${user.lastName}`;

      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  // ─── Connection Handler ────────────────────────────────────────────────────
  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    const userName = (socket as any).userName;

    console.log(`[Socket.io] User connected: ${userName} (${userId})`);

    // Track online status in Redis
    pubClient.set(`user:online:${userId}`, socket.id, 'EX', 3600);

    // ─── Join Conversation Room ────────────────────────────────────────────
    socket.on('join_room', async (data: { bookingId: string }) => {
      const { bookingId } = data;
      const roomId = `chat:${bookingId}`;

      // Verify the user is a participant of this booking
      const conversation = await Conversation.findOne({
        bookingId,
        participants: userId,
      });

      if (!conversation) {
        socket.emit('error', { message: 'Not authorized to join this conversation' });
        return;
      }

      socket.join(roomId);
      socket.emit('room_joined', { roomId, bookingId });
      console.log(`[Socket.io] ${userName} joined room: ${roomId}`);
    });

    // ─── Send Message ──────────────────────────────────────────────────────
    socket.on('send_message', async (data: {
      bookingId: string;
      receiverId: string;
      content: string;
      messageType?: 'text' | 'image' | 'file';
    }) => {
      try {
        const { bookingId, receiverId, content, messageType = 'text' } = data;
        const roomId = `chat:${bookingId}`;

        // Save to MongoDB
        const message = await ChatMessage.create({
          conversationId: roomId,
          bookingId,
          senderId: userId,
          receiverId,
          messageType,
          content,
        });

        // Update conversation's last message
        await Conversation.findOneAndUpdate(
          { bookingId },
          {
            lastMessage: {
              content,
              senderId: userId,
              timestamp: new Date(),
            },
            $inc: { [`unreadCount.${receiverId}`]: 1 },
          }
        );

        // Emit to the room (all participants)
        io.to(roomId).emit('new_message', {
          _id: message._id,
          conversationId: roomId,
          senderId: userId,
          senderName: userName,
          receiverId,
          content,
          messageType,
          createdAt: message.createdAt,
          isRead: false,
        });

        // Notify receiver if they are online but not in the room
        const receiverSocketId = await pubClient.get(`user:online:${receiverId}`);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('notification', {
            type: 'new_message',
            from: userName,
            bookingId,
            preview: content.substring(0, 50),
          });
        }
      } catch (error) {
        console.error('[Socket.io] Message send error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ─── Mark Messages as Read ─────────────────────────────────────────────
    socket.on('mark_read', async (data: { bookingId: string }) => {
      const { bookingId } = data;
      const roomId = `chat:${bookingId}`;

      await ChatMessage.updateMany(
        { conversationId: roomId, receiverId: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      // Reset unread count
      await Conversation.findOneAndUpdate(
        { bookingId },
        { [`unreadCount.${userId}`]: 0 }
      );

      // Notify sender that messages were read
      io.to(roomId).emit('messages_read', { readBy: userId, bookingId });
    });

    // ─── Typing Indicator ──────────────────────────────────────────────────
    socket.on('typing_start', (data: { bookingId: string }) => {
      socket.to(`chat:${data.bookingId}`).emit('user_typing', {
        userId,
        userName,
        isTyping: true,
      });
    });

    socket.on('typing_stop', (data: { bookingId: string }) => {
      socket.to(`chat:${data.bookingId}`).emit('user_typing', {
        userId,
        userName,
        isTyping: false,
      });
    });

    // ─── Video Call Signaling ──────────────────────────────────────────────
    socket.on('call_initiate', (data: { bookingId: string; receiverId: string }) => {
      const { bookingId, receiverId } = data;
      io.to(`chat:${bookingId}`).emit('incoming_call', {
        callerId: userId,
        callerName: userName,
        bookingId,
      });
    });

    socket.on('call_accept', (data: { bookingId: string }) => {
      io.to(`chat:${data.bookingId}`).emit('call_accepted', { acceptedBy: userId });
    });

    socket.on('call_reject', (data: { bookingId: string }) => {
      io.to(`chat:${data.bookingId}`).emit('call_rejected', { rejectedBy: userId });
    });

    socket.on('call_end', (data: { bookingId: string }) => {
      io.to(`chat:${data.bookingId}`).emit('call_ended', { endedBy: userId });
    });

    // ─── Disconnect ────────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`[Socket.io] User disconnected: ${userName} (${userId})`);
      await pubClient.del(`user:online:${userId}`);

      // Update nurse online status
      const { NurseProfile } = require('../models');
      await NurseProfile.findOneAndUpdate({ userId }, { isOnline: false });
    });
  });

  return io;
};
