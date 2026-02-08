import ScheduleLegend from "./schedule/ScheduleLegend";
import WeeklyScheduleHeader from "./schedule/WeeklyScheduleHeader";
import WeeklyScheduleDayRow from "./schedule/WeeklyScheduleDayRow";

const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
];

const mobileTimeSlots = [
    "8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"
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


export default function WeeklySchedule({ schedule = [], isMobile = true, isPhone }) {
    
    return (
        <div className="w-full overflow-x-auto rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-sm shadow-shadow-light dark:shadow-shadow-dark">
            <div className="overflow-hidden">
                {/* Header Row */}
                <WeeklyScheduleHeader 
                    isPhone={isPhone} 
                    slots={isMobile ? mobileTimeSlots : timeSlots} 
                />
                
                {/* Day Rows */}
                <WeeklyScheduleDayRow
                    days={days}
                    isPhone={isPhone}
                    schedule={schedule}
                    slots={isMobile ? mobileTimeSlots : timeSlots}
                />
            </div>

            {/* Legend */}
            <ScheduleLegend legendItems={[
                { color: "bg-bg-fill-info-default-light dark:bg-bg-fill-info-default-dark", label: "Lecture" },
                { color: "bg-bg-fill-purple-default-light dark:bg-bg-fill-purple-default-dark", label: "Section" }
            ]} />
        </div>
    );
}