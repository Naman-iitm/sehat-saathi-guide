import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class NotificationManager {
    private socket: Socket;
    private listeners: ((notification: any) => void)[] = [];

    constructor() {
        this.socket = io(SOCKET_URL, {
            withCredentials: true,
            autoConnect: false,
        });

        this.socket.on('connect', () => {
            console.log('Connected to notification service');
        });

        this.socket.on('notification', (notification) => {
            this.notifyListeners(notification);
            // Also trigger browser notification if permission is granted
            this.showBrowserNotification(notification);
        });
    }

    public connect(userId: string) {
        if (!this.socket.connected) {
            this.socket.connect();
            // Wait for connection to ensure emit works? Or just emit immediately (socket.io buffers)
            this.socket.emit('join_check', userId);
        }
    }

    public disconnect() {
        if (this.socket.connected) {
            this.socket.disconnect();
        }
    }

    public onNotification(callback: (notification: any) => void) {
        this.listeners.push(callback);
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    private notifyListeners(notification: any) {
        this.listeners.forEach(listener => listener(notification));
    }

    // --- Browser Push Notifications ---

    public async requestPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support desktop notification');
            return;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted');
            }
        }
    }

    private showBrowserNotification(data: any) {
        if (Notification.permission === 'granted') {
            new Notification(data.title, {
                body: data.message,
                icon: '/health-care.png', // Assuming this exists in public folder
                // badge: '/badge.png' 
            });

            // Play sound
            this.playAlertSound(data.type);
        }
    }

    private playAlertSound(type: string) {
        // Simple logic: Critical reminders get a sound
        if (type === 'medication' || type === 'reminder') {
            const audio = new Audio('/sounds/notification.mp3'); // Need to ensure file exists or use Data URI
            audio.play().catch(e => console.log("Audio play failed (interaction needed):", e));
        }
    }
}

export const notificationManager = new NotificationManager();
