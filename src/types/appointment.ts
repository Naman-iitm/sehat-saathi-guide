export interface Appointment {
  id: string;
  hospitalId: string;
  hospitalName: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}





