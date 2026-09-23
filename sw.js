// sw.js - Service Worker for Firebase Cloud Messaging
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

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow('/')); // Notification click par app open karega
});

self.addEventListener('install', (event) => self.skipWaiting());
self.addEventListener('activate', (event) => self.clients.claim());
