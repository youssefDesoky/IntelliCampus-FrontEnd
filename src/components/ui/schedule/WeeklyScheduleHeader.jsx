export default function WeeklyScheduleHeader({ isPhone, slots }) {
    const totalSlots = slots.length;

    return (
        <div 
            className="grid border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark"
            style={{ gridTemplateColumns: `${isPhone ? "50px" : "100px"} repeat(${totalSlots}, 1fr)` }}
        >
            <div className="p-2 md:p-3 text-center font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark border-r border-border-primary-default-light dark:border-border-primary-default-dark">
                Day
            </div>
            {slots.map((time, index) => (
                <div 
                    key={time} 
                    className={`p-2 md:p-3 text-center text-sm font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark ${
                        index < totalSlots - 1 ? "border-r border-border-primary-default-light dark:border-border-primary-default-dark" : ""
                    }`}
                >
                    <span className="hidden sm:inline">{time}</span>
                    <span className="sm:hidden">{time.split(":")[0]}{time.includes("PM") ? "P" : "A"}</span>
                </div>
            ))}
        </div>
    );
}