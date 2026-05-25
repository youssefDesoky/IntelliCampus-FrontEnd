import { useEffect, useRef, useState } from "react";
import Button from "../../../components/ui/Button";
import Section from "../../../components/ui/Section";
import PageHeader from "../../../components/ui/PageHeader";
import ToggleViewMode from "../../../components/ui/ToggleViewMode";
import { AngleDownIcon, DownloadIcon, FilterIcon } from "../../../components/ui/icons";

const scheduleStorageKey = "studentCurrSchedule";


const typeFilterOptions = [
    { value: "lecture", label: "Lecture" },
    { value: "section", label: "Section" },
    { value: "activity", label: "Activity" },
];

export default function ScheduleHeader({ currSchedule, setCurrSchedule, isMobile, selectedTypes = [], onToggleType, onClearTypes }) {
    const [showTypeFilters, setShowTypeFilters] = useState(false);
    const filterDropdownRef = useRef(null);

    const handleToggle = (state) => {
        setCurrSchedule(state);
        localStorage.setItem(scheduleStorageKey, state);
        if (state !== "weekly") {
            setShowTypeFilters(false);
        }
    }

    useEffect(() => {
        if (!showTypeFilters) return;

        const handleClickOutside = (event) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setShowTypeFilters(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowTypeFilters(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showTypeFilters]);

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

                    <div className="relative" ref={filterDropdownRef}>
                        <button
                            type="button"
                            onClick={() => setShowTypeFilters((prev) => !prev)}
                            disabled={currSchedule !== "weekly"}
                            aria-expanded={showTypeFilters}
                            aria-haspopup="menu"
                            className="inline-flex items-center justify-center gap-2 rounded-md border border-border-primary-default-light bg-bg-surface-primary-default-light px-4 py-2 text-sm font-medium text-text-secondary-active-light transition-colors hover:bg-bg-fill-primary-hover-light disabled:opacity-60 dark:border-border-primary-default-dark dark:bg-bg-surface-primary-default-dark dark:text-text-secondary-active-dark dark:hover:bg-bg-fill-primary-hover-dark"
                        >
                            <FilterIcon size={18} />
                            {isMobile ? "Filter" : "Filter schedule"}
                            {currSchedule === "weekly" && selectedTypes.length > 0 ? `(${selectedTypes.length})` : ""}
                            <AngleDownIcon size={18} className={`transition-transform ${showTypeFilters ? "rotate-180" : ""}`} />
                        </button>

                        {currSchedule === "weekly" && showTypeFilters && (
                            <div
                                role="menu"
                                className="absolute left-0 top-[calc(100%+8px)] z-20 w-64 rounded-xl border border-border-primary-default-light bg-bg-surface-primary-default-light p-3 shadow-lg dark:border-border-primary-default-dark dark:bg-bg-surface-primary-default-dark"
                            >
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                                    Filter by type
                                </p>

                                <div className="space-y-1">
                                    {typeFilterOptions.map((option) => {
                                        const isActive = selectedTypes.includes(option.value);

                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                role="menuitemcheckbox"
                                                aria-checked={isActive}
                                                onClick={() => onToggleType?.(option.value)}
                                                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                                                    isActive
                                                        ? "bg-bg-fill-accent-default-light text-text-accent-active-light dark:bg-bg-fill-accent-default-dark dark:text-text-accent-active-dark"
                                                        : "text-text-secondary-active-light hover:bg-bg-fill-primary-hover-light dark:text-text-secondary-active-dark dark:hover:bg-bg-fill-primary-hover-dark"
                                                }`}
                                            >
                                                <span>{option.label}</span>
                                                <span className="text-xs">{isActive ? "Selected" : ""}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-3 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => onClearTypes?.()}
                                        disabled={selectedTypes.length === 0}
                                        className="rounded-md border border-border-primary-default-light px-3 py-1.5 text-xs font-medium text-text-secondary-active-light transition-colors hover:bg-bg-fill-primary-hover-light disabled:opacity-50 dark:border-border-primary-default-dark dark:text-text-secondary-active-dark dark:hover:bg-bg-fill-primary-hover-dark"
                                    >
                                        Clear filters
                                    </button>
                                </div>

                                <p className="mt-2 text-[11px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                                    Select any types you want. Leave all unselected to show everything.
                                </p>
                            </div>
                        )}
                    </div>
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