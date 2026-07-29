import { Router } from 'express';
import { chat, clearHistory } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// POST /api/v1/ai/chat — send a message to Gemini AI
// Requires auth — user must be logged in (patient dashboard context)
router.post('/chat', authenticate, chat);

// DELETE /api/v1/ai/chat/clear — clear conversation history for this user
router.delete('/chat/clear', authenticate, clearHistory);

export default router;
