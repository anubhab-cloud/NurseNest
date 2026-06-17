import { Request, Response } from 'express';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { config } from '../config/env';
import { Booking } from '../models';
import { ApiError } from '../middleware/errorHandler';

// ─── Generate Agora RTC Token ──────────────────────────────────────────────────
// Generates secure, time-limited tokens for video/audio consultations.
// The channel name is derived from the bookingId to ensure participants
// can only join their specific consultation room.

export const generateRtcToken = async (req: Request, res: Response): Promise<void> => {
  const { bookingId } = req.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role;

  // Validate Agora credentials are configured
  if (!config.agora.appId || !config.agora.appCertificate) {
    throw new ApiError(500, 'Video consultation service is not configured');
  }

  // Verify the booking exists and user is a participant
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  const isParticipant =
    booking.patientId.toString() === userId ||
    booking.nurseId.toString() === userId;

  if (!isParticipant && userRole !== 'admin') {
    throw new ApiError(403, 'Not authorized to join this consultation');
  }

  // Only allow video for confirmed/in-progress bookings
  if (!['confirmed', 'in-progress'].includes(booking.status)) {
    throw new ApiError(400, 'Video consultation is only available for active bookings');
  }

  // Generate token
  const channelName = `consultation-${bookingId}`;
  const uid = 0; // Use 0 for dynamic UID assignment by Agora
  const role = RtcRole.PUBLISHER; // Both patient and nurse can publish audio/video
  const expirationTimeInSeconds = 3600; // Token valid for 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    config.agora.appId,
    config.agora.appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  res.json({
    success: true,
    data: {
      token,
      channelName,
      uid,
      appId: config.agora.appId,
      expiresAt: new Date(privilegeExpiredTs * 1000).toISOString(),
    },
  });
};

// ─── Generate Token with Specific UID ──────────────────────────────────────────
// Used when you need deterministic UIDs for tracking participants

export const generateRtcTokenWithUid = async (req: Request, res: Response): Promise<void> => {
  const { channelName, uid, role: requestedRole } = req.body;

  if (!config.agora.appId || !config.agora.appCertificate) {
    throw new ApiError(500, 'Video service not configured');
  }

  if (!channelName) {
    throw new ApiError(400, 'Channel name is required');
  }

  const agoraRole = requestedRole === 'audience'
    ? RtcRole.SUBSCRIBER
    : RtcRole.PUBLISHER;

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    config.agora.appId,
    config.agora.appCertificate,
    channelName,
    uid || 0,
    agoraRole,
    privilegeExpiredTs
  );

  res.json({
    success: true,
    data: {
      token,
      channelName,
      uid: uid || 0,
      appId: config.agora.appId,
      expiresAt: new Date(privilegeExpiredTs * 1000).toISOString(),
    },
  });
};
