import { Router } from 'express';
import Service from '../models/Service';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
