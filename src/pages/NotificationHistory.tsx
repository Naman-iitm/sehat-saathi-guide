import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Clock, Trash2, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notificationManager, Notification } from '@/lib/notifications/NotificationManager';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow, format } from 'date-fns';
import NotificationItem from '@/components/notifications/NotificationItem';
import { toast } from 'sonner';

const NotificationHistory: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Connect to socket (increments ref count)
    const token = localStorage.getItem('auth_token');
    if (token) {
      notificationManager.connect(token);
    }

    // Subscribe to new notifications
    const unsubscribe = notificationManager.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    loadNotifications();

    return () => {
      unsubscribe();
      // Decrement ref count (only disconnects if no other components are using it)
      notificationManager.disconnect();
    };
  }, [isAuthenticated, activeTab]);

  const loadNotifications = async (reset = false) => {
    if (reset) {
      setPage(1);
      setNotifications([]);
    }

    setLoading(true);
    try {
      const status = activeTab === 'unread' ? 'sent' : activeTab === 'read' ? 'read' : undefined;
      const data = await notificationManager.getNotifications({
        status,
        limit: 20,
        page: reset ? 1 : page,
      });

      if (reset) {
        setNotifications(data.notifications);
      } else {
        setNotifications((prev) => [...prev, ...data.notifications]);
      }

      setHasMore(data.notifications.length === 20);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(true);
  }, [activeTab]);

  const handleMarkAsRead = async (notificationId: string) => {
    const success = await notificationManager.markAsRead(notificationId);
    if (success) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, status: 'read' as const } : n
        )
      );
      toast.success('Notification marked as read');
    }
  };

  const handleDismiss = async (notificationId: string) => {
    const success = await notificationManager.dismiss(notificationId);
    if (success) {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      toast.success('Notification dismissed');
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await notificationManager.markAllAsRead();
    if (success) {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: 'read' as const }))
      );
      toast.success('All notifications marked as read');
      notificationManager.fetchUnreadCount();
    }
  };

  const handleDelete = async (notificationId: string) => {
    const success = await notificationManager.delete(notificationId);
    if (success) {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      toast.success('Notification deleted');
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
      loadNotifications(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Please log in to view notifications</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => n.status === 'sent').length;
  const readCount = notifications.filter((n) => n.status === 'read').length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification History
            </CardTitle>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All
                {notifications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {notifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">
                Read
                {readCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {readCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <NotificationList
                notifications={notifications}
                loading={loading}
                onMarkAsRead={handleMarkAsRead}
                onDismiss={handleDismiss}
                onDelete={handleDelete}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
              />
            </TabsContent>

            <TabsContent value="unread" className="mt-4">
              <NotificationList
                notifications={notifications.filter((n) => n.status === 'sent')}
                loading={loading}
                onMarkAsRead={handleMarkAsRead}
                onDismiss={handleDismiss}
                onDelete={handleDelete}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
              />
            </TabsContent>

            <TabsContent value="read" className="mt-4">
              <NotificationList
                notifications={notifications.filter((n) => n.status === 'read')}
                loading={loading}
                onMarkAsRead={handleMarkAsRead}
                onDismiss={handleDismiss}
                onDelete={handleDelete}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onDelete: (id: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  onMarkAsRead,
  onDismiss,
  onDelete,
  onLoadMore,
  hasMore,
}) => {
  if (loading && notifications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading notifications...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No notifications found
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-2">
        {notifications.map((notification) => (
          <NotificationItemWithActions
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDismiss={onDismiss}
            onDelete={onDelete}
          />
        ))}
        {hasMore && (
          <div className="text-center py-4">
            <Button variant="outline" onClick={onLoadMore} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

interface NotificationItemWithActionsProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItemWithActions: React.FC<NotificationItemWithActionsProps> = ({
  notification,
  onMarkAsRead,
  onDismiss,
  onDelete,
}) => {
  const isUnread = notification.status === 'sent';

  return (
    <Card className={!isUnread ? 'opacity-70' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <NotificationItem
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDismiss={onDismiss}
          />
          <div className="flex gap-1 ml-auto">
            {isUnread && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onMarkAsRead(notification.id)}
                title="Mark as read"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onDelete(notification.id)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationHistory;
