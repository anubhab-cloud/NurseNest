import { Request, Response } from 'express';
import { User, NurseProfile, Booking, Payment } from '../models';
import { Notification } from '../models/Notification';
import { ApiError } from '../middleware/errorHandler';
import { notificationService } from '../services/notification.service';

// ─── Dashboard Analytics ───────────────────────────────────────────────────────

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  const { period = '30d' } = req.query;
  const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - periodDays);

  const [
    totalUsers,
    totalNurses,
    activeNurses,
    pendingVerifications,
    totalBookings,
    bookingsByStatus,
    revenueStats,
    recentUsers,
    dailySignups,
    dailyRevenue,
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    NurseProfile.countDocuments(),
    NurseProfile.countDocuments({ verificationStatus: 'approved', isOnline: true }),
    NurseProfile.countDocuments({ verificationStatus: 'pending' }),
    Booking.countDocuments({ createdAt: { $gte: startDate } }),
    Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Payment.aggregate([
      { $match: { status: 'succeeded', paidAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          platformEarnings: { $sum: '$platformFee' },
          totalTransactions: { $sum: 1 },
        },
      },
    ]),
    User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('firstName lastName email role createdAt'),
    User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Payment.aggregate([
      { $match: { status: 'succeeded', paidAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
          revenue: { $sum: '$amount' },
          platformFee: { $sum: '$platformFee' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalNurses,
        activeNurses,
        pendingVerifications,
        totalBookings,
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        platformEarnings: revenueStats[0]?.platformEarnings || 0,
        totalTransactions: revenueStats[0]?.totalTransactions || 0,
      },
      bookingsByStatus: Object.fromEntries(
        bookingsByStatus.map((b) => [b._id, b.count])
      ),
      charts: {
        dailySignups,
        dailyRevenue,
      },
      recentUsers,
    },
  });
};

// ─── Manage Users ──────────────────────────────────────────────────────────────

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const { role, search, page = 1, limit = 20, isActive } = req.query;

  const query: any = {};
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(100, parseInt(limit as string, 10));

  const [users, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      users,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    },
  });
};

// ─── Toggle User Active Status ─────────────────────────────────────────────────

export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true });
  if (!user) throw new ApiError(404, 'User not found');

  res.json({
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'}`,
    data: { user },
  });
};

// ─── Nurse Verification ────────────────────────────────────────────────────────

export const getPendingVerifications = async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(50, parseInt(limit as string, 10));

  const [profiles, total] = await Promise.all([
    NurseProfile.find({ verificationStatus: 'pending' })
      .populate('userId', 'firstName lastName email phone createdAt')
      .sort({ createdAt: 1 }) // Oldest first
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    NurseProfile.countDocuments({ verificationStatus: 'pending' }),
  ]);

  res.json({
    success: true,
    data: {
      profiles,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    },
  });
};

export const verifyNurse = async (req: Request, res: Response): Promise<void> => {
  const { profileId } = req.params;
  const { status, notes } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Status must be approved or rejected');
  }

  const profile = await NurseProfile.findByIdAndUpdate(
    profileId,
    {
      verificationStatus: status,
      verificationNotes: notes || '',
    },
    { new: true }
  ).populate('userId', 'firstName lastName');

  if (!profile) throw new ApiError(404, 'Profile not found');

  // Notify the nurse
  await notificationService.send({
    userId: profile.userId.toString(),
    type: 'system',
    title: status === 'approved' ? 'Profile Approved!' : 'Profile Not Approved',
    body: status === 'approved'
      ? 'Congratulations! Your profile has been verified. You can now receive bookings.'
      : `Your profile was not approved. ${notes || 'Please update your documents and resubmit.'}`,
    channels: ['push', 'in_app', 'email'],
  });

  res.json({
    success: true,
    message: `Nurse profile ${status}`,
    data: { profile },
  });
};

// ─── Manage Bookings ───────────────────────────────────────────────────────────

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  const { status, page = 1, limit = 20, startDate, endDate } = req.query;

  const query: any = {};
  if (status) query.status = status;
  if (startDate || endDate) {
    query.scheduledDate = {};
    if (startDate) query.scheduledDate.$gte = new Date(startDate as string);
    if (endDate) query.scheduledDate.$lte = new Date(endDate as string);
  }

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(100, parseInt(limit as string, 10));

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate('patientId', 'firstName lastName email phone')
      .populate('nurseId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Booking.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      bookings,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    },
  });
};

// ─── Platform Revenue Report ───────────────────────────────────────────────────

export const getRevenueReport = async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate } = req.query;

  const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate as string) : new Date();

  const [revenue, topNurses, serviceBreakdown] = await Promise.all([
    Payment.aggregate([
      { $match: { status: 'succeeded', paidAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          platformFees: { $sum: '$platformFee' },
          nursePayouts: { $sum: '$nurseEarnings' },
          transactionCount: { $sum: 1 },
          avgTransactionSize: { $avg: '$amount' },
        },
      },
    ]),
    Payment.aggregate([
      { $match: { status: 'succeeded', paidAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: '$nurseId',
          totalEarnings: { $sum: '$nurseEarnings' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { totalEarnings: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'nurse',
          pipeline: [{ $project: { firstName: 1, lastName: 1 } }],
        },
      },
      { $unwind: '$nurse' },
    ]),
    Booking.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 },
          revenue: { $sum: '$billing.totalAmount' },
        },
      },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      period: { start, end },
      revenue: revenue[0] || {},
      topNurses,
      serviceBreakdown,
    },
  });
};

// ─── Send System Notification ──────────────────────────────────────────────────

export const sendSystemNotification = async (req: Request, res: Response): Promise<void> => {
  const { userIds, title, body, type = 'system' } = req.body;

  if (!userIds || !title || !body) {
    throw new ApiError(400, 'userIds, title, and body are required');
  }

  await notificationService.sendBulk(userIds, {
    type,
    title,
    body,
    channels: ['push', 'in_app'],
  });

  res.json({
    success: true,
    message: `Notification sent to ${userIds.length} users`,
  });
};
