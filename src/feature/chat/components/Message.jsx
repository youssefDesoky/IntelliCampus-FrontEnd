export default function Message({ sender, message, sendTime }) {    
    return (
        <div
            className={`flex items-start gap-3 p-2 rounded-md ${
                sender.isOwnMessage ? "w-full justify-end" : ""
            }`}
        >
            <img
                className={`w-12 h-12 rounded-full object-cover ${
                    sender.isOwnMessage ? "order-2" : ""
                }`}
                src={sender.avatar}
                alt={sender.name}
            />
            <div
                className={`max-w-[70%] ${
                    sender.isOwnMessage ? "flex flex-col items-end text-right order-1" : "ml-0.5"
                }`}
            >
                <div className={`flex gap-4 ${sender.isOwnMessage ? "flex-row-reverse" : "justify-between"}`}>
                    <h4 className="font-semibold">{sender.name}</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{sendTime}</span>
                </div>

                <div className={`rounded-lg p-3 ${sender.isOwnMessage ? "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"}`}>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
}