import mongoose, { Document, Schema } from 'mongoose';

export interface ISOSAlert extends Document {
    userId: mongoose.Types.ObjectId;
    location: {
        latitude: number;
        longitude: number;
    };
    status: 'active' | 'resolved';
    resolvedAt?: Date;
    notifiedContacts: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const sosAlertSchema = new Schema<ISOSAlert>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    status: { type: String, enum: ['active', 'resolved'], default: 'active' },
    resolvedAt: { type: Date },
    notifiedContacts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
});

export const SOSAlert = mongoose.model<ISOSAlert>('SOSAlert', sosAlertSchema);
