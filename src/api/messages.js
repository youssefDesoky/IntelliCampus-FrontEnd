import apiClient from "../utils/apiClient";

export async function fetchInboxMessages() {
  return apiClient('/api/messages/inbox');
}

export async function fetchSentMessages() {
  return apiClient('/api/messages/sent');
}

export async function markMessageAsRead(messageId) {
  await apiClient(`/api/messages/${messageId}/read`, { method: 'PUT' });
  return true;
}

export async function deleteMessage(messageId) {
  await apiClient(`/api/messages/${messageId}`, { method: 'DELETE' });
  return true;
}

export async function sendMessage({ recipientIds, subject, body }) {
  return apiClient('/api/messages/send', {
    method: 'POST',
    body: JSON.stringify({ recipientIds, subject, body }),
  });
}
