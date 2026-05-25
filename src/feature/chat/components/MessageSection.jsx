import Message from "./Message";

export default function MessageSection({ date, messages }) {
    const toIsoDate = (d) => d.toISOString().slice(0, 10);
    const formatDisplayDate = (isoDate) => {
        const parsed = new Date(`${isoDate}T00:00:00`);

        if (Number.isNaN(parsed.getTime())) {
            return isoDate;
        }

        return parsed.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const todayIso = toIsoDate(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayIso = toIsoDate(yesterday);

    const isToday = date === todayIso;
    const isYesterday = date === yesterdayIso;

    return (
        <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-3">
                <span className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
                <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">
                    {isToday && 'Today'}
                    {isYesterday && 'Yesterday'}
                    {!isToday && !isYesterday && formatDisplayDate(date)}
                </h3>
                <span className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
            </div>

            {messages.map((msg) => (
                <Message key={msg.id} sender={msg.sender} message={msg.message} sendTime={msg.sendTime} />
            ))}
        </div>
    );
}