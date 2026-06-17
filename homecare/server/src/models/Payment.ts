import mongoose, { Document, Schema } from 'mongoose';

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  nurseId: mongoose.Types.ObjectId;
  stripePaymentIntentId: string;
  stripeCustomerId?: string;
  amount: number;
  platformFee: number;
  nurseEarnings: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'partially_refunded';
  paymentMethod: {
    type: string;  // 'card', 'bank_transfer', etc.
    last4?: string;
    brand?: string;
  };
  refund?: {
    amount: number;
    reason: string;
    stripeRefundId: string;
    refundedAt: Date;
  };
  metadata?: Record<string, string>;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface INursePayoutAccount extends Document {
  nurseId: mongoose.Types.ObjectId;
  stripeConnectAccountId: string;
  isOnboarded: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  defaultCurrency: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayout extends Document {
  nurseId: mongoose.Types.ObjectId;
  stripePayoutId: string;
  stripeConnectAccountId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'in_transit' | 'paid' | 'failed' | 'cancelled';
  arrivalDate: Date;
  bookingIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Payment Schema ────────────────────────────────────────────────────────────

const paymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    nurseId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeCustomerId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    platformFee: {
      type: Number,
      required: true,
      min: 0,
    },
    nurseEarnings: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'usd',
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: { type: String },
      last4: { type: String },
      brand: { type: String },
    },
    refund: {
      amount: { type: Number },
      reason: { type: String },
      stripeRefundId: { type: String },
      refundedAt: { type: Date },
    },
    metadata: {
      type: Map,
      of: String,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// ─── Nurse Payout Account Schema ───────────────────────────────────────────────

const nursePayoutAccountSchema = new Schema<INursePayoutAccount>(
  {
    nurseId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    stripeConnectAccountId: {
      type: String,
      required: true,
      unique: true,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    payoutsEnabled: {
      type: Boolean,
      default: false,
    },
    detailsSubmitted: {
      type: Boolean,
      default: false,
    },
    defaultCurrency: {
      type: String,
      default: 'usd',
    },
    country: {
      type: String,
      default: 'US',
    },
  },
  { timestamps: true }
);

// ─── Payout Schema ─────────────────────────────────────────────────────────────

const payoutSchema = new Schema<IPayout>(
  {
    nurseId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stripePayoutId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeConnectAccountId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'usd',
    },
    status: {
      type: String,
      enum: ['pending', 'in_transit', 'paid', 'failed', 'cancelled'],
      default: 'pending',
    },
    arrivalDate: {
      type: Date,
    },
    bookingIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    }],
  },
  { timestamps: true }
);

// ─── Indexes ───────────────────────────────────────────────────────────────────

paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ patientId: 1, status: 1, createdAt: -1 });
paymentSchema.index({ nurseId: 1, status: 1, createdAt: -1 });
paymentSchema.index({ stripePaymentIntentId: 1 }, { unique: true });
paymentSchema.index({ status: 1, createdAt: -1 });

payoutSchema.index({ nurseId: 1, status: 1 });
payoutSchema.index({ stripePayoutId: 1 }, { unique: true });

// ─── Export ────────────────────────────────────────────────────────────────────

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
export const NursePayoutAccount = mongoose.model<INursePayoutAccount>('NursePayoutAccount', nursePayoutAccountSchema);
export const Payout = mongoose.model<IPayout>('Payout', payoutSchema);
