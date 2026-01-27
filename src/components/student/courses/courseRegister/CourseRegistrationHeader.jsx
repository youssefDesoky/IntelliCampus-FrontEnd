import ProgressBox from "../../../../ui/ProgressBox";
import PageHeader from "../../../../ui/PageHeader";
import DataBanner from "../../../../ui/DataBanner";
import SearchBar from "../../../../ui/SearchBar";
import SelectBox from "../../../../ui/SelectBox";

import { FilterIcon, StarIcon, BookIcon, ClockIcon } from "../../../../ui/icons";
import Button from "../../../../ui/Button";

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

            <div className="grid grid-cols-8 gap-3 mt-4 w-full">
                {deviceType === "desktop" ? 
                    <div className="filter-buttons flex justify-evenly items-center gap-2 col-span-4">
                        <Button
                            buttonType="secondary"
                        >
                            <FilterIcon className="w-5 h-5" />
                            <span>All Courses</span>
                        </Button>

                        <Button
                            buttonType="secondary"
                        >
                            <StarIcon className="w-5 h-5" />
                            <span>Required Courses</span>
                        </Button>

                        <Button
                            buttonType="secondary"
                        >
                            <BookIcon className="w-5 h-5" />
                            <span>Elective Courses</span>
                        </Button>

                        <Button
                            buttonType="secondary"
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
                        selectedOption='all'
                        className="col-span-4"
                    />
                }

                <SearchBar className={`${deviceType === "desktop" ? "col-span-4 col-start-7" : "col-span-4"}`} placeholder="Search course by name or code..." />
            </div>
        </PageHeader>
    );
}