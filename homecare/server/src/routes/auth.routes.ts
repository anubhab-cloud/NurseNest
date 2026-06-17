import { Router } from 'express';
import { register, login, logout, refreshToken } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/logout', authenticate, asyncHandler(logout));
router.post('/refresh-token', asyncHandler(refreshToken));

export default router;
