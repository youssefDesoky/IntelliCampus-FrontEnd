import RemindersQuickSettings from "./RemindersQuickSettings";
import RemindersCategories from "./RemindersCategories";

export default function SideReminders() {
    const componentStyles = "bg-white rounded-lg p-4 shadow-sm";

    return (
        <aside className="w-80 p-6 flex flex-col gap-12">
            <RemindersQuickSettings styles={componentStyles} />
            <RemindersCategories styles={componentStyles} />
        </aside>
    );
}