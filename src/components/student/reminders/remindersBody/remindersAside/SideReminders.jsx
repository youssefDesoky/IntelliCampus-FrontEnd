import RemindersQuickSettings from "./RemindersQuickSettings";
import RemindersCategories from "./RemindersCategories";
import CalenderWidget from "../../../../../ui/CalendarWidget";

export default function SideReminders({className}) {
    const componentStyles = "bg-white rounded-lg p-4 shadow-sm";

    return (
        <aside className={`p-6 flex flex-col gap-6 ${className}`}>
            <RemindersQuickSettings styles={componentStyles} />
            <CalenderWidget />
            <RemindersCategories styles={componentStyles} />
        </aside>
    );
}