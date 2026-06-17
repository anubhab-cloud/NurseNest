import { Request, Response } from 'express';
import { stripe, PLATFORM_FEE_PERCENT, CURRENCY } from '../config/stripe';
import { Payment, NursePayoutAccount, Booking } from '../models';
import { ApiError } from '../middleware/errorHandler';
import { config } from '../config/env';
import { v4 as uuidv4 } from 'uuid';

// ─── Create Payment Intent ─────────────────────────────────────────────────────
// Called when patient confirms booking - creates a Stripe PaymentIntent
// with automatic platform fee splitting via Connect

export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  const { bookingId } = req.body;
  const patientId = req.user!.userId;

  // 1. Fetch booking
  const booking = await Booking.findOne({ _id: bookingId, patientId });
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.billing.isPaid) {
    throw new ApiError(400, 'This booking is already paid');
  }

  // 2. Check nurse has a connected Stripe account
  const nursePayoutAccount = await NursePayoutAccount.findOne({
    nurseId: booking.nurseId,
    isOnboarded: true,
  });

  // Amount in cents for Stripe
  const amountInCents = Math.round(booking.billing.totalAmount * 100);
  const platformFeeInCents = Math.round(booking.billing.platformFee * 100);

  let paymentIntentId: string;
  let clientSecret: string;

  if (stripe) {
    // Real Stripe mode
    const paymentIntentParams: any = {
      amount: amountInCents,
      currency: CURRENCY,
      metadata: {
        bookingId: bookingId,
        patientId: patientId,
        nurseId: booking.nurseId.toString(),
      },
      automatic_payment_methods: { enabled: true },
    };

    if (nursePayoutAccount) {
      paymentIntentParams.transfer_data = {
        destination: nursePayoutAccount.stripeConnectAccountId,
      };
      paymentIntentParams.application_fee_amount = platformFeeInCents;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
    paymentIntentId = paymentIntent.id;
    clientSecret = paymentIntent.client_secret;
  } else {
    // Mock mode for development
    paymentIntentId = `pi_mock_${uuidv4()}`;
    clientSecret = `${paymentIntentId}_secret_mock`;
  }

  // 4. Save payment record
  await Payment.create({
    bookingId,
    patientId,
    nurseId: booking.nurseId,
    stripePaymentIntentId: paymentIntentId,
    amount: booking.billing.totalAmount,
    platformFee: booking.billing.platformFee,
    nurseEarnings: booking.billing.totalAmount - booking.billing.platformFee - booking.billing.tax,
    currency: CURRENCY,
    status: 'pending',
  });

  res.json({
    success: true,
    data: {
      clientSecret,
      paymentIntentId,
      amount: booking.billing.totalAmount,
      currency: CURRENCY,
    },
  });
};

// ─── Stripe Webhook Handler ────────────────────────────────────────────────────
// Handles payment lifecycle events from Stripe

export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body
      sig,
      config.stripe.webhookSecret
    );
  } catch (err: any) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    res.status(400).json({ error: 'Webhook signature verification failed' });
    return;
  }

  // Handle events
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as any;
      await handlePaymentSuccess(paymentIntent);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as any;
      await handlePaymentFailure(paymentIntent);
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as any;
      await handleRefund(charge);
      break;
    }

    case 'account.updated': {
      const account = event.data.object as any;
      await handleAccountUpdate(account);
      break;
    }

    default:
      console.log(`[Stripe Webhook] Unhandled event: ${event.type}`);
  }

  res.json({ received: true });
};

// ─── Internal Handlers ─────────────────────────────────────────────────────────

async function handlePaymentSuccess(paymentIntent: any) {
  const payment = await Payment.findOne({
    stripePaymentIntentId: paymentIntent.id,
  });

  if (!payment) return;

  payment.status = 'succeeded';
  payment.paidAt = new Date();
  payment.paymentMethod = {
    type: paymentIntent.payment_method_types?.[0] || 'card',
    last4: paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.last4,
    brand: paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.brand,
  };
  await payment.save();

  // Update booking payment status
  await Booking.findByIdAndUpdate(payment.bookingId, {
    'billing.isPaid': true,
    'billing.paymentId': paymentIntent.id,
    'billing.paymentMethod': 'stripe',
    status: 'confirmed', // Auto-confirm on payment
  });

  // Send notification to nurse
  const { notificationService } = require('../services/notification.service');
  await notificationService.send({
    userId: payment.nurseId.toString(),
    type: 'payment',
    title: 'Payment Received',
    body: `You received $${payment.nurseEarnings.toFixed(2)} for a booking.`,
    data: { bookingId: payment.bookingId.toString() },
    channels: ['push', 'in_app'],
  });

  console.log(`[Payment] Success: ${paymentIntent.id} - $${payment.amount}`);
}

async function handlePaymentFailure(paymentIntent: any) {
  await Payment.findOneAndUpdate(
    { stripePaymentIntentId: paymentIntent.id },
    { status: 'failed' }
  );
  console.log(`[Payment] Failed: ${paymentIntent.id}`);
}

async function handleRefund(charge: any) {
  const paymentIntentId = charge.payment_intent;
  const refundAmount = charge.amount_refunded / 100;

  await Payment.findOneAndUpdate(
    { stripePaymentIntentId: paymentIntentId },
    {
      status: charge.refunded ? 'refunded' : 'partially_refunded',
      refund: {
        amount: refundAmount,
        reason: charge.refunds?.data?.[0]?.reason || 'requested',
        stripeRefundId: charge.refunds?.data?.[0]?.id,
        refundedAt: new Date(),
      },
    }
  );
}

async function handleAccountUpdate(account: any) {
  await NursePayoutAccount.findOneAndUpdate(
    { stripeConnectAccountId: account.id },
    {
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      isOnboarded: account.details_submitted && account.payouts_enabled,
    }
  );
}

// ─── Create Nurse Stripe Connect Account ───────────────────────────────────────
// Onboards a nurse to receive payments via Stripe Connect

export const createConnectAccount = async (req: Request, res: Response): Promise<void> => {
  const nurseId = req.user!.userId;

  // Check if already exists
  const existing = await NursePayoutAccount.findOne({ nurseId });
  if (existing) {
    // Return onboarding link to continue
    const accountLink = await stripe.accountLinks.create({
      account: existing.stripeConnectAccountId,
      refresh_url: `${config.clientUrl}/nurse/settings/payments?refresh=true`,
      return_url: `${config.clientUrl}/nurse/settings/payments?success=true`,
      type: 'account_onboarding',
    });

    res.json({ success: true, data: { url: accountLink.url } });
    return;
  }

  // Create new Connect account
  const account = await stripe.accounts.create({
    type: 'express',
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    metadata: { nurseId },
  });

  // Save to DB
  await NursePayoutAccount.create({
    nurseId,
    stripeConnectAccountId: account.id,
  });

  // Generate onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${config.clientUrl}/nurse/settings/payments?refresh=true`,
    return_url: `${config.clientUrl}/nurse/settings/payments?success=true`,
    type: 'account_onboarding',
  });

  res.json({ success: true, data: { url: accountLink.url } });
};

// ─── Request Refund ────────────────────────────────────────────────────────────

export const requestRefund = async (req: Request, res: Response): Promise<void> => {
  const { paymentId, reason, amount } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  if (payment.status !== 'succeeded') {
    throw new ApiError(400, 'Can only refund successful payments');
  }

  const refundAmount = amount ? Math.round(amount * 100) : undefined; // Partial or full

  const refund = await stripe.refunds.create({
    payment_intent: payment.stripePaymentIntentId,
    amount: refundAmount,
    reason: 'requested_by_customer',
    metadata: { reason },
  });

  res.json({
    success: true,
    message: 'Refund initiated',
    data: {
      refundId: refund.id,
      amount: (refund.amount || 0) / 100,
      status: refund.status,
    },
  });
};

// ─── Get Payment History ───────────────────────────────────────────────────────

export const getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const { page = 1, limit = 20 } = req.query;

  const query: any = {};
  if (userRole === 'patient') query.patientId = userId;
  else if (userRole === 'nurse') query.nurseId = userId;

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(50, parseInt(limit as string, 10));

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate('bookingId', 'scheduledDate serviceType status')
      .populate('patientId', 'firstName lastName')
      .populate('nurseId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Payment.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      payments,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    },
  });
};

// ─── Get Nurse Earnings Dashboard ──────────────────────────────────────────────

export const getNurseEarnings = async (req: Request, res: Response): Promise<void> => {
  const nurseId = req.user!.userId;
  const { period = '30d' } = req.query;

  const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - periodDays);

  const [earnings, payoutAccount] = await Promise.all([
    Payment.aggregate([
      {
        $match: {
          nurseId: new (require('mongoose').Types.ObjectId)(nurseId),
          status: 'succeeded',
          paidAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$nurseEarnings' },
          totalBookings: { $sum: 1 },
          avgPerBooking: { $avg: '$nurseEarnings' },
        },
      },
    ]),
    NursePayoutAccount.findOne({ nurseId }),
  ]);

  // Daily breakdown for chart
  const dailyEarnings = await Payment.aggregate([
    {
      $match: {
        nurseId: new (require('mongoose').Types.ObjectId)(nurseId),
        status: 'succeeded',
        paidAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
        amount: { $sum: '$nurseEarnings' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    data: {
      summary: earnings[0] || { totalEarnings: 0, totalBookings: 0, avgPerBooking: 0 },
      dailyEarnings,
      payoutAccount: payoutAccount ? {
        isOnboarded: payoutAccount.isOnboarded,
        payoutsEnabled: payoutAccount.payoutsEnabled,
      } : null,
    },
  });
};
