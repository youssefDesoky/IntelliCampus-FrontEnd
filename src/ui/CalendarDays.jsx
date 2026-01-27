export default function CalendarDays() {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="grid grid-cols-7 gap-2 mb-4">
            {days.map(day => (
                <div
                    key={day}
                    className="text-center text-sm font-medium text-secondary-text-light dark:text-secondary-text-dark"
                >
                    {day}
                </div>
            ))}
        </div>
    );
}
