import { useEffect, useState } from "react";

import Section from "../../ui/Section";

import MyCourse from "../../components/student/courses/myCourses/MyCourse";
import useDeviceType from "../../hooks/useDeviceType";

import DataBanner from "../../ui/DataBanner";
import MyCoursesHeader from "../../components/student/courses/myCourses/MyCoursesHeader";


// Data
const data = [
    { 
        label: "Total Courses", 
        value: 12
    },
    { 
        label: "Completed Courses",
        value: 9
    },
    { 
        label: "Ongoing Courses", 
        value: 3
    },
    { 
        label: "Completed Hours", 
        value: 54
    },
    { 
        label: "Ongoing Hours", 
        value: 15
    },
];

export default function StudentCourses({studentsCourses}) {
    const { isMobile } = useDeviceType();
    
    const [viewMode, setViewMode] = useState(() => {
        return isMobile ? "list" : localStorage.getItem("studentCoursesViewMode") || "grid";
    });

    useEffect(() => {
        localStorage.setItem("studentCoursesViewMode", viewMode);
    }, [viewMode]);

    return (
        <>
            <MyCoursesHeader 
                isMobile={isMobile}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            <Section className="hidden md:grid grid-cols-5 gap-6 mb-6">
                <DataBanner
                    title="Course Statistics"
                    data={data}
                />
            </Section>

            <Section className={`mb-6 ${viewMode === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}`}>
                {studentsCourses.map((course) => (
                    <MyCourse key={course.id} course={course} viewMode={viewMode} isMobile={isMobile} />
                ))}
            </Section>
        </>
    );
}