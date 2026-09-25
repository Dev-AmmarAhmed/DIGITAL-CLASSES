// sw.js - Service Worker for DIGITAL CLASSES PRO
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// --- FIREBASE CONFIGURATION ---
firebase.initializeApp({
  apiKey: "AIzaSyDSdTvqbCn-UMi2cUiyNPQN3UbKfqsfNoI",
  authDomain: "digital-classes-app-14235.firebaseapp.com",
  databaseURL: "https://digital-classes-app-14235-default-rtdb.firebaseio.com",
  projectId: "digital-classes-app-14235",
  storageBucket: "digital-classes-app-14235.firebasestorage.app",
  messagingSenderId: "889883419588",
  appId: "1:889883419588:web:0ae24d6da84740f127ba91"
});

const messaging = firebase.messaging();

// ==========================================
// 1. BACKGROUND NOTIFICATIONS HANDLER
// ==========================================
messaging.onBackgroundMessage(function(payload) {
  console.log('[sw.js] Received background message: ', payload);
  const notificationTitle = payload.notification.title || "DIGITAL CLASSES";
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || "https://raw.githubusercontent.com/Dev-AmmarAhmed/DIGITAL-CLASSES/a4a25f244fa56db83e669d00a5b3023296ab67a6/icon.png",
    badge: "https://raw.githubusercontent.com/Dev-AmmarAhmed/DIGITAL-CLASSES/a4a25f244fa56db83e669d00a5b3023296ab67a6/icon.png",
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: true
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow('./index.html')); 
});


// ==========================================
// 2. SMART OFFLINE CACHING (PWA Builder Perfect Score)
// ==========================================
const CACHE_NAME = 'digital-classes-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://raw.githubusercontent.com/Dev-AmmarAhmed/DIGITAL-CLASSES/a4a25f244fa56db83e669d00a5b3023296ab67a6/icon.png'
];

// Install Event - Caching App Shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Event - Clearing Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event - Network First for DB, Cache First for UI
self.addEventListener('fetch', (event) => {
  // IMPORTANT: Firebase DB aur Auth requests ko cache nahi karna warna data update/sync fail ho jayega
  if (event.request.url.includes('firebaseio.com') || event.request.url.includes('googleapis.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Agar file cache mein hai (jaise icon, index.html) toh wo return karo, warna internet se fetch karo
      return response || fetch(event.request).catch(() => {
          // Internet bilkul off hone par hamesha index.html dikhao taake Chrome ka "No Internet" dinosaur na aaye
          if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
          }
      });
    })
  );
});
