import { LocationDotIcon, UserTieIcon } from "../icons";
import WeeklyScheduleEvents from "./WeeklyScheduleEvents";

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

export default function WeeklyScheduleDayRow({ isPhone, slots, days = [], schedule = [] }) {
    const totalSlots = slots.length;

    return (
        <>
            {days.map((day, dayIndex) => (
                <div 
                    key={day.key} 
                    className={`
                        grid min-h-17.5 hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark transition-colors
                        ${ dayIndex < days.length - 1 ? "border-b border-border-primary-default-light dark:border-border-primary-default-dark" : "" } 
                    `}
                    style={{ gridTemplateColumns: `${isPhone ? "50px" : "100px"} repeat(${totalSlots}, 1fr)` }}
                >
                    {/* Day Label */}
                    <div className="p-3 flex items-center justify-center font-medium text-text-primary-default-light dark:text-text-primary-default-dark border-r border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                        <span className="hidden lg:inline">{day.label}</span>
                        <span className="lg:hidden">{day.short}</span>
                    </div>

                    {/* Time Slots Container */}
                    <div 
                        className="relative"
                        style={{ gridColumn: `span ${totalSlots}` }}
                    >
                        {/* Grid lines - positioned absolutely for accurate alignment */}
                        {slots.map((time, index) => {
                            const timeIndex = getTimeIndex(time);
                            const leftPercent = (timeIndex / 12) * 100;
                            return (
                                <div
                                    key={index}
                                    className="absolute top-0 bottom-0 w-px bg-border-primary-default-light dark:bg-border-primary-default-dark"
                                    style={{ left: `${leftPercent}%` }}
                                />
                            );
                        })}

                        {/* Events */}
                        <WeeklyScheduleEvents days={days} day={day} schedule={schedule} />
                    </div>
                </div>
            ))}
        </>
    );
}