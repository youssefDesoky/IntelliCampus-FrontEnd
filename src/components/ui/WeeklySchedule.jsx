import ScheduleLegend from "./schedule/ScheduleLegend";
import WeeklyScheduleHeader from "./schedule/WeeklyScheduleHeader";
import WeeklyScheduleDayRow from "./schedule/WeeklyScheduleDayRow";

const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
];

const mobileTimeSlots = [
    "8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"
];

const days = [
    { key: "sat", label: "Saturday", short: "Sat" },
    { key: "sun", label: "Sunday", short: "Sun" },
    { key: "mon", label: "Monday", short: "Mon" },
    { key: "tue", label: "Tuesday", short: "Tue" },
    { key: "wed", label: "Wednesday", short: "Wed" },
    { key: "thu", label: "Thursday", short: "Thu" },
    // { key: "fri", label: "Friday", short: "Fri" },
];

function parseHour(timeStr) {
    const [hourStr, period] = timeStr.split(" ");
    const [h, m] = hourStr.split(":");
    let hour = parseInt(h);
    const minutes = parseInt(m) || 0;
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour + minutes / 60;
}

function buildExamGrid(schedule) {
    const slotMap = new Map();
    const daySet = new Set();

    schedule.forEach(ev => {
        const key = `${ev.startTime} - ${ev.endTime}`;
        if (!slotMap.has(key)) {
            slotMap.set(key, { startTime: ev.startTime, endTime: ev.endTime, label: key });
        }
        daySet.add(ev.day);
    });

    const sortedSlots = [...slotMap.values()].sort(
        (a, b) => parseHour(a.startTime) - parseHour(b.startTime)
    );

    const sortedDays = days.filter(d => daySet.has(d.key));

    const grid = {};
    sortedSlots.forEach(slot => { grid[slot.label] = {}; });
    schedule.forEach(ev => {
        const key = `${ev.startTime} - ${ev.endTime}`;
        if (!grid[key][ev.day]) grid[key][ev.day] = [];
        grid[key][ev.day].push(ev);
    });

    return { sortedSlots, sortedDays, grid };
}

function ExamScheduleView({ schedule }) {
    const { sortedSlots, sortedDays, grid } = buildExamGrid(schedule);

    if (sortedSlots.length === 0) return null;

    return (
        <div className="overflow-x-auto">
            <div className="min-w-190 overflow-hidden">
                <div
                    className="grid border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light/95 dark:bg-bg-surface-secondary-default-dark/95"
                    style={{ gridTemplateColumns: `120px repeat(${sortedDays.length}, 1fr)` }}
                >
                    <div className="p-2.5 md:p-3 text-center text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary-default-light dark:text-text-secondary-default-dark border-r border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                        Time
                    </div>
                    {sortedDays.map(day => (
                        <div key={day.key} className="p-2.5 md:p-3 text-center text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary-default-light dark:text-text-secondary-default-dark border-r last:border-r-0 border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                            {day.label}
                        </div>
                    ))}
                </div>

                {sortedSlots.map((slot, rowIndex) => (
                    <div
                        key={slot.label}
                        className={`grid min-h-20 ${rowIndex < sortedSlots.length - 1 ? "border-b border-border-primary-default-light dark:border-border-primary-default-dark" : ""}`}
                        style={{ gridTemplateColumns: `120px repeat(${sortedDays.length}, 1fr)` }}
                    >
                        <div className="p-3 flex items-center justify-center border-r border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                            <span className="text-xs md:text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark whitespace-nowrap">
                                {slot.label}
                            </span>
                        </div>
                        {sortedDays.map(day => {
                            const events = grid[slot.label]?.[day.key] || [];
                            return (
                                <div key={day.key} className="p-2 min-h-20 flex flex-col gap-1.5 border-r last:border-r-0 border-border-primary-default-light dark:border-border-primary-default-dark">
                                    {events.length > 0 ? events.map(ev => (
                                        <div
                                            key={ev.id}
                                            className="rounded-lg border-l-4 border-border-blue-default-light dark:border-border-blue-default-dark bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark px-2.5 py-1.5 text-xs md:text-sm font-medium text-text-blue-default-light dark:text-text-blue-default-dark"
                                        >
                                            {ev.title}
                                        </div>
                                    )) : (
                                        <div className="flex-1 flex items-center justify-center text-text-tertiary-default-light dark:text-text-tertiary-default-dark text-xs">
                                            —
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function WeeklySchedule({ schedule = [], isMobile, variant }) {
    const activeDays = new Set(schedule.map((item) => item.day)).size;
    const slots = isMobile ? mobileTimeSlots : timeSlots;

    return (
        <div className="w-full overflow-hidden rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-sm shadow-shadow-light dark:shadow-shadow-dark">
            <div className="border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-linear-to-r from-bg-surface-secondary-default-light via-bg-surface-primary-default-light to-bg-surface-secondary-default-light dark:from-bg-surface-secondary-default-dark dark:via-bg-surface-primary-default-dark dark:to-bg-surface-secondary-default-dark px-4 py-4 md:px-6 md:py-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                            {variant === "exam" ? "Exam timetable" : "Weekly timeline"}
                        </p>
                        <h2 className="text-xl md:text-2xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark">
                            {variant === "exam" ? "Exam schedule" : "Your class plan for the week"}
                        </h2>
                        <p className="text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark">
                            {schedule.length} scheduled item{schedule.length === 1 ? "" : "s"} across {activeDays || 0} active day{activeDays === 1 ? "" : "s"}
                        </p>
                    </div>

                    {variant !== "exam" && (
                        <div className="flex flex-wrap gap-2 text-xs font-medium text-text-secondary-active-light dark:text-text-secondary-active-dark">
                            <span className="rounded-full border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light/80 dark:bg-bg-surface-primary-default-dark/80 px-3 py-1.5">
                                Drag-free view
                            </span>
                            <span className="rounded-full border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light/80 dark:bg-bg-surface-primary-default-dark/80 px-3 py-1.5">
                                Tap an event for details
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {variant === "exam" ? (
                <ExamScheduleView schedule={schedule} />
            ) : (
                <div className="overflow-x-auto">
                    <div className="min-w-190 overflow-hidden">
                        <WeeklyScheduleHeader
                            isMobile={isMobile}
                            slots={slots}
                        />

                        <WeeklyScheduleDayRow
                            days={days}
                            isMobile={isMobile}
                            schedule={schedule}
                            slots={slots}
                        />
                    </div>
                </div>
            )}

            {/* Legend */}
            {variant !== "exam" && (
                <ScheduleLegend legendItems={[
                    { color: "bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark", label: "Lecture" },
                    { color: "bg-bg-surface-purple-default-light dark:bg-bg-surface-purple-default-dark", label: "Section" },
                    { color: "bg-bg-surface-green-default-light dark:bg-bg-surface-green-default-dark", label: "Activity" }
                ]} />
            )}
        </div>
    );
}