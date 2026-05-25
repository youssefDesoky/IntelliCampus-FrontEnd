import { useState } from "react";
import { PaperclipIcon, PaperPlaneIcon } from "../../../components/ui/icons";

export default function ChatControls({ sendMessage, onInputChange }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 w-full">
        <button>
          <PaperclipIcon size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (onInputChange) onInputChange();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full"
        />
        <button onClick={handleSend}>
          <PaperPlaneIcon size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Press Enter to send, Shift+Enter for new line
      </span>
    </div>
  );
}
