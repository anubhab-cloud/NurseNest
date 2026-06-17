import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  registerDevice,
  unregisterDevice,
} from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(getNotifications));
router.patch('/:notificationId/read', asyncHandler(markAsRead));
router.patch('/read-all', asyncHandler(markAllAsRead));
router.post('/devices', asyncHandler(registerDevice));
router.delete('/devices', asyncHandler(unregisterDevice));

export default router;
