import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { ApiError } from '../middleware/errorHandler';

// ─── Get Notifications ─────────────────────────────────────────────────────────

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const { page = 1, limit = 20 } = req.query;

  const result = await notificationService.getUserNotifications(
    userId,
    parseInt(page as string, 10),
    parseInt(limit as string, 10)
  );

  res.json({ success: true, data: result });
};

// ─── Mark Notification as Read ─────────────────────────────────────────────────

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const { notificationId } = req.params;

  await notificationService.markAsRead(notificationId, userId);
  res.json({ success: true, message: 'Notification marked as read' });
};

// ─── Mark All as Read ──────────────────────────────────────────────────────────

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  await notificationService.markAllAsRead(userId);
  res.json({ success: true, message: 'All notifications marked as read' });
};

// ─── Register Device Token ─────────────────────────────────────────────────────

export const registerDevice = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const { token, platform } = req.body;

  if (!token || !platform) {
    throw new ApiError(400, 'Token and platform are required');
  }

  await notificationService.registerDevice(userId, token, platform);
  res.json({ success: true, message: 'Device registered' });
};

// ─── Unregister Device Token ───────────────────────────────────────────────────

export const unregisterDevice = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;
  await notificationService.unregisterDevice(token);
  res.json({ success: true, message: 'Device unregistered' });
};
