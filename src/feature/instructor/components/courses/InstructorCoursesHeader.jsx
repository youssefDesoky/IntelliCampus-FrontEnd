import PageHeader from "../../../../components/ui/PageHeader";
import ToggleViewMode from "../../../../components/ui/ToggleViewMode";
import SearchBar from "../../../../components/ui/SearchBar";
import { Grid2ColIcon, ListIcon } from "../../../../components/ui/icons";

export default function InstructorCoursesHeader({isMobile, viewMode, setViewMode, searchQuery, setSearchQuery, hasCourses}) {
    return (
        <PageHeader title="My Courses" subtitle="Spring 2025 Semester" headerDir="col" className="sm:flex-row sm:items-center">
            {hasCourses && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <SearchBar
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-44 md:w-52"
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
            </div>
            )}
        </PageHeader>
    );
}
