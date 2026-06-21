importScripts('https://www.gstatic.com/firebasejs/12.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: 'AIzaSyDN8iQquLNQa7ntgTe0kVsg1nj3pts2R-k',
    projectId: 'intellicampus-6078f',
    messagingSenderId: '1035371116854',
    appId: '1:1035371116854:web:6db5b179305652fea95b97',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    const n = payload.notification || {};
    const d = payload.data || {};
    const title = n.title || d.title || 'IntelliCampus';
    const options = {
        body: n.body || d.body || '',
        icon: '/images/IntelliCampusLogo.png',
        badge: '/IntelliCampus_Trans.ico',
        image: n.image || d.image || undefined,
        data: {
            clickUrl: d.clickUrl || '/',
            notificationId: d.notificationId || '',
        },
        tag: d.notificationId || undefined,
    };
    self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const url = (event.notification.data && event.notification.data.clickUrl) || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (wins) {
            const hit = wins.find(function (w) { return w.url.includes(self.origin); });
            if (hit) return hit.focus().then(function (c) { return c.navigate(url); });
            return clients.openWindow(url);
        })
    );
});