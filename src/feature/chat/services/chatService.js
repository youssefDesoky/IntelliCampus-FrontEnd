import * as signalR from "@microsoft/signalr";

const CHAT_PARTNERS = {
  12: { userId: "2", fullName: "Dr. Ahmed Hassan", role: "Instructor" },
  2: { userId: "12", fullName: "Layla Ahmed", role: "Student" },
};

export function getChatPartner(currentUserId) {
  return CHAT_PARTNERS[currentUserId] || null;
}

export function createHubConnection() {
  return new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .withAutomaticReconnect()
    .build();
}

export async function fetchChatHistory(userId1, userId2) {
  const res = await fetch(`/api/chat/history/${userId1}/${userId2}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch chat history");
  return res.json();
}

export function formatTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function toDateKey(timestamp) {
  const d = new Date(timestamp);
  return d.toISOString().slice(0, 10);
}

export function groupMessagesByDate(messages) {
  const grouped = {};
  for (const msg of messages) {
    const key = toDateKey(msg.timestamp);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(msg);
  }
  return grouped;
}
