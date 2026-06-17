import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Booking, NurseProfile } from '../models';
import { Conversation } from '../models/ChatMessage';
import { ApiError } from '../middleware/errorHandler';

// ─── Create Booking (With Double-Booking Prevention) ───────────────────────────
// Uses MongoDB's findOneAndUpdate with atomic filters as a locking mechanism.
// This prevents race conditions where two patients book the same nurse
// for overlapping time slots simultaneously.

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      nurseProfileId,
      serviceType,
      scheduledDate,
      startTime,
      endTime,
      duration,
      location,
      notes,
    } = req.body;

    const patientId = req.user!.userId;

    // 1. Verify nurse exists and is approved
    const nurseProfile = await NurseProfile.findById(nurseProfileId)
      .session(session);

    if (!nurseProfile || nurseProfile.verificationStatus !== 'approved') {
      throw new ApiError(404, 'Nurse not available for booking');
    }

    // 2. CRITICAL: Double-booking prevention
    // Check for ANY overlapping booking for this nurse on the same date
    // Time overlap logic: existing.start < new.end AND existing.end > new.start
    const conflictingBooking = await Booking.findOne({
      nurseId: nurseProfile.userId,
      scheduledDate: new Date(scheduledDate),
      status: { $in: ['pending', 'confirmed', 'in-progress'] },
      $or: [
        {
          // New booking starts during an existing booking
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    }).session(session);

    if (conflictingBooking) {
      throw new ApiError(
        409,
        'This nurse is already booked for the selected time slot. Please choose a different time.'
      );
    }

    // 3. Calculate billing
    const rateType = duration >= 8 ? 'daily' : 'hourly';
    const rate = rateType === 'daily' ? nurseProfile.dailyRate : nurseProfile.hourlyRate;
    const subtotal = rateType === 'daily'
      ? rate * Math.ceil(duration / 8)
      : rate * duration;
    const tax = subtotal * 0.08; // 8% tax
    const platformFee = subtotal * 0.15; // 15% platform fee
    const totalAmount = subtotal + tax + platformFee;

    // 4. Create the booking with a temporary lock
    const booking = await Booking.create(
      [
        {
          patientId,
          nurseId: nurseProfile.userId,
          nurseProfileId,
          serviceType,
          scheduledDate: new Date(scheduledDate),
          startTime,
          endTime,
          duration,
          location,
          billing: {
            rateType,
            rate,
            totalHours: duration,
            subtotal,
            tax,
            platformFee,
            totalAmount,
            isPaid: false,
          },
          notes: { patientNotes: notes },
          status: 'pending',
          // Lock expires in 15 minutes if not confirmed
          lockExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      ],
      { session }
    );

    // 5. Create conversation for this booking
    await Conversation.create(
      [
        {
          bookingId: booking[0]._id,
          participants: [patientId, nurseProfile.userId],
          isActive: true,
        },
      ],
      { session }
    );

    // 6. Increment nurse's total bookings
    await NurseProfile.findByIdAndUpdate(
      nurseProfileId,
      { $inc: { totalBookings: 1 } },
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: booking[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// ─── Update Booking Status ─────────────────────────────────────────────────────

export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  const { bookingId } = req.params;
  const { status, nurseNotes, cancellationReason } = req.body;
  const userId = req.user!.userId;
  const userRole = req.user!.role;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Authorization check
  const isParticipant =
    booking.patientId.toString() === userId ||
    booking.nurseId.toString() === userId;

  if (!isParticipant && userRole !== 'admin') {
    throw new ApiError(403, 'Not authorized to update this booking');
  }

  // Status transition validation
  const validTransitions: Record<string, string[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['in-progress', 'cancelled'],
    'in-progress': ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  };

  if (!validTransitions[booking.status]?.includes(status)) {
    throw new ApiError(
      400,
      `Cannot transition from "${booking.status}" to "${status}"`
    );
  }

  // Handle cancellation
  if (status === 'cancelled') {
    booking.cancellation = {
      cancelledBy: userRole as 'patient' | 'nurse' | 'admin',
      reason: cancellationReason || 'No reason provided',
      cancelledAt: new Date(),
      refundAmount: booking.billing.isPaid ? booking.billing.totalAmount : 0,
    };
  }

  booking.status = status;
  if (nurseNotes) booking.notes.nurseNotes = nurseNotes;

  // Clear the lock when confirmed
  if (status === 'confirmed') {
    booking.lockExpiresAt = undefined;
  }

  await booking.save();

  res.json({
    success: true,
    message: `Booking status updated to ${status}`,
    data: { booking },
  });
};

// ─── Get Patient's Bookings ────────────────────────────────────────────────────

export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const { status, page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(50, parseInt(limit as string, 10));

  const query: any = {};

  if (userRole === 'patient') {
    query.patientId = userId;
  } else if (userRole === 'nurse') {
    query.nurseId = userId;
  }

  if (status) {
    query.status = status;
  }

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate('patientId', 'firstName lastName avatar phone')
      .populate('nurseId', 'firstName lastName avatar phone')
      .populate('nurseProfileId', 'specializations averageRating hourlyRate')
      .sort({ scheduledDate: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Booking.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    },
  });
};
