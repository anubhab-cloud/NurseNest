import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  patient: mongoose.Types.ObjectId;
  nurse: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nurse: { type: Schema.Types.ObjectId, ref: 'NurseProfile', required: true },
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 500 },
  isApproved: { type: Boolean, default: true },
}, { timestamps: true });

reviewSchema.index({ nurse: 1 });
reviewSchema.index({ patient: 1 });

export default mongoose.model<IReview>('Review', reviewSchema);
