import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import Section from "../../../components/ui/Section";
import Dialog from "../../../components/ui/Dialog";
import ChatUsers from "./ChatUsers";
import Messaging from "./Messaging";
import DefaultChatPanel from "./DefaultChatPanel";
import AddFriendPanel from "./AddFriendPanel";
import CreateGroupPanel from "./CreateGroupPanel";
import { useSidebar } from "../../../hooks";
import * as signalR from "@microsoft/signalr";
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
  deleteFriend,
  leaveGroup,
  uploadFile,
  fetchGroupById,
  addGroupMember,
  searchUsers,
} from "../services/chatService";
import { useError } from '../../../contexts/ErrorContext.jsx';
import { useToast } from '../../../contexts/ToastContext.jsx';
import { setChatState } from '../../../utils/notificationHandler';
import { getLocalizedField } from '../../../utils/getLocalizedField';

export default function Chat({ isChatOpen, setIsChatOpen, currentUser, defaultPanel, defaultPanelTrigger, defaultUser, defaultGroupName }) {
  const { t, i18n } = useTranslation('chat');
  const { showError } = useError();
  const { showToast } = useToast();
  const { isPhone } = useSidebar();
  // "default" | "messaging" | "addFriend" | "createGroup"
  const [activePanel, setActivePanel] = useState(defaultPanel || "default");
  useEffect(() => {
    if (defaultPanel) setActivePanel(defaultPanel);
  }, [defaultPanel, defaultPanelTrigger]);
  useEffect(() => {
    if (defaultUser) {
      setMessages([]);
      setPinnedMessage(null);
      setChatPartner({
        type: "user",
        userId: String(defaultUser.id),
        fullName: defaultUser.name || "User",
        role: "",
        avatar: null,
      });
      setActivePanel("messaging");
    }
  }, [defaultUser]);
  useEffect(() => {
    if (defaultGroupName) {
      openGroupChat(defaultGroupName);
    }
  }, [defaultGroupName]);
  const isChatOpenRef = useRef(isChatOpen);
  useEffect(() => { isChatOpenRef.current = isChatOpen; }, [isChatOpen]);
  const [friendId, setFriendId] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatPartner, setChatPartner] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupDetails, setGroupDetails] = useState(null);
  const [isAlreadyTyping, setIsAlreadyTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [pendingPinMessageId, setPendingPinMessageId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", onConfirm: null });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchMembers, setSearchMembers] = useState("");
  const isSendingRef = useRef(false);
  const connectionRef = useRef(null);
  const chatPartnerRef = useRef(null);
  const msgIdsRef = useRef(new Set());
  const typingTimeoutRef = useRef(null);
  const pinnedMessageRef = useRef(null);
  const leavingGroupRef = useRef(null);

  // Keep refs in sync with state so SignalR handlers always have latest value
  useEffect(() => { chatPartnerRef.current = chatPartner; }, [chatPartner]);
  useEffect(() => { pinnedMessageRef.current = pinnedMessage; }, [pinnedMessage]);

  useEffect(() => {
    const userId = chatPartner && chatPartner.type !== 'group' ? String(chatPartner.userId) : null;
    setChatState({ isChatOpen, activeChatUserId: userId });
  }, [isChatOpen, chatPartner]);

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
        console.log("[Chat] loadGroups returned:", data);
        setGroups(data);
      } catch (err) {
        console.error("[Chat] loadGroups failed:", err);
      }
    };

    loadFriends();
    loadRequests();
    loadGroups();
  }, [currentUser]);

  // SignalR connection — alive as long as user is logged in
  useEffect(() => {
    if (!currentUser) return;

    const conn = createHubConnection();

    conn.on("ReceiveFriendRequest", (req) => {
      setFriendRequests((prev) => [
        ...prev,
        {
          id: req.friendRequestId,
          senderId: req.senderId,
          name: req.senderName,
          avatar: req.senderProfileImage,
          recipientId: req.recipientId,
          recipientName: req.recipientName,
        },
      ]);
    });

    conn.on("FriendRequestAccepted", async (req) => {
      setSentRequests((prev) => prev.filter((r) => r.id !== req.friendRequestId));
      try {
        const data = await fetchFriends();
        setFriends(data);
      } catch {}
    });

    conn.on("ReceivePrivateMessage", (msg) => {
      const senderId = String(msg.senderId);
      const isOwn = senderId === String(currentUser.userId);
      const partner = chatPartnerRef.current;
      const isActiveChat = isChatOpenRef.current && partner && partner.type !== "group" && senderId === String(partner.userId);

      if (isOwn || isActiveChat) {
        setPartnerTyping(false);
        msgIdsRef.current.add(msg.messageId);
        setMessages((prev) => {
          const exists = prev.some((m) => m.messageId === msg.messageId);
          return exists ? prev : [...prev, msg];
        });
        return;
      }

      setUnreadCounts((prev) => ({ ...prev, [senderId]: (prev[senderId] || 0) + 1 }));
    });

    conn.on("ReceiveGroupMessage", (msg) => {
      const partner = chatPartnerRef.current;
      const isActiveGroup = partner && partner.type === "group" && partner.groupName === msg.groupName && isChatOpenRef.current;
      if (isActiveGroup) {
        msgIdsRef.current.add(msg.messageId);
        setMessages((prev) => {
          const exists = prev.some((m) => m.messageId === msg.messageId);
          return exists ? prev : [...prev, msg];
        });
      } else {
        setUnreadCounts((prev) => ({ ...prev, [msg.groupName]: (prev[msg.groupName] || 0) + 1 }));
      }
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
      if (!isChatOpenRef.current) return;
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

    conn.on("GroupMembersUpdated", (data) => {
      const partner = chatPartnerRef.current;
      const isViewingThisGroup = partner?.type === "group" && partner.groupName === data.groupName;
      if (isViewingThisGroup && leavingGroupRef.current !== data.groupName) {
        setMessages((prev) => [...prev, {
          messageId: `sys_${Date.now()}`,
          content: data.content,
          timestamp: data.timestamp,
          senderId: "0",
          senderName: "System",
          isSystemMessage: true,
        }]);
        const gid = partner.groupName.replace("group_", "");
        fetchGroupById(gid).then((details) => { setGroupDetails(details); setGroupMembers(details.members || []); }).catch(() => {});
      } else if (!isViewingThisGroup) {
        showToast({ type: "info", title: "Group Update", message: data.content });
      }
    });

    conn.on("GroupCreated", async () => {
      try {
        const data = await fetchMyGroups();
        setGroups(data);
      } catch {}
    });

    conn.onreconnecting((error) => {
      console.warn("[ChatHub] Reconnecting...", error);
    });

    conn.onreconnected(async () => {
      console.info("[ChatHub] Reconnected.");
      await joinAllGroups(conn);
    });

    conn.onclose((error) => {
      console.error("[ChatHub] Connection closed.", error);
    });

    let disposed = false;
    conn
      .start()
      .then(async () => {
        if (disposed) { conn.stop(); return; }
        await joinAllGroups(conn);
      })
      .catch((err) => {
        if (disposed) return;
        console.error("[ChatHub] Connection failed:", err);
      });

    connectionRef.current = conn;

    return () => {
      disposed = true;
      if (
        conn.state === signalR.HubConnectionState.Connected ||
        conn.state === signalR.HubConnectionState.Reconnecting
      ) {
        conn.stop();
      }
      if (connectionRef.current === conn) connectionRef.current = null;
    };
  }, [currentUser]);

  // Track chat state for notification system
  useEffect(() => {
    setChatState({ isChatOpen, activeChatUserId: chatPartner?.userId || chatPartner?.groupName || null });
  }, [isChatOpen, chatPartner]);

  async function joinAllGroups(conn) {
    try {
      const groups = await fetchMyGroups();
      for (const g of groups) {
        await conn.invoke("JoinGroup", `group_${g.groupId}`);
      }
    } catch (err) {
      console.warn("[ChatHub] Failed to join groups:", err);
    }
  }

  function openPrivateChat(senderId, senderName, senderAvatar) {
    setMessages([]);
    setPinnedMessage(null);
    setUnreadCounts((prev) => ({ ...prev, [senderId]: 0 }));
    setChatPartner({
      type: "user",
      userId: senderId,
      fullName: senderName,
      role: "",
      avatar: senderAvatar || null,
    });
    setActivePanel("messaging");
    setIsChatOpen(true);
  }

  function openGroupChat(groupName, groupTitle) {
    const groupId = Number(groupName.replace("group_", ""));
    setMessages([]);
    setPinnedMessage(null);
    setUnreadCounts((prev) => ({ ...prev, [groupName]: 0 }));
    setChatPartner({
      type: "group",
      groupName,
      fullName: groupTitle || groupName.replace("group_", "Group "),
      role: "Group",
      avatar: null,
    });
    setActivePanel("messaging");
    setIsChatOpen(true);
    fetchGroupById(groupId).then((details) => {
      setGroupDetails(details);
      setGroupMembers(details.members || []);
    }).catch(() => {
      setGroupDetails(null);
      setGroupMembers([]);
    });
  }

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
      if (isSendingRef.current) return;
      isSendingRef.current = true;
      const conn = connectionRef.current;
      if (!conn || !chatPartner) {
        isSendingRef.current = false;
        return;
      }

      try {
        if (chatPartner.type === "group") {
          await conn.invoke("SendGroupMessage", chatPartner.groupName, content);
        } else {
          await conn.invoke("SendPrivateMessage", chatPartner.userId, content);
        }
      } catch (err) {
        showError(err.message);
      } finally {
        isSendingRef.current = false;
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
            ? getLocalizedField(currentUser, 'fullName', i18n.language)
            : getLocalizedField(chatPartner, 'fullName', i18n.language) || "Unknown"),
        avatar: isOwn ? (currentUser?.avatar || null) : (chatPartner?.avatar || null),
        isOwnMessage: isOwn,
      },
      message: msg.content,
      sendTime: formatTime(msg.timestamp),
      isEdited: msg.isEdited,
      isPinned: msg.isPinned,
      isSystemMessage: msg.isSystemMessage,
    });
  }

  const friendsList = friends.map((f) => ({
    id: f.userId,
    name: getLocalizedField(f, 'fullName', i18n.language),
  }));

  const handleSendInvite = async () => {
    const id = friendId.trim();
    if (!id) return;
    try {
      const result = await sendFriendRequest(id);
      setFriendId("");
      setSentRequests((prev) => [
        ...prev,
        {
          id: result.friendRequestId,
          recipientId: result.recipientId,
          name: result.recipientName,
          avatar: result.recipientProfileImage,
          status: result.status,
        },
      ]);
      const [reqData, friendData] = await Promise.all([
        fetchPendingRequests(),
        fetchFriends(),
      ]);
      setFriendRequests(
        reqData.map((r) => ({
          id: r.friendRequestId,
          senderId: r.senderId,
          name: r.senderName,
          avatar: r.senderProfileImage,
          recipientId: r.recipientId,
          recipientName: r.recipientName,
        }))
      );
      setFriends(friendData);
      showToast({ type: "success", title: "Sent", message: "Friend request sent." });
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
      const newGroup = await createGroup(title, description, members, profileImage);
      setGroups((prev) => [...prev, newGroup]);
      setActivePanel("default");
      showToast({ type: "success", title: "Group Created", message: `"${title}" has been created successfully.` });
    } catch (err) {
      showError(err.message);
    }
  };

  const handleSelectUser = (user) => {
    setMessages([]);
    setPinnedMessage(null);
    setGroupDetails(null);
    setGroupMembers([]);
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

  const handleSelectGroup = async (group) => {
    setMessages([]);
    setPinnedMessage(null);
    const groupName = `group_${group.id}`;
    setUnreadCounts((prev) => ({ ...prev, [groupName]: 0 }));
    setChatPartner({
      type: "group",
      groupName: groupName,
      fullName: group.name,
      role: "Group",
      avatar: group.profileImage || null,
    });
    setActivePanel("messaging");
    try {
      const details = await fetchGroupById(group.id);
      setGroupDetails(details);
      setGroupMembers(details.members || []);
    } catch {
      setGroupDetails(null);
      setGroupMembers([]);
    }
  };

  const handleAddGroupMember = async (userId) => {
    if (!groupDetails) return;
    try {
      await addGroupMember(groupDetails.groupId, userId);
      const details = await fetchGroupById(groupDetails.groupId);
      setGroupDetails(details);
      setGroupMembers(details.members || []);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleBackToUsers = () => {
    setActivePanel("default");
    setChatPartner(null);
    setMessages([]);
    setPinnedMessage(null);
    setGroupDetails(null);
    setGroupMembers([]);
    setSearchQuery("");
  };

  const handleAttachFile = async (file, type) => {
    if (type !== "media") return;
    try {
      const result = await uploadFile(file);
      const url = result.url;
      const conn = connectionRef.current;
      if (!conn || !chatPartner) return;
      if (chatPartner.type === "group") {
        await conn.invoke("SendGroupMessage", chatPartner.groupName, url);
      } else {
        await conn.invoke("SendPrivateMessage", chatPartner.userId, url);
      }
    } catch (err) {
      showError(err.message);
    }
  };

  const executeConfirmAction = () => {
    if (confirmDialog.onConfirm) {
      confirmDialog.onConfirm();
    }
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDeleteFriend = (friendId) => {
    const name = chatPartner?.fullName || "this user";
    setConfirmDialog({
      isOpen: true,
      title: "Remove Friend",
      message: (
        <>
          <p className="mb-2">Are you sure you want to remove <strong>{name}</strong> from your friends?</p>
          <p className="text-xs opacity-70">This will unfriend you and remove them from your contacts. They won't be able to send you messages unless you become friends again.</p>
        </>
      ),
      onConfirm: async () => {
        try {
          await deleteFriend(friendId);
          setFriends((prev) => prev.filter((f) => f.userId !== friendId));
          setChatPartner(null);
          setActivePanel("default");
          setMessages([]);
          showToast({ type: "info", title: "Removed", message: "Friend removed successfully." });
        } catch (err) {
          showError(err.message);
        }
      },
    });
  };

  const handleLeaveGroup = () => {
    if (!chatPartner || chatPartner.type !== "group") return;
    const name = chatPartner.fullName || "this group";
    setConfirmDialog({
      isOpen: true,
      title: "Leave Group",
      message: (
        <>
          <p className="mb-2">Are you sure you want to leave <strong>"{name}"</strong>?</p>
          <p className="text-xs opacity-70">You will no longer receive messages from this group. You can only rejoin if a group member adds you back.</p>
        </>
      ),
      onConfirm: async () => {
        const groupId = Number(chatPartner.groupName?.replace("group_", ""));
        if (!groupId) return;
        leavingGroupRef.current = `group_${groupId}`;
        try {
          await leaveGroup(groupId);
          setGroups((prev) => prev.filter((g) => g.groupId !== groupId));
          setChatPartner(null);
          setActivePanel("default");
          setMessages([]);
          setGroupMembers([]);
          leavingGroupRef.current = null;
          showToast({ type: "info", title: "Left", message: "You left the group." });
        } catch (err) {
          leavingGroupRef.current = null;
          showError(err.message);
        }
      },
    });
  };

  return (
    <>
      {isChatOpen && (
        <Section className={`fixed z-50 ${isPhone ? 'inset-0 rounded-none p-0 h-dvh' : 'bottom-4 end-6 w-full max-w-[750px]'} bg-bg-surface-default-light dark:bg-bg-surface-default-dark shadow-lg ${isPhone ? 'p-0' : 'p-4'}`}>
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col ${isPhone ? 'w-full h-full' : 'w-full max-w-[750px] h-[600px] min-h-[600px]'}`}>
            {/* Top bar with close button */}
            <div className="flex items-center justify-end px-3 py-2 border-b border-gray-100 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-800">
              <button
                onClick={() => setIsChatOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-red-400 transition-all active:scale-90"
                aria-label={t('closeChat')}
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
            <div className={`flex-1 min-h-0 p-4 ${isPhone ? '' : 'grid grid-cols-3 gap-4'}`}>
              {(!isPhone || activePanel === "default") && (
                isPhone && !friends.length && !groups.length ? (
                  <DefaultChatPanel
                    onAddFriend={() => setActivePanel("addFriend")}
                    onCreateGroup={() => setActivePanel("createGroup")}
                    noMembers
                  />
                ) : (
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
                )
              )}
            {(!isPhone || activePanel !== "default") && (
              <div className={`${isPhone ? 'h-full' : 'col-span-2 h-full'} flex flex-col min-h-0 gap-0`}>
                  {activePanel === "default" ? (
                    <DefaultChatPanel
                      onAddFriend={() => setActivePanel("addFriend")}
                      onCreateGroup={() => setActivePanel("createGroup")}
                      noMembers={!friends.length && !groups.length}
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
                      sentRequests={sentRequests}
                      onInvite={handleSendInvite}
                      onBack={() => setActivePanel("default")}
                      onAcceptRequest={handleAcceptRequest}
                      onDeclineRequest={handleDeclineRequest}
                      searchUsers={searchUsers}
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
                    isPhone={isPhone}
                    onBack={handleBackToUsers}
                    onAttachFile={handleAttachFile}
                    onDeleteFriend={handleDeleteFriend}
                    onLeaveGroup={handleLeaveGroup}
                    groupMembers={groupMembers}
                    groupDetails={groupDetails}
                    onAddGroupMember={handleAddGroupMember}
                    currentUser={currentUser}
                  />
                  )}
                </div>
              )}
            </div>
          </div>

          <Dialog
            isOpen={!!pendingPinMessageId}
            variant="warning"
            title={t('pin.title')}
            onClose={handleCancelPin}
            onConfirm={handleConfirmPin}
            confirmText={t('pin.confirm')}
            cancelText={t('pin.cancel')}
          >
            <p>
              {t('pin.warning')}
            </p>
          </Dialog>

          <Dialog
            isOpen={confirmDialog.isOpen}
            variant="warning"
            title={confirmDialog.title}
            onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
            onConfirm={executeConfirmAction}
            confirmText={confirmDialog.title === "Remove Friend" ? "Remove" : "Leave"}
            cancelText="Cancel"
          >
            {confirmDialog.message}
          </Dialog>
        </Section>
      )}

    </>
  );
}
