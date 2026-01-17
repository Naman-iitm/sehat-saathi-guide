import Peer from 'simple-peer';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class WebRTCService {
    private socket: Socket;
    private peer: Peer.Instance | null = null;
    private stream: MediaStream | null = null;

    constructor() {
        this.socket = io(SOCKET_URL, {
            withCredentials: true,
            autoConnect: false
        });

        this.socket.on('connect', () => {
            console.log('Connected to signaling server');
        });

        this.socket.on('error', (err) => {
            console.error('Socket error:', err);
        });
    }

    public connect(appointmentId: string, role: string) {
        if (!this.socket.connected) {
            this.socket.connect();
        }
        this.socket.emit('join-room', { appointmentId, role });
    }

    public disconnect() {
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
        if (this.socket) {
            this.socket.disconnect();
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }

    public async getUserMedia() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            return this.stream;
        } catch (error) {
            console.error('Error getting user media:', error);
            throw error;
        }
    }

    public createPeer(stream: MediaStream, initiator: boolean, appointmentId: string, onStream: (stream: MediaStream) => void) {
        this.peer = new Peer({
            initiator,
            trickle: false,
            stream
        });

        this.peer.on('signal', (data) => {
            this.socket.emit(initiator ? 'offer' : 'answer', {
                to: this.getTargetSocketId(), // Logic to get the other person's ID from backend or state
                signal: data
            });
        });

        this.peer.on('stream', (remoteStream) => {
            onStream(remoteStream);
        });

        // Handle signaling from socket
        this.socket.on('offer', (data) => {
            if (!initiator) {
                this.peer?.signal(data.signal);
            }
        });

        this.socket.on('answer', (data) => {
            if (initiator) {
                this.peer?.signal(data.signal);
            }
        });

        this.socket.on('ice-candidate', (data) => {
            this.peer?.signal(data.candidate);
        });
    }

    // Simplified for hackathon: assuming 1v1
    private getTargetSocketId() {
        // In a real app, 'user-joined' event would provide this
        return '';
    }

    public onUserJoined(callback: (data: { socketId: string, role: string }) => void) {
        this.socket.on('user-joined', callback);
    }

    public sendMessage(appointmentId: string, message: string, senderName: string) {
        this.socket.emit('send-message', { appointmentId, message, senderName });
    }

    public onReceiveMessage(callback: (message: any) => void) {
        this.socket.on('receive-message', callback);
    }
}

export const webRTCService = new WebRTCService();
