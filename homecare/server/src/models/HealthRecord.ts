import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthRecord extends Document {
  patientId: mongoose.Types.ObjectId;
  nurseId?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  vitals: {
    bp: string; // e.g. "120/80"
    hr: number; // heart rate bpm
    spo2: number; // blood oxygen %
    temp: number; // celsius
    weight: number; // kg
  };
  nurseName?: string;
  notes?: string;
  recordedAt: Date;
}

const HealthRecordSchema = new Schema<IHealthRecord>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    nurseId: { type: Schema.Types.ObjectId, ref: 'User' },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    vitals: {
      bp: { type: String, required: true, default: '120/80' },
      hr: { type: Number, required: true, default: 72 },
      spo2: { type: Number, required: true, default: 98 },
      temp: { type: Number, required: true, default: 36.6 },
      weight: { type: Number, required: true, default: 68 },
    },
    nurseName: { type: String },
    notes: { type: String },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IHealthRecord>('HealthRecord', HealthRecordSchema);
