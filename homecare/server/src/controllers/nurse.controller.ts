import { Request, Response } from 'express';
import { NurseProfile } from '../models';
import { ApiError } from '../middleware/errorHandler';

// ─── Search Nurses (Marketplace) ───────────────────────────────────────────────
// Supports geo-proximity, specialization filter, rating, pricing sort

export const searchNurses = async (req: Request, res: Response): Promise<void> => {
  const {
    lat,
    lng,
    radius = 25,         // km
    specialization,
    minRating = 0,
    maxRate,
    minRate,
    sortBy = 'rating',   // 'rating' | 'price' | 'distance' | 'experience'
    page = 1,
    limit = 12,
    language,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(50, parseInt(limit as string, 10));
  const skip = (pageNum - 1) * limitNum;

  // Build query pipeline
  const matchStage: any = {
    verificationStatus: 'approved',
  };

  // Specialization filter
  if (specialization) {
    matchStage.specializations = { $in: [specialization] };
  }

  // Rating filter
  if (minRating) {
    matchStage.averageRating = { $gte: parseFloat(minRating as string) };
  }

  // Price range filter
  if (minRate || maxRate) {
    matchStage.hourlyRate = {};
    if (minRate) matchStage.hourlyRate.$gte = parseFloat(minRate as string);
    if (maxRate) matchStage.hourlyRate.$lte = parseFloat(maxRate as string);
  }

  // Language filter
  if (language) {
    matchStage.languages = { $in: [language] };
  }

  // Build aggregation pipeline
  const pipeline: any[] = [];

  // Geo-proximity search (if coordinates provided)
  if (lat && lng) {
    pipeline.push({
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
        },
        distanceField: 'distance',
        maxDistance: parseInt(radius as string, 10) * 1000, // Convert km to meters
        spherical: true,
        query: matchStage,
      },
    });
  } else {
    pipeline.push({ $match: matchStage });
  }

  // Populate user data
  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user',
      pipeline: [
        { $project: { firstName: 1, lastName: 1, avatar: 1 } },
      ],
    },
  });

  pipeline.push({ $unwind: '$user' });

  // Sort
  const sortOptions: Record<string, any> = {
    rating: { averageRating: -1 },
    price: { hourlyRate: 1 },
    price_desc: { hourlyRate: -1 },
    distance: { distance: 1 },
    experience: { yearsOfExperience: -1 },
  };

  pipeline.push({ $sort: sortOptions[sortBy as string] || sortOptions.rating });

  // Pagination
  pipeline.push({
    $facet: {
      nurses: [{ $skip: skip }, { $limit: limitNum }],
      total: [{ $count: 'count' }],
    },
  });

  const [result] = await NurseProfile.aggregate(pipeline);

  const nurses = result.nurses || [];
  const total = result.total[0]?.count || 0;

  res.json({
    success: true,
    data: {
      nurses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    },
  });
};

// ─── Get Nurse Detail ──────────────────────────────────────────────────────────

export const getNurseProfile = async (req: Request, res: Response): Promise<void> => {
  const { nurseId } = req.params;

  const nurse = await NurseProfile.findById(nurseId)
    .populate('userId', 'firstName lastName avatar email phone');

  if (!nurse) {
    throw new ApiError(404, 'Nurse profile not found');
  }

  res.json({ success: true, data: { nurse } });
};

// ─── Get Nurse Availability for Specific Date ──────────────────────────────────

export const getNurseAvailability = async (req: Request, res: Response): Promise<void> => {
  const { nurseId } = req.params;
  const { date } = req.query;

  if (!date) {
    throw new ApiError(400, 'Date parameter is required');
  }

  const nurse = await NurseProfile.findById(nurseId);
  if (!nurse) {
    throw new ApiError(404, 'Nurse not found');
  }

  const requestedDate = new Date(date as string);
  const dayOfWeek = requestedDate.getDay();

  // Get nurse's general availability for that day
  const dayAvailability = nurse.availability.filter(
    (slot) => slot.dayOfWeek === dayOfWeek && slot.isAvailable
  );

  // Get existing bookings for that date to find occupied slots
  const { Booking } = require('../models');
  const existingBookings = await Booking.find({
    nurseProfileId: nurseId,
    scheduledDate: {
      $gte: new Date(requestedDate.setHours(0, 0, 0, 0)),
      $lt: new Date(requestedDate.setHours(23, 59, 59, 999)),
    },
    status: { $in: ['pending', 'confirmed', 'in-progress'] },
  }).select('startTime endTime');

  res.json({
    success: true,
    data: {
      date: date,
      dayOfWeek,
      availableSlots: dayAvailability,
      bookedSlots: existingBookings,
    },
  });
};
