import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays
} from "date-fns";

export default function CalendarCells({ currentMonth, selectedDate, setSelectedDate }) {
    const today = new Date();

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    let day = startDate;
    const rows = [];

    while (day <= endDate) {
        const days = [];

        for (let i = 0; i < 7; i++) {
            const cloneDay = day;
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, today);
            const isCurrentMonth = isSameMonth(day, monthStart);

            days.push(
                <div
                    key={day}
                    onClick={() => setSelectedDate(cloneDay)}
                    className={`
                        h-10 w-10 flex items-center justify-center rounded-md text-sm cursor-pointer transition
                        ${!isCurrentMonth ? "text-muted-text-light dark:text-muted-text-dark pointer-events-none" : ""}
                        ${isSelected ? "shadow-lg bg-accent-light dark:bg-accent-dark text-white" : ""}
                        ${!isSelected && isToday ? "text-accent-light dark:text-accent-dark font-extrabold" : ""}
                        ${!isSelected && isCurrentMonth && !isToday
                            ? "text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                            : ""}
                    `}
                >
                    {format(day, "d")}
                </div>
            );

            day = addDays(day, 1);
        }

        rows.push(<div className="grid grid-cols-7 gap-2 mb-2" key={day}>{days}</div>);
    }

    return <div>{rows}</div>;
}
