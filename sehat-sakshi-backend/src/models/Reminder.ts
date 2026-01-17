import mongoose, { Document, Schema } from 'mongoose';

export interface IReminder extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  type: 'medicine' | 'appointment' | 'checkup';
  date: string;
  time: string;
  recurrence: 'once' | 'daily' | 'weekly' | 'monthly';
  dosage?: string;
  enabled: boolean;
  createdAt: Date;
}

const reminderSchema = new Schema<IReminder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['medicine', 'appointment', 'checkup'], default: 'medicine' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  recurrence: { type: String, enum: ['once', 'daily', 'weekly', 'monthly'], default: 'once' },
  dosage: { type: String },
  enabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Reminder = mongoose.model<IReminder>('Reminder', reminderSchema);
