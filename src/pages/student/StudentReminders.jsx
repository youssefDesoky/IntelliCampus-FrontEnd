import MainReminders from "../../components/student/reminders/remindersBody/MainReminders";

export default function StudentReminders({studentReminders}) {
    return (
        <>
            <MainReminders studentReminders={studentReminders} />
        </>
    );
}