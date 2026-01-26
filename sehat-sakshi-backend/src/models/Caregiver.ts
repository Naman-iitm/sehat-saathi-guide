import mongoose, { Document, Schema } from 'mongoose';

export interface ICaregiver extends Document {
    patientId: mongoose.Types.ObjectId;
    caregiverId?: mongoose.Types.ObjectId; // Link to User model if registered
    caregiverEmail: string;
    name?: string; // Caregiver display name
    relationship: string;
    permissions: {
        canViewSymptoms: boolean;
        canViewMedicines: boolean;
        canViewVitals: boolean;
        canViewAppointments: boolean;
        canReceiveAlerts: boolean;
        canReceiveSOS: boolean;
    };
    status: 'pending' | 'active' | 'rejected';
    createdAt: Date;
}

const caregiverSchema = new Schema<ICaregiver>({
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caregiverId: { type: Schema.Types.ObjectId, ref: 'User' },
    caregiverEmail: { type: String, required: true },
    name: { type: String },
    relationship: { type: String, required: true },
    permissions: {
        canViewSymptoms: { type: Boolean, default: true },
        canViewMedicines: { type: Boolean, default: true },
        canViewVitals: { type: Boolean, default: true },
        canViewAppointments: { type: Boolean, default: true },
        canReceiveAlerts: { type: Boolean, default: true },
        canReceiveSOS: { type: Boolean, default: true },
    },
    status: { type: String, enum: ['pending', 'active', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

// Index to prevent duplicate invites/links
caregiverSchema.index({ patientId: 1, caregiverEmail: 1 }, { unique: true });
caregiverSchema.index({ patientId: 1, caregiverId: 1 }, { unique: true, sparse: true });

export const Caregiver = mongoose.model<ICaregiver>('Caregiver', caregiverSchema);
