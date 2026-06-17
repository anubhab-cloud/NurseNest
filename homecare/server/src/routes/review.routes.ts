import { Router } from 'express';
import Review from '../models/Review';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .populate('patient', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
