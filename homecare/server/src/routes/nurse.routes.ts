import { Router } from 'express';
import { searchNurses, getNurseProfile, getNurseAvailability } from '../controllers/nurse.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Public routes (marketplace)
router.get('/search', asyncHandler(searchNurses));
router.get('/:nurseId', asyncHandler(getNurseProfile));
router.get('/:nurseId/availability', authenticate, asyncHandler(getNurseAvailability));

export default router;
