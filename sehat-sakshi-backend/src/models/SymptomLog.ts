import mongoose, { Document, Schema } from 'mongoose';

export interface ISymptomLog extends Document {
  userId: mongoose.Types.ObjectId;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  notes: string;
  triageResult?: {
    level: string;
    recommendation: string;
  };
  createdAt: Date;
}

const symptomLogSchema = new Schema<ISymptomLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  symptoms: [{ type: String }],
  severity: { type: String, enum: ['mild', 'moderate', 'severe'], default: 'mild' },
  notes: { type: String, default: '' },
  triageResult: {
    level: { type: String },
    recommendation: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

export const SymptomLog = mongoose.model<ISymptomLog>('SymptomLog', symptomLogSchema);
