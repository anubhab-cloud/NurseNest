import { config } from '../config/env';
import { Notification, DeviceToken } from '../models/Notification';

// ─── Firebase Admin Initialization ─────────────────────────────────────────────

let firebaseAdmin: any = null;

if (config.firebase.projectId && config.firebase.privateKey) {
  try {
    const admin = require('firebase-admin');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        privateKey: config.firebase.privateKey,
        clientEmail: config.firebase.clientEmail,
      }),
    });
    firebaseAdmin = admin;
    console.log('[Firebase] Admin SDK initialized');
  } catch (err) {
    console.warn('[Firebase] Init failed - push notifications disabled');
  }
} else {
  console.warn('[Firebase] Not configured - push notifications in mock mode');
}

// ─── Notification Service ──────────────────────────────────────────────────────

interface SendNotificationParams {
  userId: string;
  type: 'booking' | 'payment' | 'chat' | 'system' | 'reminder' | 'promotion';
  title: string;
  body: string;
  data?: Record<string, string>;
  channels?: ('push' | 'email' | 'sms' | 'in_app')[];
}

class NotificationService {
  // ─── Main Send Method ──────────────────────────────────────────────────────
  async send(params: SendNotificationParams): Promise<void> {
    const { userId, type, title, body, data, channels = ['push', 'in_app'] } = params;

    // 1. Always save in-app notification
    const notification = await Notification.create({
      userId,
      type,
      title,
      body,
      data,
      channels,
    });

    // 2. Send push notification if requested
    if (channels.includes('push')) {
      await this.sendPush(userId, title, body, data);
    }

    // 3. Send email if requested
    if (channels.includes('email')) {
      await this.sendEmail(userId, title, body);
    }
  }

  // ─── Push Notification via FCM ─────────────────────────────────────────────
  private async sendPush(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<void> {
    if (!firebaseAdmin) {
      console.log(`[Push Mock] → ${userId}: "${title}" - ${body}`);
      return;
    }

    try {
      // Get all active device tokens for this user
      const devices = await DeviceToken.find({ userId, isActive: true });

      if (devices.length === 0) return;

      const tokens = devices.map((d) => d.token);

      // Send multicast to all user devices
      const message: any = {
        tokens,
        notification: {
          title,
          body,
        },
        data: data || {},
        webpush: {
          notification: {
            icon: '/icons/app-icon-192.png',
            badge: '/icons/badge-72.png',
            vibrate: [200, 100, 200],
            actions: [
              { action: 'open', title: 'Open' },
              { action: 'dismiss', title: 'Dismiss' },
            ],
          },
          fcmOptions: {
            link: data?.url || '/',
          },
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'homecare_default',
            sound: 'default',
            priority: 'high',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await firebaseAdmin.messaging().sendEachForMulticast(message);

      // Deactivate failed tokens
      response.responses.forEach((resp, idx) => {
        if (!resp.success && resp.error?.code === 'messaging/registration-token-not-registered') {
          DeviceToken.findOneAndUpdate(
            { token: tokens[idx] },
            { isActive: false }
          ).exec();
        }
      });

      console.log(`[Push] Sent to ${response.successCount}/${tokens.length} devices for user ${userId}`);
    } catch (error) {
      console.error('[Push] Failed:', error);
    }
  }

  // ─── Email Notification (placeholder - integrate SendGrid/SES) ─────────────
  private async sendEmail(userId: string, title: string, body: string): Promise<void> {
    // TODO: Integrate with SendGrid, AWS SES, or Nodemailer
    // const user = await User.findById(userId);
    // await sendgrid.send({
    //   to: user.email,
    //   from: 'notifications@homecare.app',
    //   subject: title,
    //   html: emailTemplate(title, body),
    // });
    console.log(`[Email] Would send "${title}" to user ${userId}`);
  }

  // ─── Bulk Notification ─────────────────────────────────────────────────────
  async sendBulk(
    userIds: string[],
    params: Omit<SendNotificationParams, 'userId'>
  ): Promise<void> {
    await Promise.allSettled(
      userIds.map((userId) => this.send({ ...params, userId }))
    );
  }

  // ─── Register Device Token ─────────────────────────────────────────────────
  async registerDevice(userId: string, token: string, platform: 'web' | 'ios' | 'android'): Promise<void> {
    await DeviceToken.findOneAndUpdate(
      { token },
      { userId, token, platform, isActive: true, lastUsed: new Date() },
      { upsert: true }
    );
  }

  // ─── Remove Device Token ───────────────────────────────────────────────────
  async unregisterDevice(token: string): Promise<void> {
    await DeviceToken.findOneAndUpdate({ token }, { isActive: false });
  }

  // ─── Get User Notifications ────────────────────────────────────────────────
  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ userId }),
      Notification.countDocuments({ userId, isRead: false }),
    ]);

    return { notifications, total, unreadCount, page, limit };
  }

  // ─── Mark as Read ──────────────────────────────────────────────────────────
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true, readAt: new Date() }
    );
  }

  // ─── Mark All as Read ──────────────────────────────────────────────────────
  async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }

  // ─── Pre-built Notification Templates ──────────────────────────────────────

  async notifyBookingCreated(nurseId: string, patientName: string, bookingId: string) {
    await this.send({
      userId: nurseId,
      type: 'booking',
      title: 'New Booking Request',
      body: `${patientName} has requested a booking. Tap to review.`,
      data: { bookingId, action: 'view_booking' },
      channels: ['push', 'in_app', 'email'],
    });
  }

  async notifyBookingConfirmed(patientId: string, nurseName: string, bookingId: string) {
    await this.send({
      userId: patientId,
      type: 'booking',
      title: 'Booking Confirmed',
      body: `${nurseName} has confirmed your appointment.`,
      data: { bookingId, action: 'view_booking' },
      channels: ['push', 'in_app'],
    });
  }

  async notifyUpcomingAppointment(userId: string, minutesBefore: number, bookingId: string) {
    await this.send({
      userId,
      type: 'reminder',
      title: 'Upcoming Appointment',
      body: `Your appointment starts in ${minutesBefore} minutes.`,
      data: { bookingId, action: 'view_booking' },
      channels: ['push', 'in_app'],
    });
  }

  async notifyPaymentReceived(nurseId: string, amount: number, bookingId: string) {
    await this.send({
      userId: nurseId,
      type: 'payment',
      title: 'Payment Received',
      body: `You earned $${amount.toFixed(2)} from a completed booking.`,
      data: { bookingId, action: 'view_earnings' },
      channels: ['push', 'in_app'],
    });
  }

  async notifyNewMessage(userId: string, senderName: string, bookingId: string, preview: string) {
    await this.send({
      userId,
      type: 'chat',
      title: `Message from ${senderName}`,
      body: preview.length > 50 ? preview.substring(0, 50) + '...' : preview,
      data: { bookingId, action: 'open_chat' },
      channels: ['push'],
    });
  }
}

export const notificationService = new NotificationService();
