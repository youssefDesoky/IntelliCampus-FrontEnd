import { useState } from "react";

import useDeviceType from "../../../hooks/useDeviceType";

import Section from "../../../components/ui/Section";
import WeeklySchedule from "../../../components/ui/WeeklySchedule";
import PaginationButtons from "../../../components/ui/PaginationButtons";

import CourseCard from "../../../feature/student/courses/courseRegister/CourseCard";
import CourseRegistrationNote from "../../../feature/student/courses/courseRegister/CourseRegistrationNote";
import CourseRegistrationHeader from "../../../feature/student/courses/courseRegister/CourseRegistrationHeader";
import CoursesRegistrationActionButtons from "../../../feature/student/courses/courseRegister/CourseRegistrationActionButtons";


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

const coursesData = {
    "Computer Science": [
        {
            id: "CS101",
            title: "Introduction to Computer Science",
            code: "CS101",
            creditHours: 3,
            professor: "Dr. Ahmed",
            schedule: "Sat 8:00-10:00",
            room: "Room 101",
        },
        {
            id: "CS102",
            title: "Data Structures",
            code: "CS102",
            creditHours: 4,
            professor: "Dr. Sara",
            schedule: "Mon 10:00-12:00",
            room: "Room 205",
        },
        {
            id: "CS103",
            title: "Algorithms",
            code: "CS103",
            creditHours: 4,
            professor: "Dr. Mohamed",
            schedule: "Wed 14:00-16:00",
            room: "Room 301",
        },
    ],
    "Information Systems": [
        {
            id: "IS201",
            title: "Database Management Systems",
            code: "IS201",
            creditHours: 3,
            professor: "Dr. Fatma",
            schedule: "Tue 9:00-11:00",
            room: "Room 102",
            preRequisites: [{ id: "CS101" }],
        },
        {
            id: "IS202",
            title: "Systems Analysis and Design",
            code: "IS202",
            creditHours: 3,
            professor: "Dr. Khaled",
            schedule: "Thu 13:00-15:00",
            room: "Room 204",
            preRequisites: [{ id: "CS102" }, { id: "IS201" }],
        },
        {
            id: "IS203",
            title: "Enterprise Architecture",
            code: "IS203",
            creditHours: 3,
            professor: "Dr. Laila",
            schedule: "Fri 10:00-12:00",
            room: "Room 108",
        },
    ],
};

export default function CoursesRegistration() {
    const { isDesktop }  = useDeviceType();
    const [selectedCoursesPage, setSelectedCoursesPage] = useState(1);
    const [availableCoursesPage, setAvailableCoursesPage] = useState(1);

    return (
        <>
            <CourseRegistrationHeader deviceType={isDesktop ? "desktop" : "mobile"}/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section>
                    <h3 className="text-md font-semibold">Selected Courses (3)</h3>

                    <div className="mt-4">
                        <div className="space-y-4 mb-4">
                            {coursesData["Computer Science"].map(course => <CourseCard key={course.id} course={course} cardType="selected"/>)}
                        </div>

                        <PaginationButtons totalPages={3} currentPage={selectedCoursesPage} setCurrentPage={setSelectedCoursesPage} />
                    </div>
                </Section>

                <Section>
                    <h3 className="text-md font-semibold">Available Courses</h3>

                    <div className="mt-4">
                        <div className="space-y-4 mb-4">
                            {coursesData["Information Systems"].map(course => <CourseCard key={course.id} course={course} cardType="available"/>)}
                        </div>

                        <PaginationButtons totalPages={4} currentPage={availableCoursesPage} setCurrentPage={setAvailableCoursesPage} />
                    </div>
                </Section>

                <Section className="md:col-span-2">
                    <div>
                        <h3 className="text-md font-semibold">Weekly Schedule Preview</h3>

                        <WeeklySchedule schedule={sampleSchedule} />
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