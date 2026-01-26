import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { setupSignalingHandler } from '../sockets/signalingHandler';
import { setupCaregiverHandler } from '../sockets/caregiverHandler';
import logger from './logger';
import jwt from 'jsonwebtoken';
import { env } from './env';

let io: Server;

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:5000",
                "http://localhost:8080",
                process.env.FRONTEND_URL || ""
            ].filter(Boolean),
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Setup WebRTC signaling handler
    setupSignalingHandler(io);

    // Setup Caregiver real-time handler
    setupCaregiverHandler(io);

    // Setup notification authentication handler
    io.on('connection', (socket: Socket) => {
        // Authenticate socket connection for notifications
        socket.on('authenticate', (token: string) => {
            try {
                const decoded = jwt.verify(token, env.JWT_SECRET) as any;
                const userId = decoded.id || decoded._id;

                if (userId) {
                    // Join user-specific room for notifications
                    socket.join(`user:${userId}`);
                    socket.data.userId = userId;
                    logger.info(`Socket authenticated for notifications - user: ${userId}, socket: ${socket.id}`);

                    socket.emit('authenticated', { success: true });
                } else {
                    socket.emit('authenticated', { success: false, error: 'Invalid token' });
                }
            } catch (error) {
                logger.error('Socket authentication error:', error);
                socket.emit('authenticated', { success: false, error: 'Invalid token' });
            }
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
