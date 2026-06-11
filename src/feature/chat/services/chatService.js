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

// --- Friend API ---

export async function sendFriendRequest(recipientId) {
  const res = await fetch("/api/friends/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ recipientId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to send friend request");
  }
  return res.json();
}

export async function acceptFriendRequest(requestId) {
  const res = await fetch(`/api/friends/requests/${requestId}/accept`, {
    method: "PUT",
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to accept request");
  }
  return res.json();
}

export async function declineFriendRequest(requestId) {
  const res = await fetch(`/api/friends/requests/${requestId}/reject`, {
    method: "PUT",
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to decline request");
  }
  return res.json();
}

export async function fetchPendingRequests() {
  const res = await fetch("/api/friends/requests/pending", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch pending requests");
  return res.json();
}

export async function fetchFriends() {
  const res = await fetch("/api/friends", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch friends");
  return res.json();
}

export async function fetchGroupChatHistory(groupName) {
  const res = await fetch(`/api/chat/group/${encodeURIComponent(groupName)}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch group chat history");
  return res.json();
}

// --- Group API ---

export async function createGroup(title, description, memberIds, profileImage) {
  const res = await fetch("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, description, memberIds, profileImage }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create group");
  }
  return res.json();
}

export async function fetchMyGroups() {
  const res = await fetch("/api/groups", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch groups");
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
