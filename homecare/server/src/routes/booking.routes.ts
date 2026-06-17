import { Router } from 'express';
import {
  createBooking,
  updateBookingStatus,
  getMyBookings,
} from '../controllers/booking.controller';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All booking routes require authentication
router.use(authenticate);

router.post('/', authorize('patient'), asyncHandler(createBooking));
router.get('/my', asyncHandler(getMyBookings));
router.patch('/:bookingId/status', asyncHandler(updateBookingStatus));

export default router;
