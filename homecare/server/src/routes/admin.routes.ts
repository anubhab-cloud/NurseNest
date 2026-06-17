import { Router } from 'express';
import {
  getDashboardStats,
  getUsers,
  toggleUserStatus,
  getPendingVerifications,
  verifyNurse,
  getAllBookings,
  getRevenueReport,
  sendSystemNotification,
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', asyncHandler(getDashboardStats));

// Users management
router.get('/users', asyncHandler(getUsers));
router.patch('/users/:userId/status', asyncHandler(toggleUserStatus));

// Nurse verification
router.get('/verifications', asyncHandler(getPendingVerifications));
router.patch('/verifications/:profileId', asyncHandler(verifyNurse));

// Bookings
router.get('/bookings', asyncHandler(getAllBookings));

// Revenue
router.get('/revenue', asyncHandler(getRevenueReport));

// Notifications
router.post('/notifications/send', asyncHandler(sendSystemNotification));

export default router;
