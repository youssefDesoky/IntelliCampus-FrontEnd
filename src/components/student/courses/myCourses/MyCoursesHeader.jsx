import SelectBox from "../../../../ui/SelectBox";
import PageHeader from "../../../../ui/PageHeader";
import ToggleViewMode from "../../../../ui/ToggleViewMode";

import { Grid2ColIcon, ListIcon } from "../../../../ui/icons";

export default function MyCoursesHeader({isMobile, viewMode, setViewMode}) {
    return (
        <PageHeader title="My Courses" subtitle="Spring 2025 Semester">
            <div className="flex flex-row items-center gap-4 justify-between w-auto">                    
                <SelectBox
                    options={[
                        { value: "all", label: "All Courses" },
                        { value: "in-progress", label: "In Progress" },
                        { value: "completed", label: "Completed" },
                    ]}
                    selectedOption={"all"}
                />

                {!isMobile && <ToggleViewMode 
                    isVertical={false}
                    isFirstMode={viewMode === "grid"}
                    onFirstModeSelect={() => setViewMode("grid")}
                    onSecondModeSelect={() => setViewMode("list")}
                    firstModeLabel={<Grid2ColIcon className="w-5 h-5" />}
                    secondModeLabel={<ListIcon className="w-5 h-5" />}
                />}
            </div>
        </PageHeader>
    );
}