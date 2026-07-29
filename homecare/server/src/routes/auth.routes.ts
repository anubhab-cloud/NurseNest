import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  updateProfile,
  changePassword,
  deactivateAccount,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/logout', authenticate, asyncHandler(logout));
router.post('/refresh-token', asyncHandler(refreshToken));

// Authenticated settings routes
router.put('/profile', authenticate, asyncHandler(updateProfile));
router.post('/change-password', authenticate, asyncHandler(changePassword));
router.post('/deactivate', authenticate, asyncHandler(deactivateAccount));

export default router;

