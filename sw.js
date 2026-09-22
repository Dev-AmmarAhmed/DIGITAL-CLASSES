// sw.js - Service Worker for Native Notifications
self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
});
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
});


const CACHE_NAME = 'digital-classes-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://raw.githubusercontent.com/Dev-AmmarAhmed/DIGITAL-CLASSES/a4a25f244fa56db83e669d00a5b3023296ab67a6/icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// Install Event - Caching static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Activate Event - Clearing old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network First for Firebase, Cache First for UI
self.addEventListener('fetch', (event) => {
  // Bypassing Firebase calls taaki Realtime Data hamesha fresh rahe
  if (event.request.url.includes('firebaseio.com') || event.request.url.includes('googleapis.com')) {
    return; 
  }

  // UI aur baaki elements pehle Cache se load honge fast speed ke liye
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => {
      // Handle offline gracefully if needed
    })
  );
});
