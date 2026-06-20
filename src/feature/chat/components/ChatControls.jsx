import { useState } from "react";
import { PaperclipIcon, PaperPlaneIcon } from "../../../components/ui/icons";

export default function ChatControls({ sendMessage, onInputChange }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed) {
      sendMessage(trimmed);
      setText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = text.trim().length > 0;
  const isTyping = text.length > 0;

  return (
    <div className="pt-3 border-t border-white/8 mt-2">
      <div
        className={`
          flex items-center gap-2 w-full
          rounded-xl border px-3 py-2.5 transition-all duration-200
          ${focused
            ? "border-[var(--primary)]/50 bg-white/6 shadow-[0_0_0_3px_var(--primary-10,rgba(59,130,246,0.08))]"
            : "border-white/10 bg-white/4 hover:border-white/20"
          }
        `}
      >
        {/* Attachment */}
        <button
          type="button"
          className="flex-shrink-0 p-1 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-white/6 transition-colors"
        >
          <PaperclipIcon size={17} />
        </button>

        {/* Input */}
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (onInputChange) onInputChange();
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Type a message…"
          className="
            flex-1 bg-transparent outline-none border-none
            text-sm text-[var(--text-primary)]
            placeholder:text-[var(--text-tertiary)]
            min-w-0
          "
        />

        {/* Send */}
        <button
          type="button"
          onClick={handleSend}
          className={`
            flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
            transition-all duration-200
            ${canSend
              ? "bg-[var(--primary)] text-white hover:brightness-110 active:scale-95 shadow-md"
              : "bg-white/6 text-[var(--text-tertiary)]"
            }
          `}
          aria-label="Send message"
          disabled={!canSend}
        >
          <PaperPlaneIcon size={18} />
        </button>
      </div>

      <p className="text-center text-[10px] text-[var(--text-tertiary)] mt-2">
        Enter to send · Shift+Enter for new line
      </p>

      <style>{`
        @keyframes bounceDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}