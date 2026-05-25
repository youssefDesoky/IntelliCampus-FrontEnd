import MessageSection from "./MessageSection";
import PinnedMessage from "./PinnedMessage";
import ChatControls from "./ChatControls";

export default function Messaging({ messages, sendMessage, onInputChange, partnerTyping }) {
  return (
    <div className="col-span-2 flex flex-col min-h-0">
      <PinnedMessage message="Don't forget to submit your assignments by the end of this week!" />
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 no-scrollbar">
        {Object.entries(messages).map(([date, msgs]) => (
          <MessageSection key={date} date={date} messages={msgs} />
        ))}
      </div>
      {partnerTyping && (
        <div className="px-4 py-2 text-sm text-gray-500 animate-pulse">The other user is typing...</div>
      )}
      <ChatControls sendMessage={sendMessage} onInputChange={onInputChange} />
    </div>
  );
}
