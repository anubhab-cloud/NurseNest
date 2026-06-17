import cron from 'node-cron';
import { Booking } from '../models';
import { notificationService } from './notification.service';

// ─── Scheduled Jobs ────────────────────────────────────────────────────────────
// Runs appointment reminders and cleanup tasks on a schedule

export function initializeScheduler() {
  // ─── Appointment Reminder: 1 hour before ─────────────────────────────────
  // Runs every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    try {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      // Find bookings starting within the next hour that haven't been reminded
      const upcomingBookings = await Booking.find({
        status: 'confirmed',
        scheduledDate: {
          $gte: new Date(now.toDateString()),
          $lte: new Date(oneHourFromNow.toDateString()),
        },
        // Only today's bookings where startTime is within the next hour
      }).populate('patientId nurseId', 'firstName lastName');

      for (const booking of upcomingBookings) {
        const bookingDateTime = new Date(booking.scheduledDate);
        const [hours, mins] = booking.startTime.split(':');
        bookingDateTime.setHours(parseInt(hours), parseInt(mins));

        const timeDiff = bookingDateTime.getTime() - now.getTime();
        const minutesBefore = Math.floor(timeDiff / 60000);

        // Send reminder if within 45-75 min window
        if (minutesBefore > 45 && minutesBefore <= 75) {
          await Promise.allSettled([
            notificationService.notifyUpcomingAppointment(
              booking.patientId.toString(),
              60,
              booking._id.toString()
            ),
            notificationService.notifyUpcomingAppointment(
              booking.nurseId.toString(),
              60,
              booking._id.toString()
            ),
          ]);
        }
      }

      console.log(`[Scheduler] Checked ${upcomingBookings.length} upcoming appointments`);
    } catch (error) {
      console.error('[Scheduler] Reminder job failed:', error);
    }
  });

  // ─── Expired Lock Cleanup: Every 5 minutes ───────────────────────────────
  cron.schedule('*/5 * * * *', async () => {
    try {
      const result = await Booking.updateMany(
        {
          status: 'pending',
          lockExpiresAt: { $lt: new Date() },
        },
        {
          status: 'cancelled',
          'cancellation.cancelledBy': 'admin',
          'cancellation.reason': 'Booking lock expired - payment not completed in time',
          'cancellation.cancelledAt': new Date(),
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`[Scheduler] Cleaned up ${result.modifiedCount} expired booking locks`);
      }
    } catch (error) {
      console.error('[Scheduler] Lock cleanup failed:', error);
    }
  });

  // ─── Daily Analytics Digest: Every day at 8 AM ────────────────────────────
  cron.schedule('0 8 * * *', async () => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [bookingCount, revenue] = await Promise.all([
        Booking.countDocuments({
          createdAt: { $gte: yesterday, $lt: today },
        }),
        Booking.aggregate([
          {
            $match: {
              status: 'completed',
              updatedAt: { $gte: yesterday, $lt: today },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$billing.totalAmount' },
            },
          },
        ]),
      ]);

      console.log(`[Scheduler] Daily digest: ${bookingCount} bookings, $${revenue[0]?.total || 0} revenue`);

      // Notify admins
      const { User } = require('../models');
      const admins = await User.find({ role: 'admin', isActive: true }).select('_id');
      const adminIds = admins.map((a: any) => a._id.toString());

      if (adminIds.length > 0) {
        await notificationService.sendBulk(adminIds, {
          type: 'system',
          title: 'Daily Report',
          body: `Yesterday: ${bookingCount} new bookings, $${(revenue[0]?.total || 0).toFixed(0)} in revenue.`,
          channels: ['in_app'],
        });
      }
    } catch (error) {
      console.error('[Scheduler] Daily digest failed:', error);
    }
  });

  console.log('[Scheduler] All cron jobs initialized');
}
