import PageHeader from "../../../../components/ui/PageHeader";
import ToggleViewMode from "../../../../components/ui/ToggleViewMode";
import Button from "../../../../components/ui/Button";
import FilterDropdown from "../../../../components/ui/FilterDropdown";
import { Grid2ColIcon, ListIcon, FileLinesIcon } from "../../../../components/ui/icons";

export default function MyCoursesHeader({
    isMobile,
    viewMode,
    setViewMode,
    showTranscript,
    setShowTranscript,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
}) {
    return (
        <PageHeader title="My Courses" subtitle="Spring 2025 Semester">
            {showTranscript ? (
                <Button
                    variant="primary"
                    size="sm"
                    startIcon={<FileLinesIcon className="w-4 h-4" />}
                    onClick={() => setShowTranscript(false)}
                    className="rounded-full shadow-sm hover:shadow-md transition-shadow"
                >
                    <span className="sm:hidden">Back</span>
                    <span className="hidden sm:inline">Back to Courses</span>
                </Button>
            ) : (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <FilterDropdown
                        label="Status"
                        options={[
                            { value: "in-progress", label: "Active" },
                            { value: "completed", label: "Completed" },
                        ]}
                        selectedValues={filterStatus}
                        onChange={setFilterStatus}
                    />
                    <FilterDropdown
                        label="Type"
                        options={[
                            { value: "core", label: "Core" },
                            { value: "elective", label: "Elective" },
                        ]}
                        selectedValues={filterType}
                        onChange={setFilterType}
                    />

                    {!isMobile && (
                        <>
                            <ToggleViewMode
                                isVertical={false}
                                isFirstMode={viewMode === "grid"}
                                onFirstModeSelect={() => setViewMode("grid")}
                                onSecondModeSelect={() => setViewMode("list")}
                                firstModeLabel={<Grid2ColIcon className="w-5 h-5" />}
                                secondModeLabel={<ListIcon className="w-5 h-5" />}
                            />
                            <div className="h-6 w-px bg-border-primary-default-light dark:bg-border-primary-default-dark" />
                        </>
                    )}

                    <Button
                        variant="primary"
                        size="sm"
                        startIcon={<FileLinesIcon className="w-4 h-4" />}
                        onClick={() => setShowTranscript(true)}
                        className="rounded-full shadow-sm hover:shadow-md transition-shadow"
                    >
                        <span className="sm:hidden">Transcript</span>
                        <span className="hidden sm:inline">View Transcript</span>
                    </Button>
                </div>
            )}
        </PageHeader>
    );
}
