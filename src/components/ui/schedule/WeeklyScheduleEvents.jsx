import WeeklyScheduleEvent from "./WeeklyScheduleEvent";

export default function WeeklyScheduleEvents ({ days, day, schedule }) {
    const eventsByDay = days.reduce((acc, day) => {
        acc[day.key] = schedule.filter(event => event.day === day.key);
        return acc;
    }, {});
    
    return (
        <div className="relative h-full min-h-17.5 p-1">
            {eventsByDay[day.key]?.map((event, eventIndex) => (
                <WeeklyScheduleEvent key={event.id || eventIndex} event={event} />
            ))}

            {/* Empty state for day */}
            {(!eventsByDay[day.key] || eventsByDay[day.key].length === 0) && (
                <div className="absolute inset-0 flex items-center justify-center text-text-tertiary-default-light dark:text-text-tertiary-default-dark text-sm">
                    No classes scheduled
                </div>
            )}
        </div>
    );
}