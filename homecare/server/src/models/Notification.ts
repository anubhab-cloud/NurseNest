import mongoose, { Document, Schema } from 'mongoose';

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'booking' | 'payment' | 'chat' | 'system' | 'reminder' | 'promotion';
  title: string;
  body: string;
  data?: Record<string, string>;
  isRead: boolean;
  readAt?: Date;
  channels: ('push' | 'email' | 'sms' | 'in_app')[];
  pushDelivered: boolean;
  emailDelivered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDeviceToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  platform: 'web' | 'ios' | 'android';
  isActive: boolean;
  lastUsed: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Notification Schema ───────────────────────────────────────────────────────

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['booking', 'payment', 'chat', 'system', 'reminder', 'promotion'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    body: {
      type: String,
      required: true,
      maxlength: 500,
    },
    data: {
      type: Map,
      of: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    channels: [{
      type: String,
      enum: ['push', 'email', 'sms', 'in_app'],
    }],
    pushDelivered: {
      type: Boolean,
      default: false,
    },
    emailDelivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ─── Device Token Schema ───────────────────────────────────────────────────────

const deviceTokenSchema = new Schema<IDeviceToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ['web', 'ios', 'android'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ─── Indexes ───────────────────────────────────────────────────────────────────

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // TTL: 30 days

deviceTokenSchema.index({ userId: 1, platform: 1 });
deviceTokenSchema.index({ token: 1 }, { unique: true });

// ─── Export ────────────────────────────────────────────────────────────────────

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export const DeviceToken = mongoose.model<IDeviceToken>('DeviceToken', deviceTokenSchema);
