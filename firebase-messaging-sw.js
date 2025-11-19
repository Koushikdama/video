// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
    apiKey: "AIzaSyC4PF__jAZuPBZw6rqheI2gokZW-WtxwDg",
    authDomain: "video-call-1a584.firebaseapp.com",
    projectId: "video-call-1a584",
    storageBucket: "video-call-1a584.firebasestorage.app",
    messagingSenderId: "537253207694",
    appId: "1:537253207694:web:f8222f7a1a4d4c5f16f3df",
});

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'Incoming Call';
    const notificationOptions = {
        body: payload.notification?.body || 'You have an incoming call',
        icon: '/firebase-logo.png', // Optional: add an icon
        badge: '/firebase-logo.png', // Optional: add a badge
        tag: 'video-call-notification',
        requireInteraction: true,
        actions: [
            { action: 'accept', title: 'Accept' },
            { action: 'reject', title: 'Reject' }
        ]
    };

    // Show notification
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function (event) {
    console.log('Notification click received:', event);

    event.notification.close();

    // Handle different actions
    if (event.action === 'accept') {
        // Focus on the app window and accept call
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(windowClients => {
                for (let client of windowClients) {
                    if (client.url.includes('/') && 'focus' in client) {
                        client.focus();
                        // You can send a message to the client to accept the call
                        client.postMessage({
                            type: 'NOTIFICATION_ACTION',
                            action: 'accept'
                        });
                        break;
                    }
                }
            })
        );
    } else if (event.action === 'reject') {
        // Send reject action
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(windowClients => {
                for (let client of windowClients) {
                    if (client.url.includes('/')) {
                        client.postMessage({
                            type: 'NOTIFICATION_ACTION',
                            action: 'reject'
                        });
                        break;
                    }
                }
            })
        );
    } else {
        // Default click behavior - focus on app
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(windowClients => {
                for (let client of windowClients) {
                    if (client.url.includes('/') && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
        );
    }
});