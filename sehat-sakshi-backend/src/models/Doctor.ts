import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
    user: mongoose.Types.ObjectId; // Link to User model
    specialization: string;
    qualifications: string[];
    experience: number; // in years
    clinicName: string;
    clinicAddress: string;
    consultationFee: number;
    rating: number;
    reviewCount: number;
    availability: {
        day: string; // "Monday", "Tuesday", etc.
        startTime: string; // "09:00"
        endTime: string; // "17:00"
        isAvailable: boolean;
    }[];
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        specialization: {
            type: String,
            required: true,
            trim: true,
        },
        qualifications: {
            type: [String],
            required: true,
        },
        experience: {
            type: Number,
            required: true,
            min: 0,
        },
        clinicName: {
            type: String,
            required: true,
            trim: true,
        },
        clinicAddress: {
            type: String,
            required: true,
        },
        consultationFee: {
            type: Number,
            required: true,
            min: 0,
        },
        rating: {
            type: Number,
            default: 0,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        availability: [
            {
                day: {
                    type: String,
                    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    required: true,
                },
                startTime: { type: String, required: true },
                endTime: { type: String, required: true },
                isAvailable: { type: Boolean, default: true },
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for searching by specialization and location
doctorSchema.index({ specialization: 'text' });

export const Doctor = mongoose.model<IDoctor>('Doctor', doctorSchema);
