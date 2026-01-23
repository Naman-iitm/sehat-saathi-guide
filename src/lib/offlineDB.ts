/**
 * IndexedDB wrapper for Sehat Saathi Offline Mode
 */

const DB_NAME = 'sehat-saathi-offline';
const DB_VERSION = 1;

export interface OfflineEntry<T = any> {
    id?: number;
    type: string;
    data: T;
    timestamp: number;
    synced: boolean;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
}

class OfflineDB {
    private db: IDBDatabase | null = null;

    async init(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(request.result);
            };

            request.onupgradeneeded = (event: any) => {
                const db = event.target.result;

                // Store for pending sync operations
                if (!db.objectStoreNames.contains('sync_queue')) {
                    db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
                }

                // Cache for medicines/products
                if (!db.objectStoreNames.contains('medicines_cache')) {
                    db.createObjectStore('medicines_cache', { keyPath: '_id' });
                }

                // Local storage for symptoms (for immediate offline feedback)
                if (!db.objectStoreNames.contains('symptoms_local')) {
                    db.createObjectStore('symptoms_local', { keyPath: '_id' });
                }
            };
        });
    }

    async addToQueue(entry: Omit<OfflineEntry, 'id' | 'timestamp' | 'synced'>) {
        const db = await this.init();
        const transaction = db.transaction('sync_queue', 'readwrite');
        const store = transaction.objectStore('sync_queue');

        return new Promise((resolve, reject) => {
            const request = store.add({
                ...entry,
                timestamp: Date.now(),
                synced: false
            });
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getQueue(): Promise<OfflineEntry[]> {
        const db = await this.init();
        const transaction = db.transaction('sync_queue', 'readonly');
        const store = transaction.objectStore('sync_queue');

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async removeFromQueue(id: number) {
        const db = await this.init();
        const transaction = db.transaction('sync_queue', 'readwrite');
        const store = transaction.objectStore('sync_queue');

        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Generic methods for Caching
    async cacheData(storeName: string, data: any[]) {
        const db = await this.init();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        data.forEach(item => {
            store.put(item);
        });

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve(true);
            transaction.onerror = () => reject(transaction.error);
        });
    }

    async getCachedData(storeName: string): Promise<any[]> {
        const db = await this.init();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

export const offlineDB = new OfflineDB();
