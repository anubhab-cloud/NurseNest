import { Router } from 'express';
import authRoutes from './auth.routes';
import nurseRoutes from './nurse.routes';
import bookingRoutes from './booking.routes';
import agoraRoutes from './agora.routes';
import paymentRoutes from './payment.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';
import blogRoutes from './blog.routes';
import reviewRoutes from './review.routes';
import servicesRoutes from './services.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/nurses', nurseRoutes);
router.use('/bookings', bookingRoutes);
router.use('/agora', agoraRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/blogs', blogRoutes);
router.use('/reviews', reviewRoutes);
router.use('/services', servicesRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Homecare API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

export default router;
