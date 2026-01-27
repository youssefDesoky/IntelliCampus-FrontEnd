const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
];

const days = [
    { key: "sat", label: "Saturday", short: "Sat" },
    { key: "sun", label: "Sunday", short: "Sun" },
    { key: "mon", label: "Monday", short: "Mon" },
    { key: "tue", label: "Tuesday", short: "Tue" },
    { key: "wed", label: "Wednesday", short: "Wed" },
    { key: "thu", label: "Thursday", short: "Thu" },
    { key: "fri", label: "Friday", short: "Fri" },
];

const eventColors = {
    lecture: "bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600 text-blue-800 dark:text-blue-200",
    lab: "bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-600 text-green-800 dark:text-green-200",
    section: "bg-purple-100 dark:bg-purple-900/40 border-purple-400 dark:border-purple-600 text-purple-800 dark:text-purple-200",
    exam: "bg-red-100 dark:bg-red-900/40 border-red-400 dark:border-red-600 text-red-800 dark:text-red-200",
    office: "bg-amber-100 dark:bg-amber-900/40 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-200",
    default: "bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200",
};

// Helper function to convert time string to hour index (0-11 for 8AM-7PM)
// Supports minutes: "2:30 PM" returns 6.5, "9:15 AM" returns 1.25
const getTimeIndex = (time) => {
    const [hourStr, period] = time.split(" ");
    const [hourPart, minutePart] = hourStr.split(":");
    let hour = parseInt(hourPart);
    const minutes = parseInt(minutePart) || 0;
    
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    
    // Convert minutes to decimal (30 min = 0.5, 15 min = 0.25, etc.)
    const minuteDecimal = minutes / 60;
    
    return (hour - 8) + minuteDecimal; // 8 AM is index 0
};

// Calculate column span based on duration
const getColSpan = (startTime, endTime) => {
    const startIndex = getTimeIndex(startTime);
    const endIndex = getTimeIndex(endTime);
    return endIndex - startIndex;
};

export default function WeeklySchedule({ schedule = [], onEventClick }) {
    // Group events by day
    const eventsByDay = days.reduce((acc, day) => {
        acc[day.key] = schedule.filter(event => event.day === day.key);
        return acc;
    }, {});

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            <div className="min-w-225">
                {/* Header Row */}
                <div className="grid grid-cols-[100px_repeat(12,1fr)] border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="p-3 text-center font-semibold text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                        Day
                    </div>
                    {timeSlots.map((time, index) => (
                        <div 
                            key={time} 
                            className={`p-3 text-center text-sm font-medium text-gray-600 dark:text-gray-300 ${
                                index < timeSlots.length - 1 ? "border-r border-gray-100 dark:border-gray-700/50" : ""
                            }`}
                        >
                            <span className="hidden sm:inline">{time}</span>
                            <span className="sm:hidden">{time.split(":")[0]}{time.includes("PM") ? "P" : "A"}</span>
                        </div>
                    ))}
                </div>

                {/* Day Rows */}
                {days.map((day, dayIndex) => (
                    <div 
                        key={day.key} 
                        className={`grid grid-cols-[100px_repeat(12,1fr)] min-h-17.5 ${
                            dayIndex < days.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""
                        } hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors`}
                    >
                        {/* Day Label */}
                        <div className="p-3 flex items-center justify-center font-medium text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                            <span className="hidden lg:inline">{day.label}</span>
                            <span className="lg:hidden">{day.short}</span>
                        </div>

                        {/* Time Slots Container */}
                        <div className="col-span-12 relative">
                            {/* Grid lines */}
                            <div className="absolute inset-0 grid grid-cols-12">
                                {timeSlots.map((_, index) => (
                                    <div 
                                        key={index} 
                                        className={`${index < timeSlots.length - 1 ? "border-r border-gray-100 dark:border-gray-700/30" : ""}`}
                                    />
                                ))}
                            </div>

                            {/* Events */}
                            <div className="relative h-full min-h-17.5 p-1">
                                {eventsByDay[day.key]?.map((event, eventIndex) => {
                                    const startIndex = getTimeIndex(event.startTime);
                                    const colSpan = getColSpan(event.startTime, event.endTime);
                                    const leftPercent = (startIndex / 12) * 100;
                                    const widthPercent = (colSpan / 12) * 100;
                                    const colorClass = eventColors[event.type] || eventColors.default;

                                    return (
                                        <div
                                            key={event.id || eventIndex}
                                            className={`absolute top-1 bottom-1 rounded-lg border-l-4 p-2 cursor-pointer 
                                                transition-all hover:shadow-md hover:scale-[1.02] ${colorClass}`}
                                            style={{
                                                left: `${leftPercent}%`,
                                                width: `calc(${widthPercent}% - 4px)`,
                                            }}
                                            onClick={() => onEventClick?.(event)}
                                            title={`${event.title} - ${event.startTime} to ${event.endTime}`}
                                        >
                                            <div className="flex flex-col h-full overflow-hidden">
                                                <h4 className="font-semibold text-sm truncate">{event.title}</h4>
                                                {event.location && (
                                                    <p className="text-xs opacity-75 truncate mt-0.5">
                                                        📍 {event.location}
                                                    </p>
                                                )}
                                                {event.instructor && (
                                                    <p className="text-xs opacity-75 truncate">
                                                        👤 {event.instructor}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Empty state for day */}
                                {(!eventsByDay[day.key] || eventsByDay[day.key].length === 0) && (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
                                        No classes scheduled
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Legend:</span>
                <div className="flex flex-wrap gap-3">
                    <LegendItem color="bg-blue-400" label="Lecture" />
                    <LegendItem color="bg-purple-400" label="Section" />
                </div>
            </div>
        </div>
    );
}

function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
        </div>
    );
}