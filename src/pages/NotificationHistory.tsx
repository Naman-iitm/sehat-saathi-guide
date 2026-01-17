import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationItem, { NotificationItemProps } from '@/components/notifications/NotificationItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

const NotificationHistory: React.FC = () => {
    const { user, token } = useAuth();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        if (!user || !token) return;
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
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
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user, token]);

    const markAsRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/read-all`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast({ title: "Success", description: "All notifications marked as read" });
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const clearAll = async () => {
        if (!window.confirm("Are you sure you want to clear all notifications?")) return;
        setNotifications([]);
        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast({ title: "Success", description: "All notifications cleared" });
        } catch (err) {
            console.error("Failed to clear notifications", err);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notification History</h1>
                    <p className="text-slate-500 dark:text-slate-400">View and manage all your past notifications</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchNotifications}>
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={markAllRead} disabled={!notifications.some(n => !n.isRead)}>
                        <Check className="w-4 h-4 mr-2" /> Mark all as read
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={clearAll} disabled={notifications.length === 0}>
                        <Trash2 className="w-4 h-4 mr-2" /> Clear All
                    </Button>
                </div>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b dark:border-slate-800 p-4">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-500" />
                        Latest Updates
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[600px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-slate-500">Loading your notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[400px] text-slate-500">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <Bell className="w-8 h-8 opacity-20" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Clean slate!</h3>
                                <p className="text-sm">You're all caught up. No notifications yet.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col divide-y dark:divide-slate-800">
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
                </CardContent>
            </Card>
        </div>
    );
};

export default NotificationHistory;
