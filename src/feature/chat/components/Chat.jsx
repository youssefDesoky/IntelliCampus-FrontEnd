import { useEffect, useState, useRef, useCallback } from "react";
import Section from "../../../components/ui/Section";
import Dialog from "../../../components/ui/Dialog";
import CommentsIcon from "../../../components/ui/icons/CommentsIcon";
import ChatUsers from "./ChatUsers";
import Messaging from "./Messaging";
import DefaultChatPanel from "./DefaultChatPanel";
import AddFriendPanel from "./AddFriendPanel";
import CreateGroupPanel from "./CreateGroupPanel";
import {
  createHubConnection,
  fetchChatHistory,
  fetchGroupChatHistory,
  toDateKey,
  formatTime,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  fetchPendingRequests,
  fetchFriends,
  createGroup,
  fetchMyGroups,
} from "../services/chatService";
import { useError } from '../../../contexts/ErrorContext.jsx';

export default function Chat({ isChatOpen, setIsChatOpen, currentUser }) {
  const { showError } = useError();
  // "default" | "messaging" | "addFriend" | "createGroup"
  const [activePanel, setActivePanel] = useState("default");
  const [friendId, setFriendId] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatPartner, setChatPartner] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isAlreadyTyping, setIsAlreadyTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [pendingPinMessageId, setPendingPinMessageId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMembers, setSearchMembers] = useState("");
  const connectionRef = useRef(null);
  const chatPartnerRef = useRef(null);
  const msgIdsRef = useRef(new Set());
  const typingTimeoutRef = useRef(null);
  const pinnedMessageRef = useRef(null);

  // Keep refs in sync with state so SignalR handlers always have latest value
  useEffect(() => { chatPartnerRef.current = chatPartner; }, [chatPartner]);
  useEffect(() => { pinnedMessageRef.current = pinnedMessage; }, [pinnedMessage]);

  // Fetch friends and pending requests
  useEffect(() => {
    if (!currentUser) return;

    const loadFriends = async () => {
      try {
        const data = await fetchFriends();
        setFriends(data);
      } catch {
        // not critical
      }
    };

    const loadRequests = async () => {
      try {
        const data = await fetchPendingRequests();
        setFriendRequests(
          data.map((r) => ({
            id: r.friendRequestId,
            senderId: r.senderId,
            name: r.senderName,
            avatar: r.senderProfileImage,
            recipientId: r.recipientId,
            recipientName: r.recipientName,
          }))
        );
      } catch {
        // not critical
      }
    };

    const loadGroups = async () => {
      try {
        const data = await fetchMyGroups();
        setGroups(data);
      } catch {
        // not critical
      }
    };

    loadFriends();
    loadRequests();
    loadGroups();
  }, [currentUser]);

  // SignalR connection — always active when chat is open
  useEffect(() => {
    if (!isChatOpen || !currentUser) return;

    const conn = createHubConnection();

    conn.on("ReceivePrivateMessage", (msg) => {
      const senderId = String(msg.senderId);
      const isOwn = senderId === String(currentUser.userId);
      const partner = chatPartnerRef.current;

      if (!isOwn) {
        if (!partner || partner.type === "group" || senderId !== String(partner.userId)) {
          setUnreadCounts((prev) => ({ ...prev, [senderId]: (prev[senderId] || 0) + 1 }));
          return;
        }
      }

      if (!partner || partner.type === "group") return;

      setPartnerTyping(false);
      msgIdsRef.current.add(msg.messageId);
      setMessages((prev) => {
        const exists = prev.some((m) => m.messageId === msg.messageId);
        return exists ? prev : [...prev, msg];
      });
    });

    conn.on("ReceiveGroupMessage", (msg) => {
      const partner = chatPartnerRef.current;
      if (!partner || partner.type !== "group" || partner.groupName !== msg.groupName) return;

      msgIdsRef.current.add(msg.messageId);
      setMessages((prev) => {
        const exists = prev.some((m) => m.messageId === msg.messageId);
        return exists ? prev : [...prev, msg];
      });
    });

    conn.on("UserOnline", (userId) => {
      setOnlineUsers(prev => new Set(prev).add(String(userId)));
    });

    conn.on("UserOffline", (userId) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        next.delete(String(userId));
        return next;
      });
    });

    conn.on("ReceiveTypingStatus", (senderId, isTyping) => {
      const partner = chatPartnerRef.current;
      if (partner && String(senderId) === String(partner.userId)) {
        setPartnerTyping(isTyping);
      }
    });

    conn.on("MessageDeleted", (messageId) => {
      setMessages((prev) => prev.filter((m) => m.messageId !== messageId));
    });

    conn.on("MessageEdited", (messageId, newContent, isEdited) => {
      setMessages((prev) =>
        prev.map((m) => (m.messageId === messageId ? { ...m, content: newContent, isEdited: isEdited ?? true } : m))
      );
    });

    conn.on("MessagePinned", (messageId, content) => {
      setPinnedMessage(content);
      setMessages((prev) =>
        prev.map((m) => ({ ...m, isPinned: m.messageId === messageId }))
      );
    });

    conn.on("MessageUnpinned", (messageId) => {
      setPinnedMessage(null);
      setMessages((prev) =>
        prev.map((m) => (m.messageId === messageId ? { ...m, isPinned: false } : m))
      );
    });

    conn.onreconnected(async () => {
      const partner = chatPartnerRef.current;
      if (partner) {
        if (partner.type === "group") {
          await conn.invoke("JoinGroup", partner.groupName);
        }
        await loadHistory(conn, partner);
      }
    });

    connectionRef.current = conn;

    return () => {
      conn.stop();
      if (connectionRef.current === conn) connectionRef.current = null;
    };
  }, [isChatOpen, currentUser]);

  // Load history & join group when partner changes
  useEffect(() => {
    const conn = connectionRef.current;
    if (!chatPartner || !conn) return;

    const load = async () => {
      if (chatPartner.type === "group") {
        await conn.invoke("JoinGroup", chatPartner.groupName);
      }
      await loadHistory(conn, chatPartner);
    };
    load();

    // Leave previous group on cleanup (track via ref)
    return () => {
      if (chatPartner.type === "group") {
        conn.invoke("LeaveGroup", chatPartner.groupName).catch(() => {});
      }
    };
  }, [chatPartner]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const loadHistory = useCallback(async (conn, partner) => {
    try {
      const history = partner.type === "group"
        ? await fetchGroupChatHistory(partner.groupName)
        : await fetchChatHistory(currentUser.userId, partner.userId);
      setMessages(history.reverse());
      const pinned = history.find(m => m.isPinned);
      setPinnedMessage(pinned ? pinned.content : null);
      history.forEach((m) => msgIdsRef.current.add(m.messageId));
    } catch {
      // no history yet
    }
  }, [currentUser]);

  const handleInputChange = useCallback(() => {
    const conn = connectionRef.current;
    if (!conn || !chatPartner || chatPartner.type === "group") return;

    if (!isAlreadyTyping) {
      conn.invoke("BroadcastTypingStatus", chatPartner.userId, true);
      setIsAlreadyTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      conn.invoke("BroadcastTypingStatus", chatPartner.userId, false);
      setIsAlreadyTyping(false);
    }, 2000);
  }, [chatPartner, isAlreadyTyping]);

  const sendMessage = useCallback(
    async (content) => {
      const conn = connectionRef.current;
      if (!conn || !chatPartner) return;

      try {
        if (chatPartner.type === "group") {
          await conn.invoke("SendGroupMessage", chatPartner.groupName, content);
        } else {
          await conn.invoke("SendPrivateMessage", chatPartner.userId, content);
        }
      } catch (err) {
        showError(err.message);
      }
    },
    [chatPartner]
  );

  const deleteMessage = useCallback(async (messageId) => {
    const conn = connectionRef.current;
    if (!conn) return;
    try {
      await conn.invoke("DeleteMessage", String(messageId));
    } catch (err) {
      showError(err.message);
    }
  }, []);

  const editMessage = useCallback(async (messageId, newContent) => {
    const conn = connectionRef.current;
    if (!conn) return;
    try {
      await conn.invoke("EditMessage", String(messageId), newContent);
    } catch (err) {
      showError(err.message);
    }
  }, []);

  const pinMessage = useCallback(async (messageId) => {
    if (pinnedMessageRef.current) {
      setPendingPinMessageId(messageId);
      return;
    }
    const conn = connectionRef.current;
    if (!conn) return;
    try {
      await conn.invoke("PinMessage", String(messageId));
    } catch (err) {
      showError(err.message);
    }
  }, []);

  const handleConfirmPin = useCallback(async () => {
    const messageId = pendingPinMessageId;
    setPendingPinMessageId(null);
    if (!messageId) return;
    const conn = connectionRef.current;
    if (!conn) return;
    try {
      await conn.invoke("PinMessage", String(messageId));
    } catch (err) {
      showError(err.message);
    }
  }, [pendingPinMessageId]);

  const handleCancelPin = useCallback(() => {
    setPendingPinMessageId(null);
  }, []);

  const unpinMessage = useCallback(async (messageId) => {
    const conn = connectionRef.current;
    if (!conn) return;
    try {
      await conn.invoke("UnpinMessage", String(messageId));
    } catch (err) {
      showError(err.message);
    }
  }, []);

  const formattedMessages = {};
  const q = searchQuery.toLowerCase().trim();
  for (const msg of messages) {
    if (q && !msg.content?.toLowerCase().includes(q)) continue;
    const key = toDateKey(msg.timestamp);
    const isOwn = currentUser
      ? String(msg.senderId) === String(currentUser.userId)
      : false;
    if (!formattedMessages[key]) formattedMessages[key] = [];
    formattedMessages[key].push({
      id: msg.messageId,
      sender: {
        name:
          msg.senderName ||
          (isOwn
            ? currentUser?.fullName
            : chatPartner?.fullName || "Unknown"),
        avatar: isOwn ? (currentUser?.avatar || null) : (chatPartner?.avatar || null),
        isOwnMessage: isOwn,
      },
      message: msg.content,
      sendTime: formatTime(msg.timestamp),
      isEdited: msg.isEdited,
      isPinned: msg.isPinned,
    });
  }

  const friendsList = friends.map((f) => ({
    id: f.userId,
    name: f.fullName,
  }));

  const handleSendInvite = async () => {
    if (!friendId.trim()) return;
    try {
      await sendFriendRequest(Number(friendId));
      setFriendId("");
      const data = await fetchPendingRequests();
      setFriendRequests(
        data.map((r) => ({
          id: r.friendRequestId,
          senderId: r.senderId,
          name: r.senderName,
          avatar: r.senderProfileImage,
          recipientId: r.recipientId,
          recipientName: r.recipientName,
        }))
      );
    } catch (err) {
      showError(err.message);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);
      setFriendRequests((reqs) => reqs.filter((r) => r.id !== requestId));
      const data = await fetchFriends();
      setFriends(data);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await declineFriendRequest(requestId);
      setFriendRequests((reqs) => reqs.filter((r) => r.id !== requestId));
    } catch (err) {
      showError(err.message);
    }
  };

  const handleCreateGroup = async ({ title, description, members, profileImage }) => {
    try {
      await createGroup(title, description, members, profileImage);
      const data = await fetchMyGroups();
      setGroups(data);
      setActivePanel("default");
    } catch (err) {
      showError(err.message);
    }
  };

  const handleSelectUser = (user) => {
    setMessages([]);
    setPinnedMessage(null);
    setUnreadCounts((prev) => ({ ...prev, [String(user.id)]: 0 }));
    setChatPartner({
      type: "user",
      userId: String(user.id),
      fullName: user.name,
      role: (user.roles?.[0] ?? ""),
      avatar: user.avatar || null,
    });
    setActivePanel("messaging");
  };

  const handleSelectGroup = (group) => {
    setMessages([]);
    setPinnedMessage(null);
    setChatPartner({
      type: "group",
      groupName: `group_${group.id}`,
      fullName: group.name,
      role: "Group",
      avatar: null,
    });
    setActivePanel("messaging");
  };

  return (
    <>
      {isChatOpen && (
        <Section className="fixed bottom-0 right-100 m-4 w-full max-w-[750px] bg-bg-surface-default-light dark:bg-bg-surface-default-dark rounded-lg shadow-lg p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 grid grid-cols-3 gap-4 w-full max-w-[750px] h-[600px] min-h-[600px] overflow-hidden">
            <ChatUsers
              chatPartner={chatPartner}
              friends={friends}
              groups={groups}
              onlineUsers={onlineUsers}
              unreadCounts={unreadCounts}
              onAddFriend={() => setActivePanel("addFriend")}
              onCreateGroup={() => setActivePanel("createGroup")}
              onSelectUser={handleSelectUser}
              onSelectGroup={handleSelectGroup}
              searchMembers={searchMembers}
              onSearchMembersChange={setSearchMembers}
              currentUser={currentUser}
            />
            <div className="col-span-2 flex flex-col min-h-0 gap-0">
              {activePanel === "default" ? (
                <DefaultChatPanel
                  onAddFriend={() => setActivePanel("addFriend")}
                  onCreateGroup={() => setActivePanel("createGroup")}
                />
              ) : activePanel === "createGroup" ? (
                <CreateGroupPanel
                  friends={friendsList}
                  onCreate={handleCreateGroup}
                  onCancel={() => setActivePanel("default")}
                />
              ) : activePanel === "addFriend" ? (
                <AddFriendPanel
                  friendId={friendId}
                  setFriendId={setFriendId}
                  friendRequests={friendRequests}
                  onInvite={handleSendInvite}
                  onBack={() => setActivePanel("default")}
                  onAcceptRequest={handleAcceptRequest}
                  onDeclineRequest={handleDeclineRequest}
                />
              ) : (
                <Messaging
                  messages={formattedMessages}
                  sendMessage={sendMessage}
                  onInputChange={handleInputChange}
                  partnerTyping={partnerTyping}
                  chatPartner={chatPartner}
                  deleteMessage={deleteMessage}
                  editMessage={editMessage}
                  pinMessage={pinMessage}
                  unpinMessage={unpinMessage}
                  pinnedMessage={pinnedMessage}
                  showSenderInfo={chatPartner?.type === "group"}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              )}
            </div>
          </div>

          <Dialog
            isOpen={!!pendingPinMessageId}
            variant="warning"
            title="Pin Message"
            onClose={handleCancelPin}
            onConfirm={handleConfirmPin}
            confirmText="Pin"
            cancelText="Cancel"
          >
            <p>
              There is already a pinned message in this chat. Only one message can be pinned at a time. The current pinned message will be unpinned.
            </p>
          </Dialog>
        </Section>
      )}

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-110 active:scale-95 transition-all duration-200 z-50"
      >
        <CommentsIcon size={22} />
      </button>
    </>
  );
}
