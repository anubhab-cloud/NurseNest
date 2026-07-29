import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine extends Document {
  patientId: mongoose.Types.ObjectId;
  name: string;
  dosage?: string;
  time: string;
  type: string;
  color: string;
  taken: boolean;
  frequency: string;
  instructions?: string;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    dosage: { type: String, default: '1 tablet' },
    time: { type: String, required: true }, // e.g. "8:00 AM"
    type: { type: String, default: 'General' }, // e.g. "Diabetes", "Blood Pressure"
    color: { type: String, default: 'bg-blue-100 text-blue-700' },
    taken: { type: Boolean, default: false },
    frequency: { type: String, default: 'Daily' },
    instructions: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IMedicine>('Medicine', MedicineSchema);
