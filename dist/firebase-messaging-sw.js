// Import Firebase scripts using importScripts (standard for service workers)
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Your firebase config (same as firebase.js)
firebase.initializeApp({
  apiKey: "AIzaSyDN8iQquLNQa7ntgTe0kVsg1nj3pts2R-k",
  authDomain: "intellicampus-6078f.firebaseapp.com",
  projectId: "intellicampus-6078f",
  storageBucket: "intellicampus-6078f.firebasestorage.app",
  messagingSenderId: "1035371116854",
  appId: "1:1035371116854:web:6db5b179305652fea95b97",
  measurementId: "G-20SKNXY20Z"
});

const messaging = firebase.messaging();

// Optional: handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/reminder.png'  // your icon in public/icons/
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});