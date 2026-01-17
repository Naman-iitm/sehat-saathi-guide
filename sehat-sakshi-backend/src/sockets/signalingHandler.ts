import { Server, Socket } from 'socket.io';
import { Appointment } from '../models/Appointment';

export const setupSignalingHandler = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('join-room', async ({ appointmentId, role }) => {
            try {
                // Security check: Verify appointment exists and is scheduled for around now
                const appointment = await Appointment.findById(appointmentId);

                if (!appointment) {
                    socket.emit('error', 'Appointment not found');
                    return;
                }

                // Potential check: status should be 'confirmed'
                // Potential check: time should be within +/- 30 mins

                socket.join(appointmentId);
                console.log(`User ${socket.id} joined room ${appointmentId} as ${role}`);

                // Notify others in the room
                socket.to(appointmentId).emit('user-joined', { socketId: socket.id, role });
            } catch (error) {
                console.error('Error joining room:', error);
                socket.emit('error', 'Failed to join room');
            }
        });

        // WebRTC Signaling
        socket.on('offer', ({ to, offer }) => {
            socket.to(to).emit('offer', { from: socket.id, offer });
        });

        socket.on('answer', ({ to, answer }) => {
            socket.to(to).emit('answer', { from: socket.id, answer });
        });

        socket.on('ice-candidate', ({ to, candidate }) => {
            socket.to(to).emit('ice-candidate', { from: socket.id, candidate });
        });

        // Chat
        socket.on('send-message', ({ appointmentId, message, senderName }) => {
            const chatMessage = {
                senderName,
                text: message,
                timestamp: new Date().toISOString()
            };
            io.to(appointmentId).emit('receive-message', chatMessage);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
