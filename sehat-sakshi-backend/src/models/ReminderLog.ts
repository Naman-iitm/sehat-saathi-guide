import mongoose, { Document, Schema } from 'mongoose';

export interface IReminderLog extends Document {
    userId: mongoose.Types.ObjectId;
    reminderId: mongoose.Types.ObjectId;
    status: 'taken' | 'skipped';
    takenAt: Date;
}

const reminderLogSchema = new Schema<IReminderLog>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reminderId: { type: Schema.Types.ObjectId, ref: 'Reminder', required: true },
    status: { type: String, enum: ['taken', 'skipped'], required: true },
    takenAt: { type: Date, default: Date.now },
});

// Index for faster queries
reminderLogSchema.index({ userId: 1, takenAt: -1 });

export const ReminderLog = mongoose.model<IReminderLog>('ReminderLog', reminderLogSchema);
