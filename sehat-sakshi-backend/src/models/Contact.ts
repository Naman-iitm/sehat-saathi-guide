import mongoose, { Document, Schema } from 'mongoose';

/**
 * Contact message subject types
 */
export type ContactSubject = 'support' | 'bug' | 'feedback' | 'partnership' | 'other';

/**
 * Contact message status
 */
export type ContactStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';

/**
 * Contact interface
 */
export interface IContact extends Document {
    name: string;
    email: string;
    phone?: string;
    subject: ContactSubject;
    message: string;
    referenceId: string;
    status: ContactStatus;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
    adminNotes?: string;
}

/**
 * Contact Schema
 */
const contactSchema = new Schema<IContact>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name must not exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
        },
        phone: {
            type: String,
            trim: true,
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            enum: {
                values: ['support', 'bug', 'feedback', 'partnership', 'other'],
                message: 'Subject must be one of: support, bug, feedback, partnership, other',
            },
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
            minlength: [10, 'Message must be at least 10 characters'],
            maxlength: [2000, 'Message must not exceed 2000 characters'],
        },
        referenceId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'resolved', 'closed'],
            default: 'pending',
        },
        ipAddress: {
            type: String,
        },
        userAgent: {
            type: String,
        },
        resolvedAt: {
            type: Date,
        },
        adminNotes: {
            type: String,
            maxlength: [1000, 'Admin notes must not exceed 1000 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

/**
 * Generate unique reference ID
 */
export const generateReferenceId = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `SS-${timestamp}-${random}`;
};

export const Contact = mongoose.model<IContact>('Contact', contactSchema);
