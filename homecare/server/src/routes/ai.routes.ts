import { Router } from 'express';
import { chat, clearHistory } from '../controllers/ai.controller';
import { optionalAuthenticate } from '../middleware/auth';

const router = Router();

// POST /api/v1/ai/chat — send a message to Gemini AI (guests & authenticated users)
router.post('/chat', optionalAuthenticate, chat);

// DELETE /api/v1/ai/chat/clear — clear conversation history
router.delete('/chat/clear', optionalAuthenticate, clearHistory);

export default router;

