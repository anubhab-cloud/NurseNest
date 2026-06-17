import { Router } from 'express';
import { generateRtcToken, generateRtcTokenWithUid } from '../controllers/agora.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

// Generate token for a specific booking consultation
router.get('/token/:bookingId', asyncHandler(generateRtcToken));

// Generate token with custom UID
router.post('/token', asyncHandler(generateRtcTokenWithUid));

export default router;
