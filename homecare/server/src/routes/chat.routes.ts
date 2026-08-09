import { Router } from 'express';
import {
  getConversationMessages,
  getUserConversations,
  uploadAttachment,
  markMessagesAsRead,
} from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

// Get conversations for logged in user
router.get('/conversations', asyncHandler(getUserConversations));

// Get chat history for a booking
router.get('/messages/:bookingId', asyncHandler(getConversationMessages));

// Upload chat attachment (Image, Audio voice note, Document)
router.post('/attachment', asyncHandler(uploadAttachment));

// Mark booking messages as read
router.patch('/read/:bookingId', asyncHandler(markMessagesAsRead));

export default router;
