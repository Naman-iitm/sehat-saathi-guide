import mongoose, { Document, Schema } from 'mongoose';

export interface ISOSAlert extends Document {
    userId: mongoose.Types.ObjectId;
    location: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    status: 'active' | 'resolved' | 'false_alarm';
    notifiedContacts: string[]; // List of contact info notified
    triggerTime: Date;
    resolvedAt?: Date;
    createdAt: Date;
}

const sosAlertSchema = new Schema<ISOSAlert>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String },
    },
    status: { type: String, enum: ['active', 'resolved', 'false_alarm'], default: 'active' },
    notifiedContacts: [{ type: String }],
    triggerTime: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

export const SOSAlert = mongoose.model<ISOSAlert>('SOSAlert', sosAlertSchema);
