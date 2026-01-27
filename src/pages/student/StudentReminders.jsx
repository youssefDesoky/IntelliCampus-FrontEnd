import MainReminders from "../../components/student/reminders/remindersBody/MainReminders";
import RemindersHeader from "../../components/student/reminders/remindersHeader/RemindersHeader";

export default function StudentReminders({studentReminders}) {
    return (
        <>
            <RemindersHeader />
            
            <MainReminders studentReminders={studentReminders} />
        </>
    );
}