import { UsersIcon } from "../../../components/ui/icons";

export default function ChatUser({ user }) {
    return (
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
            <div className="relative">
                <img 
                    className="w-12 h-12 rounded-full object-cover"
                    src={user.avatar}
                    alt={user.status ? user.name : "Group Avatar"} 
                />
                {user.status ? (
                    <span className="rounded-full w-4 h-4 bg-green-500 absolute bottom-0 right-0 border-2 border-white dark:border-gray-800" />
                ) : ( 
                    <UsersIcon className="w-4 h-4 text-gray-500 absolute bottom-0 right-0" />
                )}
            </div>
            <div className="ml-0.5 min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {user.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {user.status ? user.status : user.instructor}
                </p>
            </div>
        </div>
    );
}