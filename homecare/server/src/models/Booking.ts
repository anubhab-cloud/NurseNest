import mongoose, { Document, Schema } from 'mongoose';

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface IBooking extends Document {
  patientId: mongoose.Types.ObjectId;
  nurseId: mongoose.Types.ObjectId;
  nurseProfileId: mongoose.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  serviceType: string;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  duration: number; // in hours
  location: {
    address: string;
    city: string;
    coordinates: [number, number];
  };
  billing: {
    rateType: 'hourly' | 'daily';
    rate: number;
    totalHours: number;
    subtotal: number;
    tax: number;
    platformFee: number;
    totalAmount: number;
    isPaid: boolean;
    paymentMethod?: string;
    paymentId?: string;
  };
  notes: {
    patientNotes?: string;
    nurseNotes?: string;
    adminNotes?: string;
  };
  cancellation?: {
    cancelledBy: 'patient' | 'nurse' | 'admin';
    reason: string;
    cancelledAt: Date;
    refundAmount?: number;
  };
  rating?: {
    score: number;
    review: string;
    createdAt: Date;
  };
  lockExpiresAt?: Date; // For double-booking prevention
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ────────────────────────────────────────────────────────────────────

const bookingSchema = new Schema<IBooking>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required'],
    },
    nurseId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Nurse ID is required'],
    },
    nurseProfileId: {
      type: Schema.Types.ObjectId,
      ref: 'NurseProfile',
      required: [true, 'Nurse Profile ID is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
        message: 'Invalid booking status',
      },
      default: 'pending',
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      enum: [
        'elderly-care',
        'post-operative',
        'pediatric',
        'wound-care',
        'physiotherapy',
        'palliative',
        'maternal',
        'mental-health',
        'chronic-disease',
        'general',
      ],
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: 'Scheduled date must be in the future',
      },
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:MM format'],
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:MM format'],
    },
    duration: {
      type: Number,
      required: true,
      min: [1, 'Duration must be at least 1 hour'],
      max: [24, 'Duration cannot exceed 24 hours'],
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    billing: {
      rateType: {
        type: String,
        enum: ['hourly', 'daily'],
        required: true,
      },
      rate: { type: Number, required: true, min: 0 },
      totalHours: { type: Number, required: true, min: 0 },
      subtotal: { type: Number, required: true, min: 0 },
      tax: { type: Number, default: 0, min: 0 },
      platformFee: { type: Number, default: 0, min: 0 },
      totalAmount: { type: Number, required: true, min: 0 },
      isPaid: { type: Boolean, default: false },
      paymentMethod: { type: String },
      paymentId: { type: String },
    },
    notes: {
      patientNotes: { type: String, maxlength: 500 },
      nurseNotes: { type: String, maxlength: 500 },
      adminNotes: { type: String, maxlength: 500 },
    },
    cancellation: {
      cancelledBy: {
        type: String,
        enum: ['patient', 'nurse', 'admin'],
      },
      reason: { type: String },
      cancelledAt: { type: Date },
      refundAmount: { type: Number, min: 0 },
    },
    rating: {
      score: { type: Number, min: 1, max: 5 },
      review: { type: String, maxlength: 500 },
      createdAt: { type: Date },
    },
    lockExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────────

// Critical: compound index for double-booking prevention queries
bookingSchema.index(
  { nurseId: 1, scheduledDate: 1, startTime: 1, endTime: 1, status: 1 },
  { name: 'nurse_schedule_lookup' }
);

bookingSchema.index({ patientId: 1, status: 1, scheduledDate: -1 });
bookingSchema.index({ nurseId: 1, status: 1, scheduledDate: -1 });
bookingSchema.index({ status: 1, scheduledDate: 1 });
bookingSchema.index({ lockExpiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL for expired locks

// ─── Export ────────────────────────────────────────────────────────────────────

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;
