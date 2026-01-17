import React from 'react';
import { Bell, Check, Clock, Info, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface NotificationItemProps {
    id: string;
    title: string;
    message: string;
    type: 'medication' | 'appointment' | 'system' | 'reminder';
    timestamp: string;
    isRead: boolean;
    onRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    id, title, message, type, timestamp, isRead, onRead
}) => {

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

    return (
        <div className={cn(
            "flex gap-3 p-3 border-b hover:bg-slate-50 transition-colors relative group",
            !isRead ? "bg-blue-50/50" : ""
        )}>
            <div className="mt-1 flex-shrink-0">
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className={cn("text-sm font-medium", !isRead && "font-semibold")}>
                    {title}
                </h4>
                <p className="text-sm text-slate-600 break-words line-clamp-2">
                    {message}
                </p>
                <span className="text-xs text-slate-400 mt-1 block">
                    {getTimeAgo(timestamp)}
                </span>
            </div>
            {!isRead && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRead(id);
                    }}
                    title="Mark as read"
                >
                    <Check className="h-4 w-4 text-green-600" />
                </Button>
            )}
            {!isRead && (
                <span className="absolute top-4 right-3 h-2 w-2 rounded-full bg-blue-500 block md:group-hover:hidden ring-2 ring-white"></span>
            )}
        </div>
    );
};

export default NotificationItem;
