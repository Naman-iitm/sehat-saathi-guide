import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export interface Notification {
  id: string;
  userId: string;
  reminderId?: string;
  title: string;
  message: string;
  type: 'medicine' | 'appointment' | 'checkup' | 'system';
  status: 'sent' | 'read' | 'dismissed' | 'snoozed';
  priority: 'low' | 'medium' | 'high';
  scheduledFor: string;
  sentAt?: string;
  readAt?: string;
  dismissedAt?: string;
  snoozedUntil?: string;
  soundEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

class NotificationManager {
  private socket: Socket | null = null;
  private isConnected = false;
  private listeners: Map<string, Set<(notification: Notification) => void>> = new Map();
  private unreadCount = 0;
  private unreadCountListeners: Set<(count: number) => void> = new Set();
  private connectionRefCount = 0; // Track how many components are using the connection

  /**
   * Initialize socket connection and authenticate
   * Uses reference counting to manage connection lifecycle
   */
  public connect(token: string): void {
    this.connectionRefCount++;
    
    // If already connected, just increment ref count
    if (this.socket?.connected) {
      return;
    }

    // If socket exists but not connected, reconnect
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
      return;
    }

    // Create new socket connection
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected, authenticating...');
      this.socket?.emit('authenticate', token);
    });

    this.socket.on('authenticated', (data: { success: boolean; error?: string }) => {
      if (data.success) {
        this.isConnected = true;
        console.log('Socket authenticated successfully');
        this.fetchUnreadCount();
      } else {
        console.error('Socket authentication failed:', data.error);
      }
    });

    this.socket.on('notification', (notification: Notification) => {
      this.handleNotification(notification);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });
  }

  /**
   * Disconnect socket (only if no components are using it)
   * Uses reference counting to prevent premature disconnection
   */
  public disconnect(): void {
    this.connectionRefCount--;
    
    // Only disconnect if no components are using the connection
    if (this.connectionRefCount <= 0) {
      this.connectionRefCount = 0; // Prevent negative count
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
        this.isConnected = false;
      }
    }
  }

  /**
   * Handle incoming notification
   */
  private handleNotification(notification: Notification): void {
    // Update unread count
    this.unreadCount++;
    this.notifyUnreadCountListeners();

    // Show toast notification
    const toastOptions: any = {
      description: notification.message,
      duration: notification.priority === 'high' ? 10000 : 5000,
    };

    if (notification.soundEnabled && notification.type === 'medicine') {
      // Play sound for medication reminders
      this.playNotificationSound();
    }

    switch (notification.type) {
      case 'medicine':
        toast.warning(notification.title, toastOptions);
        break;
      case 'appointment':
        toast.info(notification.title, toastOptions);
        break;
      case 'checkup':
        toast.info(notification.title, toastOptions);
        break;
      default:
        toast(notification.title, toastOptions);
    }

    // Notify listeners
    this.notifyListeners('notification', notification);
  }

  /**
   * Play notification sound
   */
  private playNotificationSound(): void {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch((error) => {
        console.warn('Could not play notification sound:', error);
      });
    } catch (error) {
      console.warn('Could not create audio:', error);
    }
  }

  /**
   * Fetch unread notification count
   */
  public async fetchUnreadCount(): Promise<number> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.unreadCount = data.count || 0;
        this.notifyUnreadCountListeners();
        return this.unreadCount;
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
    return 0;
  }

  /**
   * Get notifications
   */
  public async getNotifications(params?: {
    status?: string;
    limit?: number;
    page?: number;
  }): Promise<{ notifications: Notification[]; pagination: any }> {
    try {
      const token = localStorage.getItem('auth_token');
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.page) queryParams.append('page', params.page.toString());

      const response = await fetch(
        `${API_BASE_URL}/notifications?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch notifications');
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { notifications: [], pagination: {} };
    }
  }

  /**
   * Mark notification as read
   */
  public async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        this.notifyUnreadCountListeners();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark notification as dismissed
   */
  public async dismiss(notificationId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${API_BASE_URL}/notifications/${notificationId}/dismiss`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        if (this.unreadCount > 0) {
          this.unreadCount--;
          this.notifyUnreadCountListeners();
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error dismissing notification:', error);
      return false;
    }
  }

  /**
   * Snooze notification
   */
  public async snooze(notificationId: string, minutes: number = 15): Promise<boolean> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${API_BASE_URL}/notifications/${notificationId}/snooze`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ minutes }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error snoozing notification:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read
   */
  public async markAllAsRead(): Promise<boolean> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        this.unreadCount = 0;
        this.notifyUnreadCountListeners();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marking all as read:', error);
      return false;
    }
  }

  /**
   * Delete notification
   */
  public async delete(notificationId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Subscribe to notification events
   */
  public on(event: string, callback: (notification: Notification) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  /**
   * Subscribe to unread count changes
   */
  public onUnreadCountChange(callback: (count: number) => void): () => void {
    this.unreadCountListeners.add(callback);
    return () => {
      this.unreadCountListeners.delete(callback);
    };
  }

  /**
   * Get current unread count
   */
  public getUnreadCount(): number {
    return this.unreadCount;
  }

  /**
   * Check if connected
   */
  public getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Notify listeners
   */
  private notifyListeners(event: string, data: Notification): void {
    this.listeners.get(event)?.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  /**
   * Notify unread count listeners
   */
  private notifyUnreadCountListeners(): void {
    this.unreadCountListeners.forEach((callback) => {
      try {
        callback(this.unreadCount);
      } catch (error) {
        console.error('Error in unread count listener:', error);
      }
    });
  }
}

// Export singleton instance
export const notificationManager = new NotificationManager();
