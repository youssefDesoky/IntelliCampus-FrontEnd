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
        <PageHeader title="My Courses" subtitle="Your enrolled courses" headerDir={showTranscript ? "row" : "col"} className={showTranscript ? "items-center" : "sm:flex-row sm:items-center"}>
            {showTranscript ? (
                <Button
                    variant="primary"
                    size="sm"
                    startIcon={<FileLinesIcon className="w-4 h-4" />}
                    onClick={() => setShowTranscript(false)}
                    className="rounded-full shadow-sm hover:shadow-md transition-shadow"
                >
                    Back
                </Button>
            ) : (
                <div className="flex flex-wrap items-center gap-2 justify-between sm:gap-3 w-full sm:w-auto">
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
                            { value: "mandatory", label: "Mandatory" },
                            { value: "elective", label: "Elective" },
                        ]}
                        selectedValues={filterType}
                        onChange={setFilterType}
                    />

                    <Button
                        variant="primary"
                        size="sm"
                        startIcon={<FileLinesIcon className="w-4 h-4" />}
                        onClick={() => setShowTranscript(true)}
                        className="rounded-full shadow-sm hover:shadow-md transition-shadow"
                    >
                        Transcript
                    </Button>

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
                </div>
            )}
        </PageHeader>
    );
}