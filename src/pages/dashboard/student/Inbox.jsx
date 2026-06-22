import { useState, useEffect, useCallback } from "react";
import { useError } from '../../../contexts/ErrorContext.jsx';
import { fetchInboxMessages, fetchSentMessages, markMessageAsRead, deleteMessage } from "../../../api/messages";
import { EnvelopIcon, PaperPlaneIcon, TrashIcon, ImportIcon, XIcon } from "../../../components/ui/icons";

const FILTERS = [
  { key: "all", label: "All", icon: EnvelopIcon },
  { key: "unread", label: "Unread", icon: EnvelopIcon },
  { key: "sent", label: "Sent", icon: PaperPlaneIcon },
];

function ChevronIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width="16"
      height="16"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function getTimestamp(msg) {
  const raw = msg.sentAt || msg.date;
  if (!raw) return 0;
  const t = new Date(raw).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function getEmptyStateMessage(filter, searchQuery) {
  if (searchQuery) return "No messages match your search";
  switch (filter) {
    case "unread":
      return "You're all caught up";
    case "sent":
      return "You haven't sent any messages yet";
    default:
      return "No messages yet";
  }
}

function MessageRow({ msg, isExpanded, onToggle, onDelete }) {
  const isSent = msg.direction === "sent";
  const personName = isSent
    ? msg.recipientName || msg.to || "Unknown recipient"
    : msg.senderName || msg.from || "Unknown sender";
  const initials = getInitials(personName);
  const isUnread = !isSent && !msg.isRead;

  return (
    <div
      className={`overflow-hidden rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark ${
        isSent ? "rounded-tr-none" : "rounded-tl-none"
      } ${
        isUnread
          ? "bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark"
          : "bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark"
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark transition-colors ${
          isSent ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark ${
            isSent
              ? "text-text-secondary-active-light dark:text-text-secondary-active-dark"
              : "text-text-blue-default-light dark:text-text-blue-default-dark"
          }`}
        >
          {isSent ? <PaperPlaneIcon className="w-4 h-4" /> : initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            {isSent ? (
              <span className="shrink-0 text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                {msg.sentAt || msg.date || ""}
              </span>
            ) : (
              <span
                className={`text-sm truncate ${
                  isUnread
                    ? "font-semibold text-text-primary-active-light dark:text-text-primary-active-dark"
                    : "font-medium text-text-secondary-active-light dark:text-text-secondary-active-dark"
                }`}
              >
                {personName}
              </span>
            )}

            {isSent ? (
              <span className="flex items-center gap-1.5 min-w-0">
                <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark">
                  Sent
                </span>
                <span className="text-sm font-medium truncate text-text-secondary-active-light dark:text-text-secondary-active-dark">
                  To: {personName}
                </span>
              </span>
            ) : (
              <span className="shrink-0 text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                {msg.sentAt || msg.date || ""}
              </span>
            )}
          </div>

          <p
            className={`text-sm mt-0.5 truncate ${isSent ? "text-right" : "text-left"} ${
              isUnread
                ? "font-semibold text-text-primary-active-light dark:text-text-primary-active-dark"
                : "text-text-secondary-active-light dark:text-text-secondary-active-dark"
            }`}
          >
            {msg.subject || "(No subject)"}
          </p>

          {!isExpanded && (
            <p
              className={`text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark truncate mt-0.5 ${
                isSent ? "text-right" : "text-left"
              }`}
            >
              {msg.preview || msg.body || ""}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => onDelete(e, msg)}
            className="p-1 rounded hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-red-500"
            aria-label="Delete message"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
          <ChevronIcon
            className={`text-text-secondary-default-light dark:text-text-secondary-default-dark transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isExpanded && (
        <div
          className={`px-4 pb-4 pt-2 text-sm leading-relaxed border-t border-border-primary-default-light dark:border-border-primary-default-dark text-text-primary-active-light dark:text-text-primary-active-dark ${
            isSent ? "text-right" : "text-left"
          }`}
        >
          {msg.body || msg.preview || "No content"}
        </div>
      )}
    </div>
  );
}

export default function Inbox() {
  const { showError } = useError();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedKey, setExpandedKey] = useState(null);

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const [inboxData, sentData] = await Promise.all([
        fetchInboxMessages(),
        fetchSentMessages(),
      ]);
      const inbox = (Array.isArray(inboxData) ? inboxData : []).map((m) => ({
        ...m,
        direction: "received",
      }));
      const sent = (Array.isArray(sentData) ? sentData : []).map((m) => ({
        ...m,
        direction: "sent",
      }));
      const merged = [...inbox, ...sent].sort(
        (a, b) => getTimestamp(b) - getTimestamp(a)
      );
      setMessages(merged);
    } catch (err) {
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleToggleExpand = async (msg) => {
    const key = `${msg.direction}-${msg.id}`;
    const willExpand = expandedKey !== key;
    setExpandedKey(willExpand ? key : null);
    if (willExpand && msg.direction === "received" && !msg.isRead) {
      try {
        await markMessageAsRead(msg.id);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msg.id && m.direction === "received"
              ? { ...m, isRead: true }
              : m
          )
        );
      } catch (err) {
        showError(err.message);
      }
    }
  };

  const handleDelete = async (e, msg) => {
    e.stopPropagation();
    try {
      await deleteMessage(msg.id);
      setMessages((prev) =>
        prev.filter((m) => !(m.id === msg.id && m.direction === msg.direction))
      );
      const key = `${msg.direction}-${msg.id}`;
      if (expandedKey === key) setExpandedKey(null);
    } catch (err) {
      showError(err.message);
    }
  };

  const unreadCount = messages.filter(
    (m) => m.direction === "received" && !m.isRead && !m.isDeleted
  ).length;

  const filteredMessages = messages.filter((msg) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const person =
        msg.direction === "sent"
          ? msg.recipientName || msg.to || ""
          : msg.senderName || msg.from || "";
      const matchesSearch =
        (msg.subject || "").toLowerCase().includes(q) ||
        person.toLowerCase().includes(q) ||
        (msg.preview || msg.body || "").toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    switch (activeFilter) {
      case "unread":
        return msg.direction === "received" && !msg.isRead && !msg.isDeleted;
      case "sent":
        return msg.direction === "sent" && !msg.isDeleted;
      default:
        return !msg.isDeleted;
    }
  });

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <EnvelopIcon className="w-6 h-6 text-text-blue-default-light dark:text-text-blue-default-dark" />
          <h1 className="text-2xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark">
            Messages
          </h1>
          {unreadCount > 0 && (
            <span className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
              ({unreadCount} unread)
            </span>
          )}
        </div>

        <div className="relative sm:w-64">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pr-8 text-sm rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-active-light dark:text-text-primary-active-dark outline-none focus:border-text-blue-default-light dark:focus:border-text-blue-default-dark"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              aria-label="Clear search"
            >
              <XIcon className="w-4 h-4 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {FILTERS.map(({ key, label, icon: Icon }) => {
          const count = key === "unread" ? unreadCount : 0;
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? "bg-text-blue-default-light dark:bg-text-blue-default-dark text-white"
                  : "text-text-secondary-active-light dark:text-text-secondary-active-dark bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              {count > 0 && (
                <span
                  className={`text-xs px-1.5 rounded-full ${
                    isActive
                      ? "bg-white/20"
                      : "bg-text-blue-default-light dark:bg-text-blue-default-dark text-white"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-text-secondary-default-light dark:text-text-secondary-default-dark">
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary-default-light dark:text-text-secondary-default-dark gap-2">
            <ImportIcon className="w-12 h-12 opacity-40" />
            <p className="text-sm">{getEmptyStateMessage(activeFilter, searchQuery)}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pb-2">
            {filteredMessages.map((msg) => (
              <MessageRow
                key={`${msg.direction}-${msg.id}`}
                msg={msg}
                isExpanded={expandedKey === `${msg.direction}-${msg.id}`}
                onToggle={() => handleToggleExpand(msg)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}