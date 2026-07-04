import MessageSection from "./MessageSection";
import PinnedMessage from "./PinnedMessage";
import ChatControls from "./ChatControls";
import ChatPartnerHeader from "./ChatPartnerHeader";
import GroupMembersPanel from "./GroupMembersPanel";
import { useRef, useEffect, useState } from "react";
import TypingIndicator from "./TypingIndicator";

export default function Messaging({ messages, sendMessage, onInputChange, partnerTyping, chatPartner, deleteMessage, editMessage, pinMessage, unpinMessage, pinnedMessage, showSenderInfo, searchQuery, onSearchChange, isPhone, onBack, onAttachFile, onDeleteFriend, onLeaveGroup, groupMembers, groupDetails, onAddGroupMember, currentUser }) {
  const bottomRef = useRef(null);
  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partnerTyping]);

  if (!chatPartner) return null;

  const isEmpty = Object.keys(messages).length === 0;

  return (
    <div className={`${isPhone ? '' : 'col-span-2'} flex flex-col h-full min-h-0 gap-0`}>
      <ChatPartnerHeader chatPartner={chatPartner} partnerTyping={partnerTyping} searchQuery={searchQuery} onSearchChange={onSearchChange} isPhone={isPhone} onBack={onBack} onDeleteFriend={onDeleteFriend} onLeaveGroup={onLeaveGroup} showMembers={showMembers} onShowMembers={() => setShowMembers((s) => !s)} />
      {pinnedMessage && <PinnedMessage message={pinnedMessage} />}

      {showMembers && groupMembers.length > 0 && (
        <GroupMembersPanel members={groupMembers} onClose={() => setShowMembers(false)} groupDetails={groupDetails} onAddGroupMember={onAddGroupMember} currentUser={currentUser} />
      )}

      {/* Messages area */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 no-scrollbar mt-2">
        {searchQuery && isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-8">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center text-2xl">
              🔍
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">No results found</p>
            <p className="text-xs text-[var(--text-tertiary)]">No messages match "{searchQuery}"</p>
          </div>
        ) : isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-8">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center text-2xl">
              💬
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">No messages yet</p>
            <p className="text-xs text-[var(--text-tertiary)]">Send a message to start the conversation</p>
          </div>
        ) : (
          Object.entries(messages).map(([date, msgs]) => (
            <MessageSection key={date} date={date} messages={msgs} showSenderInfo={showSenderInfo} deleteMessage={deleteMessage} editMessage={editMessage} pinMessage={pinMessage} unpinMessage={unpinMessage} />
          ))
        )}

        {/* Typing indicator */}
        {partnerTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <ChatControls sendMessage={sendMessage} onInputChange={onInputChange} onAttachFile={onAttachFile} />
    </div>
  );
}
