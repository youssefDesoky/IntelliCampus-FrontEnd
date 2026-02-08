import Button from "../../../../components/ui/Button";
import SearchBar from "../../../../components/ui/SearchBar";
import SelectBox from "../../../../components/ui/SelectBox";
import PageHeader from "../../../../components/ui/PageHeader";
import DataBanner from "../../../../components/ui/DataBanner";
import ProgressBox from "../../../../components/ui/ProgressBox";
import { FilterIcon, StarIcon, BookIcon, ClockIcon } from "../../../../components/ui/icons";

export default function CourseRegistrationHeader({deviceType}) {
    return (
        <PageHeader title="Course Registration" subtitle="Spring 2024 Semester" headerDir="col">
            <ProgressBox progress={50} >
                <p>Registration Progress</p>
                <span>3 of 6 courses selected</span>
            </ProgressBox>

            <DataBanner 
                title="Credit Summary" 
                span={<span className="">12/18 Credits</span>} 
                data={[
                    { label: "Selected", value: 12 },
                    { label: "Remaining", value: 6 },
                    { label: "Maximum", value: 18 },
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