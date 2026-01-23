/*
 * Sehat Saathi Service Worker
 * Handles offline caching and background sync
 */

const CACHE_NAME = 'sehat-saathi-offline-v1';
const API_CACHE_NAME = 'sehat-saathi-api-v1';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/health-care.png',
    '/faviconn.ico',
    '/placeholder.svg'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME && key !== API_CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests and chrome-extension requests
    if (request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

    // Handle API caching (Stale-While-Revalidate pattern)
    if (url.pathname.includes('/api/')) {
        event.respondWith(
            caches.open(API_CACHE_NAME).then((cache) => {
                return cache.match(request).then((cachedResponse) => {
                    const fetchPromise = fetch(request).then((networkResponse) => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    }).catch(() => {
                        // If network fails, return cached response if available
                        return cachedResponse;
                    });
                    return cachedResponse || fetchPromise;
                });
            })
        );
        return;
    }

    // Default Cache-First strategy for static assets
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            return cachedResponse || fetch(request).catch(() => {
                // If both fail and it's a navigation request, return index.html
                if (request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});

// Background Sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-health-data') {
        console.log('[SW] Background sync triggered for health data');
        // The actual sync logic is handled by SyncQueue in the main thread
        // when the user reopens the app, but we can also trigger it here
        // using postMessage to all clients.
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({ type: 'SYNC_RETRY' });
            });
        });
    }
});
