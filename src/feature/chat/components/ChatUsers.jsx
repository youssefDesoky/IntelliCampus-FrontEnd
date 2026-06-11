import ChatUsersHeader from "./ChatUsersHeader";
import ChatUsersSection from "./ChatUsersSection";
import ChatUser from "./ChatUser";

export default function ChatUsers({ chatPartner, friends = [], groups = [], onlineUsers = new Set(), unreadCounts = {}, onAddFriend, onCreateGroup, onSelectUser, onSelectGroup, searchMembers, onSearchMembersChange }) {
  const q = searchMembers.toLowerCase().trim();

  const mapFriend = (f) => ({ id: f.userId, name: f.fullName, avatar: f.profileImage || null, status: onlineUsers.has(String(f.userId)) ? "online" : null, unread: unreadCounts[String(f.userId)] || 0 });
  const mapGroup = (g) => ({ id: g.groupId, name: g.title, avatar: g.profileImage || null, status: null, unread: 0 });

  const filterFn = (u) => !q || u.name.toLowerCase().includes(q);

  const instructors = friends.filter((f) => f.role === "Instructor").map(mapFriend).filter(filterFn);
  const students = friends.filter((f) => f.role === "Student").map(mapFriend).filter(filterFn);
  const groupList = groups.map(mapGroup).filter(filterFn);

  return (
    <div className="col-span-1 border-r border-white/8 pr-4 flex flex-col min-h-0">
      <ChatUsersHeader onAddFriend={onAddFriend} onCreateGroup={onCreateGroup} searchMembers={searchMembers} onSearchMembersChange={onSearchMembersChange} />
      <div className="flex flex-col gap-2 overflow-y-auto min-h-0 no-scrollbar pt-1">
        {groupList.length > 0 && (
          <ChatUsersSection type="Groups" users={groupList} onSelectUser={onSelectGroup} />
        )}
        {instructors.length > 0 && (
          <ChatUsersSection type="Instructors" users={instructors} onSelectUser={onSelectUser} />
        )}
        {students.length > 0 && (
          <ChatUsersSection type="Students" users={students} onSelectUser={onSelectUser} />
        )}
        {!instructors.length && !students.length && !groupList.length && (
          <div className="text-xs text-center text-gray-400 py-6">No members match "{searchMembers}"</div>
        )}
      </div>
    </div>
  );
}