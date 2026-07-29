import { Router } from 'express';
import { getMyHealthRecords, createHealthRecord } from '../controllers/health.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/records', asyncHandler(getMyHealthRecords));
router.post('/records', asyncHandler(createHealthRecord));

export default router;
