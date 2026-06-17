import mongoose, { Document, Schema } from 'mongoose';

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface IAvailabilitySlot {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // "09:00" (24h format)
  endTime: string;   // "17:00"
  isAvailable: boolean;
}

export interface ICertification {
  name: string;
  issuingBody: string;
  issueDate: Date;
  expiryDate?: Date;
  documentUrl?: string;
}

export interface INurseProfile extends Document {
  userId: mongoose.Types.ObjectId;
  specializations: string[];
  certifications: ICertification[];
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationNotes?: string;
  bio: string;
  yearsOfExperience: number;
  hourlyRate: number;
  dailyRate: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  serviceRadius: number; // in kilometers
  availability: IAvailabilitySlot[];
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  isOnline: boolean;
  languages: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ────────────────────────────────────────────────────────────────────

const availabilitySlotSchema = new Schema<IAvailabilitySlot>(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format'],
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const certificationSchema = new Schema<ICertification>(
  {
    name: { type: String, required: true },
    issuingBody: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date },
    documentUrl: { type: String },
  },
  { _id: false }
);

const nurseProfileSchema = new Schema<INurseProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specializations: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one specialization is required',
      },
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
    certifications: {
      type: [certificationSchema],
      default: [],
    },
    verificationStatus: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Verification status must be pending, approved, or rejected',
      },
      default: 'pending',
    },
    verificationNotes: {
      type: String,
      maxlength: 500,
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      minlength: [50, 'Bio must be at least 50 characters'],
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: [0, 'Years of experience cannot be negative'],
      max: [50, 'Years of experience cannot exceed 50'],
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [10, 'Minimum hourly rate is $10'],
    },
    dailyRate: {
      type: Number,
      required: [true, 'Daily rate is required'],
      min: [50, 'Minimum daily rate is $50'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (v: number[]) {
            return (
              v.length === 2 &&
              v[0] >= -180 && v[0] <= 180 && // longitude
              v[1] >= -90 && v[1] <= 90       // latitude
            );
          },
          message: 'Invalid coordinates',
        },
      },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    serviceRadius: {
      type: Number,
      default: 25,
      min: [1, 'Service radius must be at least 1 km'],
      max: [100, 'Service radius cannot exceed 100 km'],
    },
    availability: {
      type: [availabilitySlotSchema],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    languages: {
      type: [String],
      default: ['English'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────────

// GeoSpatial index for proximity search (critical for marketplace)
nurseProfileSchema.index({ 'location': '2dsphere' });

// Compound indexes for filtered queries
nurseProfileSchema.index({ verificationStatus: 1, isOnline: 1 });
nurseProfileSchema.index({ specializations: 1, averageRating: -1 });
nurseProfileSchema.index({ hourlyRate: 1, averageRating: -1 });
nurseProfileSchema.index({ userId: 1 });

// ─── Export ────────────────────────────────────────────────────────────────────

const NurseProfile = mongoose.model<INurseProfile>('NurseProfile', nurseProfileSchema);
export default NurseProfile;
