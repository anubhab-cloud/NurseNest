import { Request, Response } from 'express';
import HealthRecord from '../models/HealthRecord';
import { ApiError } from '../middleware/errorHandler';
import { publishVitalsLoggedEvent } from '../services/kafka.service';

// Get health records for logged-in patient
export const getMyHealthRecords = async (req: Request, res: Response): Promise<void> => {
  const patientId = req.user!.userId;
  const records = await HealthRecord.find({ patientId }).sort({ recordedAt: -1 }).limit(30);

  res.json({
    success: true,
    data: { records },
  });
};

// Create a health record (by patient or assigned nurse)
export const createHealthRecord = async (req: Request, res: Response): Promise<void> => {
  const patientId = req.body.patientId || req.user!.userId;
  const { vitals, nurseName, notes, bookingId } = req.body;

  if (!vitals || !vitals.bp) {
    throw new ApiError(400, 'Vitals with blood pressure (bp) are required');
  }

  const record = await HealthRecord.create({
    patientId,
    nurseId: req.user!.role === 'nurse' ? req.user!.userId : undefined,
    bookingId,
    vitals,
    nurseName: nurseName || (req.user!.role === 'nurse' ? 'Assigned Nurse' : 'Self-Reported'),
    notes,
    recordedAt: new Date(),
  });

  // Publish Kafka vitals event asynchronously
  publishVitalsLoggedEvent(record.toObject()).catch(err =>
    console.error('[Kafka Event Error] Failed to publish VITALS_RECORDED:', err)
  );

  res.status(201).json({
    success: true,
    message: 'Health record added successfully',
    data: { record },
  });
};
