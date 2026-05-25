import ChatUsersHeader from "./ChatUsersHeader";
import ChatUsersSection from "./ChatUsersSection";

export default function ChatUsers({ chatPartner }) {
  const usersWithTypes = chatPartner
    ? {
        [chatPartner.role === "Instructor" ? "Instructors" : "Students"]: [
          {
            id: chatPartner.userId,
            name: chatPartner.fullName,
            avatar: null,
            status: "online",
          },
        ],
      }
    : {};

  return (
    <div className="col-span-1 border-r border-gray-300 dark:border-gray-700 pr-4 flex flex-col min-h-0">
      <ChatUsersHeader />
      <div className="flex flex-col gap-4 overflow-y-auto min-h-0 no-scrollbar">
        {Object.entries(usersWithTypes).map(([type, users]) => (
          <ChatUsersSection key={type} type={type} users={users} />
        ))}
      </div>
    </div>
  );
}
