import apiClient from "../utils/apiClient";

export async function fetchMyNotifications() {
  return apiClient('/api/notifications/unread');
}

export function dispatchNotificationsChanged() {
  window.dispatchEvent(new CustomEvent('notifications:changed'));
}

export function subscribeNotificationsChanged(handler) {
  window.addEventListener('notifications:changed', handler);
  return () => window.removeEventListener('notifications:changed', handler);
}

export async function markNotificationAsRead(notificationId) {
  await apiClient(`/api/notifications/${notificationId}/read`, { method: 'PUT' });
  return true;
}

export async function markAllNotificationsAsRead() {
  await apiClient('/api/notifications/read-all', { method: 'PUT' });
  return true;
}

export async function sendBulkNotification(userIds = [], message = '', type = 0, title = null, clickUrl = null, imageUrl = null) {
  return apiClient('/api/notifications/send', {
    method: 'POST',
    body: JSON.stringify({ userIds, message, type, title, clickUrl, imageUrl }),
  });
}

export async function registerDeviceToken(token) {
  return apiClient('/api/devices/register', {
    method: 'POST',
    body: JSON.stringify({ token, platform: navigator.platform }),
  });
}

export async function unregisterDeviceToken(token) {
  return apiClient('/api/devices/unregister', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}
