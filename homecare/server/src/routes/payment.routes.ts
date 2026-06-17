import { Router } from 'express';
import {
  createPaymentIntent,
  stripeWebhook,
  createConnectAccount,
  requestRefund,
  getPaymentHistory,
  getNurseEarnings,
} from '../controllers/payment.controller';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import express from 'express';

const router = Router();

// Stripe webhook - needs raw body (no JSON parsing)
// This must be registered BEFORE express.json() middleware in the main app
// or handled separately. We handle it here with raw body.
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  asyncHandler(stripeWebhook)
);

// Authenticated routes
router.use(authenticate);

// Patient: create payment
router.post('/create-intent', authorize('patient'), asyncHandler(createPaymentIntent));

// Patient/Nurse: payment history
router.get('/history', asyncHandler(getPaymentHistory));

// Nurse: earnings dashboard
router.get('/earnings', authorize('nurse'), asyncHandler(getNurseEarnings));

// Nurse: setup payout account
router.post('/connect-account', authorize('nurse'), asyncHandler(createConnectAccount));

// Admin: process refund
router.post('/refund', authorize('admin'), asyncHandler(requestRefund));

export default router;
