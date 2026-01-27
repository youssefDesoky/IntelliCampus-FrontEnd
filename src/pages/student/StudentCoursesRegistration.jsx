import Section from "../../ui/Section";
import WeeklySchedule from "../../ui/WeeklySchedule";

import useDeviceType from "../../hooks/useDeviceType";
import CourseCard from "../../components/student/courses/courseRegister/CourseCard";
import CourseRegistrationNote from "../../components/student/courses/courseRegister/CourseRegistrationNote";
import CourseRegistrationHeader from "../../components/student/courses/courseRegister/CourseRegistrationHeader";
import CoursesRegistrationActionButtons from "../../components/student/courses/courseRegister/CourseRegistrationActionButtons";



// Data
import coursesData from "../../data/courses";
import PaginationButtons from "../../ui/PaginationButtons";

const sampleSchedule = [
    {
        id: 1,
        title: "Data Structures",
        day: "sat",
        startTime: "8:00 AM",
        endTime: "10:00 AM",
        type: "lecture",
        location: "Room 101",
        instructor: "Dr. Ahmed"
    },
    {
        id: 2,
        title: "Database Lab",
        day: "sat",
        startTime: "11:00 AM",
        endTime: "1:00 PM",
        type: "lab",
        location: "Lab 3",
        instructor: "Eng. Sara"
    },
    {
        id: 3,
        title: "Web Development",
        day: "sun",
        startTime: "9:00 AM",
        endTime: "11:00 AM",
        type: "lecture",
        location: "Room 205",
        instructor: "Dr. Mohamed"
    }
];  

export default function StudentCoursesRegistration() {
    const { isDesktop }  = useDeviceType();

    return (
        <>
            <CourseRegistrationHeader deviceType={isDesktop ? "desktop" : "mobile"}/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section>
                    <h3 className="text-md font-semibold">Selected Courses (3)</h3>

                    <div className="mt-4">
                        <div className="space-y-4 mb-4">
                            {coursesData["Computer Science"].map(course => <CourseCard course={course} cardType="selected"/>)}
                        </div>

                        <PaginationButtons buttonsNumber={3} currentPage={1} setCurrentPage={() => {}} />
                    </div>
                </Section>

                <Section>
                    <h3 className="text-md font-semibold">Available Courses</h3>

                    <div className="mt-4">
                        <div className="space-y-4 mb-4">
                            {coursesData["Information Systems"].map(course => <CourseCard course={course} cardType="available"/>)}
                        </div>

                        <PaginationButtons buttonsNumber={4} currentPage={1} setCurrentPage={() => {}} />
                    </div>
                </Section>

                <Section className="md:col-span-2">
                    <div>
                        <h3 className="text-md font-semibold">Weekly Schedule Preview</h3>

                        <WeeklySchedule schedule={sampleSchedule} onEventClick={(event) => alert(`Clicked on event: ${event.title}`)} />
                    </div>
                    
                </Section>

                <div className="md:col-span-2 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-t-2 border-border-primary-default-light dark:border-border-primary-default-dark pt-6">
                    <CoursesRegistrationActionButtons />

                    <CourseRegistrationNote />
                </div>
            </div>

        </>
    );
}