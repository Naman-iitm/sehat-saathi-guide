import { Server, Socket } from 'socket.io';
import logger from '../config/logger';

export const setupCaregiverHandler = (io: Server) => {
    // We can use a namespace or just the main namespace
    // Upstream seems to use the main namespace in its class version (this.io)
    // But my version used /caregivers namespace. I'll stick to namespaces for better organization.
    const caregiverNamespace = io.of('/caregivers');

    caregiverNamespace.on('connection', (socket: Socket) => {
        logger.info(`Caregiver socket connected: ${socket.id}`);

        // Join a specific room (e.g., patient's ID)
        socket.on('join_patient_room', (patientId: string) => {
            socket.join(`patient:${patientId}`);
            logger.info(`Socket ${socket.id} joined patient room: ${patientId}`);
        });

        // Handle SOS Alert (My event name)
        socket.on('trigger_sos', (data: { patientId: string; location: any }) => {
            logger.warn(`SOS Alert (trigger_sos) for patient ${data.patientId}`);
            caregiverNamespace.to(`patient:${data.patientId}`).emit('sos_alert', {
                patientId: data.patientId,
                location: data.location,
                timestamp: new Date().toISOString(),
                message: "EMERGENCY! Patient needs help immediately.",
            });
        });

        // Support Upstream event name for SOS
        socket.on('send_sos', (data: { patientId: string; location: any }) => {
            logger.warn(`SOS Alert (send_sos) for patient ${data.patientId}`);
            caregiverNamespace.to(`patient:${data.patientId}`).emit('sos_alert', data);
        });

        // Handle Medication Updates (My event name)
        socket.on('medication_update', (data: { patientId: string; medicine: string; status: string }) => {
            logger.info(`Medication update for ${data.patientId}: ${data.medicine} - ${data.status}`);
            caregiverNamespace.to(`patient:${data.patientId}`).emit('patient_medication_update', data);
        });

        // Support Upstream event name for Medication
        socket.on('medication_taken', (data: { patientId: string; medicine: string }) => {
            logger.info(`Medication taken for ${data.patientId}: ${data.medicine}`);
            caregiverNamespace.to(`patient:${data.patientId}`).emit('patient_medication_update', {
                ...data,
                status: 'taken'
            });
        });

        socket.on('disconnect', () => {
            logger.info(`Caregiver socket disconnected: ${socket.id}`);
        });
    });
};
