import { useState, useEffect, useCallback } from "react";
import { useError } from '../../../contexts/ErrorContext.jsx';
import { fetchInboxMessages, fetchSentMessages, markMessageAsRead, deleteMessage } from "../../../api/messages";
import { EnvelopIcon, PaperPlaneIcon, TrashIcon, StarIcon, FilePenIcon, ImportIcon, XIcon } from "../../../components/ui/icons";

const FOLDERS = [
  { key: "inbox", label: "Inbox", icon: EnvelopIcon },
  { key: "sent", label: "Sent", icon: PaperPlaneIcon },
  { key: "starred", label: "Starred", icon: StarIcon },
  { key: "drafts", label: "Drafts", icon: FilePenIcon },
  { key: "trash", label: "Trash", icon: TrashIcon },
];

export default function Inbox() {
  const { showError } = useError();
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      let data;
      if (activeFolder === "sent") {
        data = await fetchSentMessages();
      } else {
        data = await fetchInboxMessages();
      }
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeFolder]);

  useEffect(() => {
    setSelectedMessage(null);
    loadMessages();
  }, [loadMessages]);

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    if (!msg.isRead && activeFolder === "inbox") {
      try {
        await markMessageAsRead(msg.id);
        setMessages(prev =>
          prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m)
        );
      } catch (err) {
        showError(err.message);
      }
    }
  };

  const handleDelete = async (e, msgId) => {
    e.stopPropagation();
    try {
      await deleteMessage(msgId);
      setMessages(prev => prev.filter(m => m.id !== msgId));
      if (selectedMessage?.id === msgId) setSelectedMessage(null);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleBack = () => setSelectedMessage(null);

  const filteredMessages = messages.filter(msg => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (msg.subject || "").toLowerCase().includes(q) ||
      (msg.senderName || msg.from || "").toLowerCase().includes(q)
    );
  });

  const unreadCount = messages.filter(m => !m.isRead).length;

  const FolderIcon = FOLDERS.find(f => f.key === activeFolder)?.icon || EnvelopIcon;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FolderIcon className="w-6 h-6 text-text-blue-default-light dark:text-text-blue-default-dark" />
          <h1 className="text-2xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark capitalize">
            {activeFolder}
          </h1>
          {activeFolder === "inbox" && unreadCount > 0 && (
            <span className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
              ({unreadCount} unread)
            </span>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 px-3 py-2 pr-8 text-sm rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-active-light dark:text-text-primary-active-dark outline-none focus:border-text-blue-default-light dark:focus:border-text-blue-default-dark"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2">
              <XIcon className="w-4 h-4 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Folders Sidebar */}
        <div className="hidden md:flex flex-col w-48 shrink-0 gap-1">
          {FOLDERS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveFolder(key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                activeFolder === key
                  ? "bg-text-blue-default-light dark:bg-text-blue-default-dark text-white"
                  : "text-text-secondary-active-light dark:text-text-secondary-active-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {key === "inbox" && unreadCount > 0 && (
                <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${
                  activeFolder === "inbox" ? "bg-white/20" : "bg-text-blue-default-light dark:bg-text-blue-default-dark text-white"
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Mobile folder tabs */}
        <div className="flex md:hidden gap-1 overflow-x-auto pb-2">
          {FOLDERS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveFolder(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeFolder === key
                  ? "bg-text-blue-default-light dark:bg-text-blue-default-dark text-white"
                  : "text-text-secondary-active-light dark:text-text-secondary-active-dark bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              {key === "inbox" && unreadCount > 0 && (
                <span className="text-xs">({unreadCount})</span>
              )}
            </button>
          ))}
        </div>

        {/* Message List + Detail */}
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Message List */}
          <div className={`flex flex-col flex-1 overflow-hidden rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark ${
            selectedMessage ? "hidden lg:flex" : "flex"
          }`}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-text-secondary-default-light dark:text-text-secondary-default-dark">
                Loading messages...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-secondary-default-light dark:text-text-secondary-default-dark gap-2">
                <ImportIcon className="w-12 h-12 opacity-40" />
                <p className="text-sm">No messages in {activeFolder}</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-border-primary-default-light dark:border-border-primary-default-dark cursor-pointer transition-colors hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark ${
                      !msg.isRead ? "bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark font-semibold" : ""
                    } ${selectedMessage?.id === msg.id ? "bg-bg-fill-primary-hover-light dark:bg-bg-fill-primary-hover-dark" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm truncate ${
                          !msg.isRead 
                            ? "text-text-primary-active-light dark:text-text-primary-active-dark" 
                            : "text-text-secondary-active-light dark:text-text-secondary-active-dark"
                        }`}>
                          {msg.senderName || msg.from || "Unknown"}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            {msg.sentAt || msg.date || ""}
                          </span>
                          <button
                            onClick={(e) => handleDelete(e, msg.id)}
                            className="p-1 rounded hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-red-500"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className={`text-sm mt-0.5 truncate ${
                        !msg.isRead
                          ? "text-text-primary-active-light dark:text-text-primary-active-dark"
                          : "text-text-secondary-default-light dark:text-text-secondary-default-dark"
                      }`}>
                        {msg.subject || "(No subject)"}
                      </p>
                      <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark truncate mt-0.5">
                        {msg.preview || msg.body || ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail */}
          {selectedMessage && (
            <div className="flex flex-col flex-1 lg:flex-initial lg:w-[45%] overflow-hidden rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark">
              <div className="flex items-center gap-2 p-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark">
                <button
                  onClick={handleBack}
                  className="lg:hidden p-1 rounded hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark"
                >
                  <XIcon className="w-5 h-5 text-text-secondary-active-light dark:text-text-secondary-active-dark" />
                </button>
                <h2 className="font-semibold text-text-primary-active-light dark:text-text-primary-active-dark truncate">
                  {selectedMessage.subject || "(No subject)"}
                </h2>
              </div>
              <div className="p-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary-active-light dark:text-text-primary-active-dark">
                      {selectedMessage.senderName || selectedMessage.from || "Unknown"}
                    </p>
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1">
                      {selectedMessage.sentAt || selectedMessage.date || ""}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, selectedMessage.id)}
                    className="p-2 rounded-lg hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto text-sm text-text-primary-active-light dark:text-text-primary-active-dark leading-relaxed [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {selectedMessage.body || selectedMessage.preview || "No content"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
