import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  category: string;
  features: string[];
  startingPrice: number;
  isActive: boolean;
  order: number;
}

const serviceSchema = new Schema<IService>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  features: [{ type: String }],
  startingPrice: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IService>('Service', serviceSchema);
