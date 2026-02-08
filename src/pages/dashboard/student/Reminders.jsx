import Categories from "../../../feature/student/reminders/Categories";
import RemindersHeader from "../../../feature/student/reminders/RemindersHeader";
import Timeline from "../../../feature/student/reminders/Timeline";
import CalenderWidget from "../../../components/ui/CalendarWidget"

export default function Reminders() {
    return (
        <>
            <RemindersHeader />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <Timeline className="lg:col-span-3"/>

                <div>
                    <CalenderWidget />
                    <Categories />
                </div>
            </div>
        </>
    );
}