import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { setupSignalingHandler } from '../sockets/signalingHandler';

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

    setupSignalingHandler(io);
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
