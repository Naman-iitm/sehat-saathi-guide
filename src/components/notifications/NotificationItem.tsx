import React, { useState } from 'react';
import { Bell, Check, Clock, Info, Pill, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface NotificationItemProps {
    id: string;
    title: string;
    message: string;
    type: 'medication' | 'appointment' | 'system' | 'reminder';
    timestamp: string;
    isRead: boolean;
    metadata?: any;
    onRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    id, title, message, type, timestamp, isRead, metadata, onRead
}) => {
    const { token } = useAuth();
    const { toast } = useToast();
    const [isSnoozing, setIsSnoozing] = useState(false);

    const getIcon = () => {
        switch (type) {
            case 'medication': return <Pill className="h-5 w-5 text-blue-500" />;
            case 'appointment': return <Clock className="h-5 w-5 text-green-500" />;
            case 'reminder': return <Bell className="h-5 w-5 text-orange-500" />;
            default: return <Info className="h-5 w-5 text-slate-500" />;
        }
    };

    const getTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    const handleSnooze = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!metadata?.reminderId || !token) return;

        setIsSnoozing(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reminders/${metadata.reminderId}/snooze`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ duration: 10 })
            });

            if (response.ok) {
                toast({
                    title: "Reminder Snoozed",
                    description: "We'll remind you again in 10 minutes.",
                });
                onRead(id); // Mark the current notification as read/done
            } else {
                throw new Error("Failed to snooze");
            }
        } catch (err) {
            console.error("Snooze failed", err);
            toast({
                title: "Error",
                description: "Failed to snooze the reminder.",
                variant: 'destructive'
            });
        } finally {
            setIsSnoozing(false);
        }
    };

    return (
        <div className={cn(
            "flex gap-3 p-3 border-b hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors relative group",
            !isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
        )}>
            <div className="mt-1 flex-shrink-0">
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <h4 className={cn("text-sm font-medium truncate", !isRead && "font-semibold text-slate-900 dark:text-white")}>
                        {title}
                    </h4>
                    {!isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 animate-pulse"></span>
                    )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 break-words line-clamp-2 mt-0.5">
                    {message}
                </p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        {getTimeAgo(timestamp)}
                    </span>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(type === 'medication' || type === 'reminder') && metadata?.reminderId && !isRead && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-[10px] py-0 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:border-orange-900/30 dark:hover:bg-orange-950/20"
                                onClick={handleSnooze}
                                disabled={isSnoozing}
                            >
                                <RotateCcw className={cn("h-3 w-3 mr-1", isSnoozing && "animate-spin")} />
                                Snooze (10m)
                            </Button>
                        )}
                        {!isRead && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-[10px] py-0 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRead(id);
                                }}
                            >
                                <Check className="h-3 w-3 mr-1" />
                                Done
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;
