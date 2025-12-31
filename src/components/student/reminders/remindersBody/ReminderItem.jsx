export default function ReminderItem({ item }) {
    // item: { title, dueTime, location, category, color, tag }
    const containerCls = `flex items-center justify-between p-4 rounded-lg border ${item.color || "bg-white border-gray-100"}`;

    return (
        <div className={containerCls}>
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${item.color?.replace("bg-", "bg-") || "bg-gray-100"}`}>
                    <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 7h18M3 12h18M3 17h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                    <div className="text-xs text-gray-500 mt-1">
                        {item.dueTime} {item.location ? " • " + item.location : null}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {item.tag && (
                    <span className="text-xs font-medium px-3 py-1 rounded-lg bg-white/70 border border-gray-100">
                        {item.tag}
                    </span>
                )}
                <button className="bg-white w-8 h-8 flex items-center justify-center rounded-md duration-150 hover:bg-gray-200 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4 text-gray-600">
                        <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}