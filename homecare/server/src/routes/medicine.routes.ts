import { Router } from 'express';
import {
  getMyMedicines,
  createMedicine,
  toggleMedicineTaken,
  deleteMedicine,
} from '../controllers/medicine.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(getMyMedicines));
router.post('/', asyncHandler(createMedicine));
router.patch('/:id/toggle', asyncHandler(toggleMedicineTaken));
router.delete('/:id', asyncHandler(deleteMedicine));

export default router;
