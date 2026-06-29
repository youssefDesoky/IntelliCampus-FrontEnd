import PageHeader from "../../../../components/ui/PageHeader";
import ToggleViewMode from "../../../../components/ui/ToggleViewMode";
import FilterDropdown from "../../../../components/ui/FilterDropdown";
import SearchBar from "../../../../components/ui/SearchBar";
import { Grid2ColIcon, ListIcon } from "../../../../components/ui/icons";

export default function MyCoursesHeader({
    isMobile,
    viewMode,
    setViewMode,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    hasCourses,
}) {

    return (
        <PageHeader title="My Courses" subtitle="Your enrolled courses" headerDir="col" className="sm:flex-row sm:items-center">
            {hasCourses && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <SearchBar
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-44 md:w-52"
                />
                <FilterDropdown
                    label="Status"
                    className="flex-1 sm:flex-none sm:w-auto"
                    dropdownAlign="left"
                    options={[
                        { value: "in-progress", label: "Active" },
                        { value: "completed", label: "Completed" },
                    ]}
                    selectedValues={filterStatus}
                    onChange={setFilterStatus}
                />
                <FilterDropdown
                    label="Type"
                    className="flex-1 sm:flex-none sm:w-auto"
                    dropdownAlign="right"
                    options={[
                        { value: "mandatory", label: "Mandatory" },
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
            </div>
            )}
        </PageHeader>
    );
}