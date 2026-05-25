// Small API helper for notifications
// Usage example (in code or browser console):
// import { sendBulkNotification } from "../api/notifications";
// sendBulkNotification([2,3], 'Hello from frontend', 13)
//   .then(res => console.log(res))
//   .catch(err => console.error(err));

// Fetch current user's unread notifications only
export async function fetchMyNotifications() {
  const res = await fetch('/api/notifications/unread', {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch notifications: ${res.status} ${text}`);
  }

  return res.json();
}

export function dispatchNotificationsChanged() {
  window.dispatchEvent(new CustomEvent('notifications:changed'));
}

export function subscribeNotificationsChanged(handler) {
  window.addEventListener('notifications:changed', handler);
  return () => window.removeEventListener('notifications:changed', handler);
}

// Mark a single notification as read
export async function markNotificationAsRead(notificationId) {
  const res = await fetch(`/api/notifications/${notificationId}/read`, {
    method: 'PUT',
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to mark notification as read: ${res.status} ${text}`);
  }

  return res.ok;
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  const res = await fetch('/api/notifications/read-all', {
    method: 'PUT',
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to mark all as read: ${res.status} ${text}`);
  }

  return res.ok;
}

export async function sendBulkNotification(userIds = [], message = '', type = 0) {
  const dto = { userIds, message, type };

  const res = await fetch('/api/notifications/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // send cookie token
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notification send failed: ${res.status} ${text}`);
  }

  // Controller returns { sent: count }
  return res.json();
}
