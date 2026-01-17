import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    date: Date;
    startTime: string; // "10:00"
    endTime: string; // "10:30"
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    type: 'online' | 'in-person';
    symptoms?: string;
    notes?: string;
    cancellationReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        doctor: {
            type: Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
        type: {
            type: String,
            enum: ['online', 'in-person'],
            default: 'in-person',
        },
        symptoms: { type: String },
        notes: { type: String },
        cancellationReason: { type: String },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure no double booking for the same doctor at the same time
// This is critical for the concurrency requirement
appointmentSchema.index({ doctor: 1, date: 1, startTime: 1 }, { unique: true, partialFilterExpression: { status: { $ne: 'cancelled' } } });

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
