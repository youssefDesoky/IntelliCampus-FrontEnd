import { ArrowRightIcon, FilterIcon, PlusIcon } from "../../../ui/icons";
import PageHeader from "../../../ui/PageHeader";
import ToggleViewMode from "../../../ui/ToggleViewMode";
import Section from "../../../ui/Section";
import Button from "../../../ui/Button";

export default function ScheduleHeader({ currSchedule, setCurrSchedule, isPhone }) {
    const handleToggle = (state) => {
            setCurrSchedule(state);
            localStorage.setItem("studentCurrSchedule", state);
    }
    
    return (
        <Section>
            <PageHeader
                title="My Schedule"
                subtitle="Manage your classes and exams"
                >
            </PageHeader>

            <div className="flex justify-between">
                <div className={`flex ${isPhone ? "gap-2" : "gap-4"} justify-between`}>
                    <ToggleViewMode
                        isFirstMode={currSchedule === "weekly"}
                        onFirstModeSelect={() => handleToggle("weekly")}
                        onSecondModeSelect={() => handleToggle("exam")}
                        firstModeLabel="Weekly Schedule"
                        secondModeLabel="Exam Schedule"
                    />

                    <div className="h-full w-1.5 bg-border-primary-default-light dark:bg-border-primary-default-dark" />

                    <button className="flex justify-between gap-2 items-center">
                        <FilterIcon className="w-5 h-5" />
                        Filter
                    </button>
                </div>

                <div className="flex gap-2 justify-between">
                    <Button
                        buttonType="secondary"
                    >
                        <ArrowRightIcon className="w-5 h-5" />
                        {isPhone ? null : "Export Schedule"}
                    </Button>

                    <Button>
                        <PlusIcon className="w-5 h-5" />
                        {isPhone ? null : "Add Event"}
                    </Button>
                </div>
            </div>
        </Section>
    );
}