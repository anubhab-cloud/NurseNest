import { Request, Response } from 'express';
import { ChatMessage, Conversation } from '../models/ChatMessage';
import { Booking } from '../models';
import { ApiError } from '../middleware/errorHandler';

// ─── Get Message History for a Booking ─────────────────────────────────────────
export const getConversationMessages = async (req: Request, res: Response): Promise<void> => {
  const { bookingId } = req.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const { page = 1, limit = 50 } = req.query;

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(100, parseInt(limit as string, 10));

  // Verify user is participant in booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  const isParticipant =
    booking.patientId.toString() === userId ||
    booking.nurseId.toString() === userId;

  if (!isParticipant && userRole !== 'admin') {
    throw new ApiError(403, 'Not authorized to view messages for this booking');
  }

  const roomId = `chat:${bookingId}`;
  const [messages, total] = await Promise.all([
    ChatMessage.find({ conversationId: roomId })
      .populate('senderId', 'firstName lastName avatar role')
      .sort({ createdAt: 1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    ChatMessage.countDocuments({ conversationId: roomId }),
  ]);

  res.json({
    success: true,
    data: {
      messages,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    },
  });
};

// ─── Get User's Active Conversations ────────────────────────────────────────────
export const getUserConversations = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;

  const conversations = await Conversation.find({
    participants: userId,
    isActive: true,
  })
    .populate('bookingId', 'serviceType scheduledDate status')
    .populate('participants', 'firstName lastName avatar role')
    .sort({ 'lastMessage.timestamp': -1 });

  res.json({
    success: true,
    data: { conversations },
  });
};

// ─── Upload Chat Attachment (Image / Voice Note / Document) ────────────────────
export const uploadAttachment = async (req: Request, res: Response): Promise<void> => {
  const { fileData, fileName, fileType } = req.body;

  if (!fileData) {
    throw new ApiError(400, 'File data is required');
  }

  // Determine message type
  let messageType: 'image' | 'audio' | 'file' = 'file';
  if (fileType?.startsWith('image/') || fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    messageType = 'image';
  } else if (fileType?.startsWith('audio/') || fileName?.match(/\.(mp3|wav|webm|ogg|m4a)$/i)) {
    messageType = 'audio';
  }

  // In production this uploads to S3/Cloudinary; for now return data URL / static path
  const fileUrl = fileData.startsWith('data:')
    ? fileData
    : `data:${fileType || 'application/octet-stream'};base64,${fileData}`;

  res.json({
    success: true,
    data: {
      fileUrl,
      fileName: fileName || 'attachment',
      messageType,
    },
  });
};

// ─── Mark Messages as Read ─────────────────────────────────────────────────────
export const markMessagesAsRead = async (req: Request, res: Response): Promise<void> => {
  const { bookingId } = req.params;
  const userId = req.user!.userId;
  const roomId = `chat:${bookingId}`;

  await ChatMessage.updateMany(
    { conversationId: roomId, receiverId: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  await Conversation.findOneAndUpdate(
    { bookingId },
    { [`unreadCount.${userId}`]: 0 }
  );

  res.json({
    success: true,
    message: 'Messages marked as read',
  });
};
