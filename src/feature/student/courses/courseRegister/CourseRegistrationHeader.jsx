import Button from "../../../../components/ui/Button";
import SearchBar from "../../../../components/ui/SearchBar";
import SelectBox from "../../../../components/ui/SelectBox";
import PageHeader from "../../../../components/ui/PageHeader";
import DataBanner from "../../../../components/ui/DataBanner";
import ProgressBox from "../../../../components/ui/ProgressBox";
import { FilterIcon, StarIcon, BookIcon, ClockIcon } from "../../../../components/ui/icons";

const MAX_CREDITS = 18;

export default function CourseRegistrationHeader({deviceType, selectedCourses = []}) {
    const selectedCount = selectedCourses.length;
    const selectedCredits = selectedCourses.reduce((sum, c) => sum + (typeof c.creditHours === 'number' ? c.creditHours : 0), 0);
    const remainingCredits = Math.max(0, MAX_CREDITS - selectedCredits);
    const registrationProgress = Math.min(100, Math.round((selectedCredits / MAX_CREDITS) * 100));

    return (
        <PageHeader title="Course Registration" subtitle="Spring 2026 Semester" headerDir="col">
            <ProgressBox progress={registrationProgress} >
                <p>Registration Progress</p>
                <span>{selectedCredits} of {MAX_CREDITS} credit hours — {selectedCount} courses</span>
            </ProgressBox>

            <DataBanner 
                title="Credit Summary" 
                span={<span className="">{selectedCredits}/{MAX_CREDITS} Credits</span>} 
                data={[
                    { label: "Selected Hours", value: selectedCredits },
                    { label: "Remaining Hours", value: remainingCredits },
                    { label: "Maximum Hours", value: MAX_CREDITS },
                ]}
            />

            <div className="flex justify-between gap-4">
                {deviceType === "desktop" ? 
                    <div className="filter-buttons flex justify-evenly items-center gap-2">
                        <Button
                            variant="secondary"
                        >
                            <FilterIcon className="w-5 h-5" />
                            <span>All Courses</span>
                        </Button>

                        <Button
                            variant="secondary"
                        >
                            <StarIcon className="w-5 h-5" />
                            <span>Required Courses</span>
                        </Button>

                        <Button
                            variant="secondary"
                        >
                            <BookIcon className="w-5 h-5" />
                            <span>Elective Courses</span>
                        </Button>

                        <Button
                            variant="secondary"
                        >
                            <ClockIcon className="w-5 h-5" />
                            <span>Available Slots</span>
                        </Button>
                    </div> :
                    // Mobile Controls
                    <SelectBox 
                        options={[
                            { value: 'all', label: 'All Courses' },
                            { value: 'required', label: 'Required Courses' },
                            { value: 'elective', label: 'Elective Courses' },
                            { value: 'available', label: 'Available Slots' },
                        ]}
                        selectedOption={{ value: 'all', label: 'All Courses' }}
                        yPadding="py-2.5"
                    />
                }

                <SearchBar placeholder="Search course by name or code..." />
            </div>
        </PageHeader>
    );
}