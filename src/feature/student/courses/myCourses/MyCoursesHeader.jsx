import SelectBox from "../../../../components/ui/SelectBox";
import PageHeader from "../../../../components/ui/PageHeader";
import ToggleViewMode from "../../../../components/ui/ToggleViewMode";
import Button from "../../../../components/ui/Button";
import { Grid2ColIcon, ListIcon, FileLinesIcon } from "../../../../components/ui/icons";

export default function MyCoursesHeader({isMobile, viewMode, setViewMode, showTranscript, setShowTranscript}) {
    return (
        <PageHeader title="My Courses" subtitle="Spring 2025 Semester">
            <div className="flex flex-row items-center gap-4 justify-between w-auto">
                {!showTranscript && (
                    <SelectBox
                        options={[
                            { value: "all", label: "All Courses" },
                            { value: "in-progress", label: "In Progress" },
                            { value: "completed", label: "Completed" },
                        ]}
                        selectedOption={"all"}
                    />
                )}

                {!showTranscript && !isMobile && <ToggleViewMode 
                    isVertical={false}
                    isFirstMode={viewMode === "grid"}
                    onFirstModeSelect={() => setViewMode("grid")}
                    onSecondModeSelect={() => setViewMode("list")}
                    firstModeLabel={<Grid2ColIcon className="w-5 h-5" />}
                    secondModeLabel={<ListIcon className="w-5 h-5" />}
                />}

                {!isMobile && <div className="h-6 w-px bg-border-primary-default-light dark:bg-border-primary-default-dark" />}

                <Button
                    variant={showTranscript ? "primary" : "secondary"}
                    size="sm"
                    startIcon={<FileLinesIcon className="w-4 h-4" />}
                    onClick={() => setShowTranscript(!showTranscript)}
                >
                    {showTranscript ? "Courses" : "Transcript"}
                </Button>
            </div>
        </PageHeader>
    );
}