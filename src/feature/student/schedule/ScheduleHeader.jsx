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

export default function ScheduleHeader({ currSchedule, setCurrSchedule, isMobile, selectedTypes = [], onToggleType, onExport, hideToggle = false }) {
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

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-row items-center gap-3 w-full lg:w-auto">
                    {!hideToggle && (
                        <>
                            <div className="flex-1 lg:flex-none">
                                <ToggleViewMode
                                    isFirstMode={currSchedule === "weekly"}
                                    onFirstModeSelect={() => handleToggle("weekly")}
                                    onSecondModeSelect={() => handleToggle("exam")}
                                    firstModeLabel={`Weekly ${isMobile ? "" : "Schedule"}`}
                                    secondModeLabel={`Exam ${isMobile ? "" : "Schedule"}`}
                                    className="w-full lg:w-fit"
                                />
                            </div>

                            <div className="h-8 w-px bg-border-primary-default-light dark:bg-border-primary-default-dark shrink-0" />
                        </>
                    )}

                    <div className="flex-1 lg:flex-none">
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

                    <Button variant="secondary" type="button" onClick={onExport} className="shrink-0 lg:hidden">
                        <DownloadIcon size={18} />
                    </Button>
                </div>

                <div className="hidden lg:flex items-center justify-between gap-3 rounded-xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 w-full lg:w-auto dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark">
                    <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.24em] text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                            Active view
                        </p>
                        <p className="truncate text-sm font-semibold text-text-primary-active-light dark:text-text-primary-active-dark">
                            {currSchedule === "weekly" ? "Weekly schedule" : "Exam schedule"}
                        </p>
                    </div>

                    <Button variant="secondary" type="button" onClick={onExport}>
                        <DownloadIcon size={18} />
                        Export
                    </Button>
                </div>
            </div>

        </Section>
    );
}