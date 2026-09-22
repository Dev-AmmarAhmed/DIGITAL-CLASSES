// sw.js - Realtime Service Worker for Native Notifications & PWA
const CACHE_NAME = 'digital-classes-realtime-v1';

// 1. Push Notification Logic
self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
});

// 2. Install Event - Turant naya service worker activate karein
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 3. Activate Event - Purana saara kachra (cache) force delete karein!
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          console.log('[Service Worker] Clearing old cache:', name);
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

// 4. Fetch Event - 100% NETWORK FIRST (Realtime Bypass)
self.addEventListener('fetch', (event) => {
  // Firebase aur Google API calls ko directly bypass karein
  if (event.request.url.includes('firebaseio.com') || event.request.url.includes('googleapis.com')) {
    return; 
  }

  // Pura page aur assets seedha Network (Internet) se load honge
  event.respondWith(
    fetch(event.request).catch((err) => {
      // Agar internet totally band ho (Offline) tabhi purana cache check karega
      console.log('[Service Worker] Network failed, looking in cache...');
      return caches.match(event.request);
    })
  );
});
