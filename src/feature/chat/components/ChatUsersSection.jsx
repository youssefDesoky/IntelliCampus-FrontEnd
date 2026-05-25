import ChatUser from "./ChatUser";

export default function ChatUsersSection({ type, users }) {
    return (
        <div>
            <h3>{type}</h3>
            <div>
                {users.map((user) => (
                    <ChatUser key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
}