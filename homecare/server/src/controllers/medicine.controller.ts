import { Request, Response } from 'express';
import Medicine from '../models/Medicine';
import { ApiError } from '../middleware/errorHandler';

// Get all medicines for logged in user
export const getMyMedicines = async (req: Request, res: Response): Promise<void> => {
  const patientId = req.user!.userId;
  const medicines = await Medicine.find({ patientId }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: { medicines },
  });
};

// Add a new medicine reminder
export const createMedicine = async (req: Request, res: Response): Promise<void> => {
  const patientId = req.user!.userId;
  const { name, dosage, time, type, color, frequency, instructions } = req.body;

  if (!name || !time) {
    throw new ApiError(400, 'Medicine name and time are required');
  }

  const medicine = await Medicine.create({
    patientId,
    name,
    dosage: dosage || '1 tablet',
    time,
    type: type || 'General',
    color: color || 'bg-blue-100 text-blue-700',
    frequency: frequency || 'Daily',
    instructions,
  });

  res.status(201).json({
    success: true,
    message: 'Medicine reminder created successfully',
    data: { medicine },
  });
};

// Toggle medicine taken status
export const toggleMedicineTaken = async (req: Request, res: Response): Promise<void> => {
  const patientId = req.user!.userId;
  const { id } = req.params;

  const medicine = await Medicine.findOne({ _id: id, patientId });
  if (!medicine) {
    throw new ApiError(404, 'Medicine reminder not found');
  }

  medicine.taken = !medicine.taken;
  await medicine.save();

  res.json({
    success: true,
    message: `Medicine marked as ${medicine.taken ? 'taken' : 'pending'}`,
    data: { medicine },
  });
};

// Delete a medicine reminder
export const deleteMedicine = async (req: Request, res: Response): Promise<void> => {
  const patientId = req.user!.userId;
  const { id } = req.params;

  const medicine = await Medicine.findOneAndDelete({ _id: id, patientId });
  if (!medicine) {
    throw new ApiError(404, 'Medicine reminder not found');
  }

  res.json({
    success: true,
    message: 'Medicine reminder deleted',
  });
};
