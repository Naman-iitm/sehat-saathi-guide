import { offlineDB, OfflineEntry } from './offlineDB';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SyncQueue {
    private isSyncing = false;

    async processQueue() {
        if (this.isSyncing || !navigator.onLine) return;

        this.isSyncing = true;
        const queue = await offlineDB.getQueue();
        const token = localStorage.getItem('auth_token');

        if (queue.length === 0 || !token) {
            this.isSyncing = false;
            return;
        }

        console.log(`[SyncQueue] Processing ${queue.length} pending items...`);

        try {
            // Group by type for bulk sync if backend supports it
            // For now, let's process them one by one or send to a bulk endpoint
            const response = await fetch(`${API_URL}/api/sync/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items: queue })
            });

            if (response.ok) {
                const result = await response.json();
                const syncedIds = result.syncedIds || [];

                for (const id of syncedIds) {
                    await offlineDB.removeFromQueue(id);
                }

                console.log(`[SyncQueue] Successfully synced ${syncedIds.length} items`);

                // Dispatch custom event for UI updates
                window.dispatchEvent(new CustomEvent('sync-completed', {
                    detail: { count: syncedIds.length }
                }));
            }
        } catch (error) {
            console.error('[SyncQueue] Sync failed:', error);
        } finally {
            this.isSyncing = false;
        }
    }

    // Register for Background Sync API if supported
    async registerBackgroundSync() {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                await (registration as any).sync.register('sync-health-data');
                console.log('[SyncQueue] Background sync registered');
            } catch (err) {
                console.warn('[SyncQueue] Background sync registration failed:', err);
                // Fallback: poll or wait for online event
            }
        }
    }
}

export const syncQueue = new SyncQueue();

// Listen for network changes
window.addEventListener('online', () => {
    console.log('[SyncQueue] Browser online, triggering sync');
    syncQueue.processQueue();
});
