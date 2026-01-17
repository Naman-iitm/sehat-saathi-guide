import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'medication' | 'appointment' | 'system' | 'reminder';
    priority: 'low' | 'normal' | 'high';
    isRead: boolean;
    actionUrl?: string; // Link to related resource
    metadata?: any; // Flexible field for extra data (e.g. reminderId)
    createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['medication', 'appointment', 'system', 'reminder'],
            default: 'system',
        },
        priority: {
            type: String,
            enum: ['low', 'normal', 'high'],
            default: 'normal',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        actionUrl: {
            type: String,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

// Index for getting unread notifications quickly
notificationSchema.index({ user: 1, isRead: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
