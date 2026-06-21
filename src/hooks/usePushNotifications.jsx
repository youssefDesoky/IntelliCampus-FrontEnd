import { useEffect, useRef } from 'react';
import { messaging, VAPID_KEY } from '../firebase';
import { getToken } from 'firebase/messaging';
import { registerDeviceToken } from '../api/notifications';

export default function usePushNotifications(enabled = true) {
    const lastToken = useRef(localStorage.getItem('fcm_token'));

    useEffect(() => {
        if (!enabled) return;
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

        async function init() {
            try {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') return;

                const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                await navigator.serviceWorker.ready;

                const token = await getToken(messaging, {
                    vapidKey: VAPID_KEY,
                    serviceWorkerRegistration: swReg,
                });

                if (token && token !== lastToken.current) {
                    await registerDeviceToken(token);
                    localStorage.setItem('fcm_token', token);
                    lastToken.current = token;
                }
            } catch {
                // Fail silently — push is non-critical; in-app SSE fallback works
            }
        }

        init();
    }, [enabled]);
}
