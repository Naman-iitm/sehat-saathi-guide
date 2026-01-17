import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { notificationManager, Notification } from '@/lib/notifications/NotificationManager';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import NotificationItem from './NotificationItem';

const NotificationBell: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Connect to socket (increments ref count)
    const token = localStorage.getItem('auth_token');
    if (token) {
      notificationManager.connect(token);
    }

    // Fetch initial unread count
    notificationManager.fetchUnreadCount();

    // Subscribe to unread count changes
    const unsubscribeCount = notificationManager.onUnreadCountChange((count) => {
      setUnreadCount(count);
    });

    // Subscribe to new notifications
    const unsubscribeNotification = notificationManager.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    // Load recent notifications
    loadNotifications();

    return () => {
      unsubscribeCount();
      unsubscribeNotification();
      // Decrement ref count (only disconnects if no other components are using it)
      notificationManager.disconnect();
    };
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationManager.getNotifications({
        limit: 10,
        page: 1,
      });
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await notificationManager.markAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, status: 'read' as const } : n
      )
    );
  };

  const handleDismiss = async (notificationId: string) => {
    await notificationManager.dismiss(notificationId);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleMarkAllAsRead = async () => {
    await notificationManager.markAllAsRead();
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: 'read' as const }))
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  const unreadNotifications = notifications.filter((n) => n.status === 'sent');

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs h-7"
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDismiss={handleDismiss}
                />
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t">
          <Link
            to="/notifications"
            onClick={() => setIsOpen(false)}
            className="block text-center text-sm text-primary hover:underline"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
