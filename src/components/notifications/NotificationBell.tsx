import React, { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import NotificationItem, { NotificationItemProps } from './NotificationItem';
import { notificationManager } from '@/lib/notifications/NotificationManager';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const NotificationBell: React.FC = () => {
    const { user, token } = useAuth();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initial fetch of notifications
    useEffect(() => {
        if (!user || !token) return;

        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();

                    // The backend returns { notifications: [], unreadCount: N }
                    const mapped = data.notifications.map((n: any): NotificationItemProps => ({
                        id: n._id,
                        title: n.title,
                        message: n.message,
                        type: n.type || 'system',
                        timestamp: n.createdAt,
                        isRead: n.isRead,
                        onRead: markAsRead
                    }));

                    setNotifications(mapped);
                    setUnreadCount(data.unreadCount || 0);
                }
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            }
        };

        fetchNotifications();

        // Connect Sync
        notificationManager.connect(user._id || user.id);

        // Listen for new ones
        const unsubscribe = notificationManager.onNotification((newNote) => {
            // Play sound
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log(e));
            }

            const item: NotificationItemProps = {
                id: newNote._id || Date.now().toString(),
                title: newNote.title,
                message: newNote.message,
                type: newNote.type,
                timestamp: new Date().toISOString(),
                isRead: false,
                onRead: markAsRead
            };

            setNotifications(prev => [item, ...prev]);
            setUnreadCount(prev => prev + 1);

            toast({
                title: newNote.title,
                description: newNote.message,
            });
        });

        return () => {
            unsubscribe();
        };

    }, [user, token, toast]);

    // Request permissions on mount
    useEffect(() => {
        if (user) notificationManager.requestPermission();
        // Preload audio
        audioRef.current = new Audio('/sounds/notification.mp3');
    }, [user]);

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);

        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/read-all`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                    <div className="relative">
                        <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-500 transition-colors" />
                        {unreadCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-5 min-w-[20px] flex items-center justify-center p-1 text-[10px] rounded-full animate-in zoom-in duration-300 shadow-md border-2 border-white dark:border-slate-950"
                            >
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </Badge>
                        )}
                    </div>
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 shadow-xl border-slate-200 dark:border-slate-800" align="end" sideOffset={8}>
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="font-bold text-sm leading-none">Notifications</h3>
                        <p className="text-[10px] text-slate-500 mt-1">You have {unreadCount} unread messages</p>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="h-8 text-[11px] text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2" onClick={markAllAsRead}>
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[350px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[250px] text-slate-400 p-8 text-center">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                <Bell className="h-6 w-6 opacity-40" />
                            </div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">All caught up!</p>
                            <p className="text-xs mt-1">No new notifications at the moment.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.slice(0, 10).map(n => (
                                <NotificationItem
                                    key={n.id}
                                    {...n}
                                    onRead={markAsRead}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="p-2 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <Button asChild variant="ghost" size="sm" className="w-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600">
                        <Link to="/notifications">View all notifications</Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;
