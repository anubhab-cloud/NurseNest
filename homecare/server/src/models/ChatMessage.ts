import mongoose, { Document, Schema } from 'mongoose';

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface IChatMessage extends Document {
  conversationId: string; // bookingId-based room identifier
  bookingId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  messageType: 'text' | 'image' | 'file' | 'system';
  content: string;
  fileUrl?: string;
  isRead: boolean;
  readAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation extends Document {
  bookingId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  lastMessage?: {
    content: string;
    senderId: mongoose.Types.ObjectId;
    timestamp: Date;
  };
  unreadCount: Map<string, number>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Chat Message Schema ───────────────────────────────────────────────────────

const chatMessageSchema = new Schema<IChatMessage>(
  {
    conversationId: {
      type: String,
      required: [true, 'Conversation ID is required'],
      index: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking ID is required'],
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required'],
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver ID is required'],
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'system'],
      default: 'text',
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
      trim: true,
    },
    fileUrl: {
      type: String,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Conversation Schema ───────────────────────────────────────────────────────

const conversationSchema = new Schema<IConversation>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      content: { type: String },
      senderId: { type: Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date },
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────────

chatMessageSchema.index({ conversationId: 1, createdAt: -1 });
chatMessageSchema.index({ senderId: 1, receiverId: 1 });
chatMessageSchema.index({ bookingId: 1, createdAt: -1 });
chatMessageSchema.index({ receiverId: 1, isRead: 1 }); // Unread messages lookup

conversationSchema.index({ participants: 1 });
conversationSchema.index({ bookingId: 1 });
conversationSchema.index({ 'lastMessage.timestamp': -1 });

// ─── Export ────────────────────────────────────────────────────────────────────

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
