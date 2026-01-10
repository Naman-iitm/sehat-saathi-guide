import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicalHistory extends Document {
  userId: mongoose.Types.ObjectId;
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  surgeries: string;
  medications: string;
  updatedAt: Date;
}

const medicalHistorySchema = new Schema<IMedicalHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bloodGroup: { type: String, default: '' },
  allergies: { type: String, default: '' },
  chronicConditions: { type: String, default: '' },
  surgeries: { type: String, default: '' },
  medications: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
});

export const MedicalHistory = mongoose.model<IMedicalHistory>('MedicalHistory', medicalHistorySchema);
