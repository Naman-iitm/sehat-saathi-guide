import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { setupSignalingHandler } from '../sockets/signalingHandler';

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:5000",
                "http://localhost:8080",
                process.env.FRONTEND_URL || ""
            ].filter(Boolean),
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            credentials: true
        },
    });

    // Setup WebRTC Signaling
    setupSignalingHandler(io);

    io.on('connection', (socket: Socket) => {
        console.log('User connected via Socket.io:', socket.id);

        // Join user-specific room for private notifications
        // Client should emit 'join_room' with their User ID after authenticating
        socket.on('join_check', (userId: string) => {
            if (userId) {
                socket.join(userId);
                console.log(`Socket ${socket.id} joined room ${userId}`);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
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

/**
 * Send notification to a specific user
 */
export const sendRealTimeNotification = (userId: string, notification: any) => {
    try {
        const socketIO = getIO();
        socketIO.to(userId).emit('notification', notification);
    } catch (e) {
        console.error("Socket emit failed:", e);
    }
};
