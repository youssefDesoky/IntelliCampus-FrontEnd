import RemindersHeader from "./remindersHeader/RemindersHeader";
import MainReminders from "./remindersBody/MainReminders";
import CreateNewReminder from "./CreateNewReminder";
import Header from "../../../components/layout/Header";
import Section from "../../../components/ui/Section";

export default function Reminders({studentReminders}) {
    return (
        <>
            {/* <Header
                headerIcon={remindersIcon}
                headerTitle="Reminders"
                paragraphText="Stay on top of your academic schedule"
                buttons={[
                    { label: "Add Reminder", title: "Add Reminder", className: "inline-flex items-center gap-2 bg-blue-500 text-white text-md font-bold px-4 py-2 rounded-lg shadow-sm duration-300 hover:bg-blue-600 transition-colors cursor-pointer", text: <>{addIcon} Add Reminder</> }
                ]}
            /> */}
            <MainReminders studentReminders={studentReminders} />
        </>
    );
}