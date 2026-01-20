import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  reminderId?: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'medicine' | 'appointment' | 'checkup' | 'system';
  status: 'sent' | 'read' | 'dismissed' | 'snoozed';
  priority: 'low' | 'medium' | 'high';
  scheduledFor: Date;
  sentAt?: Date;
  readAt?: Date;
  dismissedAt?: Date;
  snoozedUntil?: Date;
  soundEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reminderId: { type: Schema.Types.ObjectId, ref: 'Reminder', index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['medicine', 'appointment', 'checkup', 'system'],
      default: 'medicine',
    },
    status: {
      type: String,
      enum: ['sent', 'read', 'dismissed', 'snoozed'],
      default: 'sent',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    scheduledFor: { type: Date, required: true, index: true },
    sentAt: { type: Date },
    readAt: { type: Date },
    dismissedAt: { type: Date },
    snoozedUntil: { type: Date },
    soundEnabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ userId: 1, status: 1, createdAt: -1 });
notificationSchema.index({ scheduledFor: 1, status: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
