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


export default function WeeklySchedule({ schedule = [], isMobile }) {
    const activeDays = new Set(schedule.map((item) => item.day)).size;
    const slots = isMobile ? mobileTimeSlots : timeSlots;

    return (
        <div className="w-full overflow-hidden rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-sm shadow-shadow-light dark:shadow-shadow-dark">
            <div className="border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-linear-to-r from-bg-surface-secondary-default-light via-bg-surface-primary-default-light to-bg-surface-secondary-default-light dark:from-bg-surface-secondary-default-dark dark:via-bg-surface-primary-default-dark dark:to-bg-surface-secondary-default-dark px-4 py-4 md:px-6 md:py-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                            Weekly timeline
                        </p>
                        <h2 className="text-xl md:text-2xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark">
                            Your class plan for the week
                        </h2>
                        <p className="text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark">
                            {schedule.length} scheduled items across {activeDays || 0} active day{activeDays === 1 ? "" : "s"}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-medium text-text-secondary-active-light dark:text-text-secondary-active-dark">
                        <span className="rounded-full border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light/80 dark:bg-bg-surface-primary-default-dark/80 px-3 py-1.5">
                            Drag-free view
                        </span>
                        <span className="rounded-full border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light/80 dark:bg-bg-surface-primary-default-dark/80 px-3 py-1.5">
                            Tap an event for details
                        </span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-190 overflow-hidden">
                    {/* Header Row */}
                    <WeeklyScheduleHeader
                        isMobile={isMobile}
                        slots={slots}
                    />

                    {/* Day Rows */}
                    <WeeklyScheduleDayRow
                        days={days}
                        isMobile={isMobile}
                        schedule={schedule}
                        slots={slots}
                    />
                </div>
            </div>

            {/* Legend */}
            <ScheduleLegend legendItems={[
                { color: "bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark", label: "Lecture" },
                { color: "bg-bg-surface-purple-default-light dark:bg-bg-surface-purple-default-dark", label: "Section" },
                { color: "bg-bg-surface-green-default-light dark:bg-bg-surface-green-default-dark", label: "Activity" }
            ]} />
        </div>
    );
}