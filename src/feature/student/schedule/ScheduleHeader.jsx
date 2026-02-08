import Button from "../../../components/ui/Button";
import Section from "../../../components/ui/Section";
import PageHeader from "../../../components/ui/PageHeader";
import ToggleViewMode from "../../../components/ui/ToggleViewMode";
import { DownloadIcon, FilterIcon } from "../../../components/ui/icons";


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
                        firstModeLabel={`Weekly ${isPhone ? "" : "Schedule"}`}
                        secondModeLabel={`Exam ${isPhone ? "" : "Schedule"}`}
                    />

                    <div className="h-full w-1.5 bg-border-primary-default-light dark:bg-border-primary-default-dark" />

                    <button className="flex justify-between gap-2 items-center">
                        <FilterIcon size={20} />
                        Filter
                    </button>
                </div>

                <Button
                    buttonType="secondary"
                >
                    <DownloadIcon size={20} />
                    {isPhone ? null : "Export Schedule"}
                </Button>
            </div>
        </Section>
    );
}