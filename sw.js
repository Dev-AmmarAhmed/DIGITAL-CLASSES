// sw.js - Service Worker for Firebase Cloud Messaging (Background Support)
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

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

// 🚀 BACKGROUND MESSAGE HANDLER (Jab App Close ho)
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

// Jab user notification par click karega tou app open hogi
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow('/')); 
});

// Force Service Worker Update
self.addEventListener('install', (event) => self.skipWaiting());
self.addEventListener('activate', (event) => self.clients.claim());
