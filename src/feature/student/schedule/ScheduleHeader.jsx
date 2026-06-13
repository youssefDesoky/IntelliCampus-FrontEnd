import Button from "../../../components/ui/Button";
import Section from "../../../components/ui/Section";
import PageHeader from "../../../components/ui/PageHeader";
import ToggleViewMode from "../../../components/ui/ToggleViewMode";
import { DownloadIcon } from "../../../components/ui/icons";
import FilterDropdown from "../../../components/ui/FilterDropdown";

const scheduleStorageKey = "studentCurrSchedule";

const typeFilterOptions = [
    { value: "lecture", label: "Lecture" },
    { value: "section", label: "Section" },
    { value: "activity", label: "Activity" },
];

export default function ScheduleHeader({ currSchedule, setCurrSchedule, isMobile, selectedTypes = [], onToggleType }) {
    const handleToggle = (state) => {
        setCurrSchedule(state);
        localStorage.setItem(scheduleStorageKey, state);
    }

    return (
        <Section className="space-y-4">
            <PageHeader
                title="My Schedule"
                subtitle="Manage your classes, labs, and exams in one place"
                >
            </PageHeader>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <ToggleViewMode
                        isFirstMode={currSchedule === "weekly"}
                        onFirstModeSelect={() => handleToggle("weekly")}
                        onSecondModeSelect={() => handleToggle("exam")}
                        firstModeLabel={`Weekly ${isMobile ? "" : "Schedule"}`}
                        secondModeLabel={`Exam ${isMobile ? "" : "Schedule"}`}
                    />

                    <div className="hidden h-8 w-px bg-border-primary-default-light dark:bg-border-primary-default-dark sm:block" />

                    <FilterDropdown
                        label={isMobile ? "Filter" : "Filter schedule"}
                        options={typeFilterOptions}
                        selectedValues={selectedTypes}
                        onChange={(values) => {
                            const added = values.filter((v) => !selectedTypes.includes(v));
                            const removed = selectedTypes.filter((v) => !values.includes(v));
                            added.forEach((v) => onToggleType?.(v));
                            removed.forEach((v) => onToggleType?.(v));
                        }}
                        disabled={currSchedule !== "weekly"}
                        headerLabel="Filter by type"
                    />
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark">
                    <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.24em] text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                            Active view
                        </p>
                        <p className="truncate text-sm font-semibold text-text-primary-active-light dark:text-text-primary-active-dark">
                            {currSchedule === "weekly" ? "Weekly schedule" : "Exam schedule"}
                        </p>
                    </div>

                    <Button variant="secondary" type="button">
                        <DownloadIcon size={18} />
                        {isMobile ? null : "Export"}
                    </Button>
                </div>
            </div>

        </Section>
    );
}