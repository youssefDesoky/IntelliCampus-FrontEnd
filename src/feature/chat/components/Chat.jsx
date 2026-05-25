import { useEffect, useState, useRef, useCallback } from "react";
import Section from "../../../components/ui/Section";
import ChatUsers from "./ChatUsers";
import Messaging from "./Messaging";
import {
  createHubConnection,
  getChatPartner,
  fetchChatHistory,
  toDateKey,
  formatTime,
} from "../services/chatService";

export default function Chat({ isChatOpen, setIsChatOpen, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [chatPartner, setChatPartner] = useState(null);
  const [isAlreadyTyping, setIsAlreadyTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const connectionRef = useRef(null);
  const msgIdsRef = useRef(new Set());
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    const partner = getChatPartner(currentUser.userId);
    setChatPartner(partner);
  }, [currentUser]);

  useEffect(() => {
    const prevConn = connectionRef.current;

    if (!isChatOpen || !currentUser || !chatPartner) {
      if (prevConn) {
        prevConn.stop();
        connectionRef.current = null;
      }
      return;
    }

    const init = async () => {
      const conn = createHubConnection();

      conn.on("ReceivePrivateMessage", (senderId, content) => {
        const isOwn = String(senderId) === String(currentUser.userId);
        const now = new Date();
        const tempId = `temp-${now.getTime()}-${Math.random()}`;
        const msg = {
          messageId: tempId,
          content,
          timestamp: now.toISOString(),
          senderId: String(senderId),
          senderName: isOwn ? currentUser.fullName : chatPartner.fullName,
          recipientId: isOwn ? chatPartner.userId : String(currentUser.userId),
          recipientName: isOwn ? chatPartner.fullName : currentUser.fullName,
        };
        msgIdsRef.current.add(tempId);
        setMessages((prev) => {
          const exists = prev.some((m) => m.messageId === tempId);
          return exists ? prev : [...prev, msg];
        });
      });

      // Listen for typing status from partner
      conn.on("ReceiveTypingStatus", (senderId, isTyping) => {
        // Only show if it's the partner
        if (String(senderId) === String(chatPartner.userId)) {
          setPartnerTyping(isTyping);
        }
      });

      conn.onreconnected(() => {
        loadHistory(conn, currentUser.userId, chatPartner.userId);
      });

      try {
        await conn.start();
        if (connectionRef.current && connectionRef.current !== conn) {
          await conn.stop();
          return;
        }
        connectionRef.current = conn;
        await loadHistory(conn, currentUser.userId, chatPartner.userId);
      } catch (err) {
        console.error("SignalR connection failed:", err);
      }
    };

    if (prevConn) {
      prevConn.stop();
      connectionRef.current = null;
    }

    init();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [isChatOpen, currentUser, chatPartner]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const loadHistory = useCallback(async (conn, uid, partnerId) => {
    try {
      const history = await fetchChatHistory(uid, partnerId);
      setMessages(history.reverse());
      history.forEach((m) => msgIdsRef.current.add(m.messageId));
    } catch {
      // no history yet
    }
  }, []);

  const handleInputChange = useCallback(() => {
    const conn = connectionRef.current;
    if (!conn || !chatPartner) return;

    // 1. When user starts typing, send typing status = true (only once at the beginning)
    if (!isAlreadyTyping) {
      conn.invoke("BroadcastTypingStatus", chatPartner.userId, true);
      setIsAlreadyTyping(true);
    }

    // 2. Clear the old timeout if user is still typing continuously
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 3. Set a new timeout: if user stops typing for 2 seconds (2000 milliseconds),
    //    send typing status = false to the server
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
        await conn.invoke("SendPrivateMessage", chatPartner.userId, content);
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    },
    [chatPartner]
  );

  const formattedMessages = {};
  for (const msg of messages) {
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
        avatar: null,
        isOwnMessage: isOwn,
      },
      message: msg.content,
      sendTime: formatTime(msg.timestamp),
    });
  }

  return (
    <Section className="fixed bottom-0 right-100 m-4 w-full max-w-[750px] bg-bg-surface-default-light dark:bg-bg-surface-default-dark rounded-lg shadow-lg p-4 z-50">
      {isChatOpen && (
        <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4 grid grid-cols-3 gap-4 w-full max-w-[750px] h-[600px] min-h-[600px] overflow-hidden">
          <ChatUsers chatPartner={chatPartner} />
          <Messaging 
            messages={formattedMessages} 
            sendMessage={sendMessage}
            onInputChange={handleInputChange}
            partnerTyping={partnerTyping}
          />
        </div>
      )}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Open Chat
      </button>
    </Section>
  );
}
