import mongoose, { Document, Schema } from 'mongoose';

export interface ICaregiver extends Document {
    patientId: mongoose.Types.ObjectId;
    caregiverId: mongoose.Types.ObjectId;
    relationship: string;
    permissions: {
        canViewSymptoms: boolean;
        canViewMedicines: boolean;
        canViewVitals: boolean;
        canReceiveAlerts: boolean;
    };
    status: 'pending' | 'active' | 'rejected';
    createdAt: Date;
}

const caregiverSchema = new Schema<ICaregiver>({
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caregiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    relationship: { type: String, required: true },
    permissions: {
        canViewSymptoms: { type: Boolean, default: true },
        canViewMedicines: { type: Boolean, default: true },
        canViewVitals: { type: Boolean, default: true },
        canReceiveAlerts: { type: Boolean, default: true },
    },
    status: { type: String, enum: ['pending', 'active', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

// Ensure unique link between patient and caregiver
caregiverSchema.index({ patientId: 1, caregiverId: 1 }, { unique: true });

export const Caregiver = mongoose.model<ICaregiver>('Caregiver', caregiverSchema);
