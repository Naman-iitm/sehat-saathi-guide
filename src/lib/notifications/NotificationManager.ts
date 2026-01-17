import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class NotificationManager {
    private socket: Socket;
    private listeners: ((notification: any) => void)[] = [];
    private currentUserId: string | null = null;
    private audioContext: AudioContext | null = null;

    constructor() {
        this.socket = io(SOCKET_URL, {
            withCredentials: true,
            autoConnect: false,
        });

        this.socket.on('connect', () => {
            console.log('Connected to notification service');
            if (this.currentUserId) {
                this.socket.emit('join_check', this.currentUserId);
            }
        });

        this.socket.on('notification', (notification) => {
            this.notifyListeners(notification);
            this.showBrowserNotification(notification);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    }

    public connect(userId: string) {
        this.currentUserId = userId;
        if (!this.socket.connected) {
            this.socket.connect();
            // join_check will be emitted on 'connect' event to handle re-connections
        } else {
            this.socket.emit('join_check', userId);
        }
    }

    public disconnect() {
        this.currentUserId = null;
        if (this.socket.connected) {
            this.socket.disconnect();
        }
    }

    public onNotification(callback: (notification: any) => void) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    private notifyListeners(notification: any) {
        this.listeners.forEach(listener => listener(notification));
    }

    // --- Browser Push Notifications ---

    public async requestPermission() {
        if (!('Notification' in window)) return;

        if (Notification.permission !== 'denied') {
            await Notification.requestPermission();
        }
    }

    private showBrowserNotification(data: any) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(data.title, {
                body: data.message,
                icon: '/health-care.png',
                tag: 'sehat-saathi-notification', // Replace same tag to avoid clutter
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            this.playAlertSound(data.type);
        }
    }

    private playAlertSound(type: string) {
        if (type === 'medication' || type === 'reminder') {
            try {
                // Using a slightly more robust way to play sound if context is allowed
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.volume = 0.5;
                audio.play().catch(() => {
                    // Fallback: บางทีเบราว์เซอร์บล็อกการเล่นเสียงถ้าไม่มีการตอบสนองจากผู้ใช้
                    console.log("Audio play blocked by browser policy");
                });
            } catch (e) {
                console.error("Failed to play sound", e);
            }
        }
    }
}

export const notificationManager = new NotificationManager();
