import { useState, useEffect } from 'react';
import { offlineDB, OfflineEntry } from '@/lib/offlineDB';

export const useOffline = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [pendingCount, setPendingCount] = useState(0);

    const updatePendingCount = async () => {
        const queue = await offlineDB.getQueue();
        setPendingCount(queue.length);
    };

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial check
        updatePendingCount();

        // Listen for custom sync events
        const handleSyncComplete = () => updatePendingCount();
        window.addEventListener('sync-completed', handleSyncComplete);

        // Periodic check for pending items (if window is active)
        const interval = setInterval(updatePendingCount, 10000);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('sync-completed', handleSyncComplete);
            clearInterval(interval);
        };
    }, []);

    return {
        isOnline,
        pendingCount,
        updatePendingCount
    };
};
