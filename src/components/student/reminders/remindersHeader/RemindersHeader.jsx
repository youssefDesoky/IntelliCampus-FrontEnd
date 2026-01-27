import PageHeader from "../../../../ui/PageHeader";
import Button from "../../../../ui/Button";
import { PlusIcon } from "../../../../ui/icons"

export default function RemindersHeader() {
    return (
        <PageHeader
            title="Reminders"
            subtitle="Stay on top of your tasks and deadlines with ease."
        >
            <Button>
                <PlusIcon className="h-5 w-5" />
                Add Reminder
            </Button>
        </PageHeader>
    );
}