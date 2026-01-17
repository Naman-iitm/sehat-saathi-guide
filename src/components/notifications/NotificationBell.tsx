import React, { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { API_BASE_URL } from '@/lib/api'; // Or wherever your base url is defined - wait, api.ts uses import.meta which is fine

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
                // Assuming we'll create this endpoint: GET /api/notifications
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();

                    // Map backend data to frontend props if needed 
                    // Backend: { _id, title, message, type, isRead, createdAt }
                    const mapped = data.map((n: any): NotificationItemProps => ({
                        id: n._id,
                        title: n.title,
                        message: n.message,
                        type: n.type || 'system',
                        timestamp: n.createdAt,
                        isRead: n.isRead,
                        onRead: markAsRead // Placeholder function ref
                    }));

                    setNotifications(mapped);
                    setUnreadCount(mapped.filter((n: any) => !n.isRead).length);
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
                id: newNote._id || Date.now().toString(), // fallback ID
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
            // Don't disconnect here if global notification manager is used elsewhere?
            // Actually, safe to disconnect if component unmounts (e.g. logout)
            // But if it's in Navbar which is always there, it's fine.
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

    // Re-bind onRead handler since 'markAsRead' depends on state/token
    // Actually we can pass the ID to a stable function

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full animate-bounce sm:animate-none"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold leading-none">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="h-auto text-xs text-blue-600 px-2 py-1" onClick={markAllAsRead}>
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-slate-500">
                            <Bell className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map(n => (
                                <NotificationItem
                                    key={n.id}
                                    {...n}
                                    onRead={markAsRead}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="p-2 border-t bg-slate-50 text-center">
                    <Button variant="link" size="sm" className="text-xs w-full text-slate-500 h-6">
                        View History
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;
