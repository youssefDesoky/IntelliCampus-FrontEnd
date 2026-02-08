import { PlusIcon } from "../../../components/ui/icons";
import PageHeader from "../../../components/ui/PageHeader";
import Button from "../../../components/ui/Button";

export default function RemindersHeader() {
    return (
        <PageHeader 
            title="Reminders" 
            subtitle="Manage your study reminders and stay on track with your academic goals." 
        >
            <Button
                variant="primary"
            >
                <PlusIcon size={16}/>
                Add Reminder
            </Button>
        </PageHeader>
    );
}