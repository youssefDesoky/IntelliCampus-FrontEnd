import { useEffect, useState } from "react";

import Section from "../../../components/ui/Section";

import MyCourse from "../../../feature/student/courses/myCourses/MyCourse";
import useDeviceType from "../../../hooks/useDeviceType";

import DataBanner from "../../../components/ui/DataBanner";
import MyCoursesHeader from "../../../feature/student/courses/myCourses/MyCoursesHeader";
import { fetchMyStudentCourses } from "../../../feature/course/services/coursesApi";


export default function MyCourses() {
    const { isMobile } = useDeviceType();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [viewMode, setViewMode] = useState(() => {
        return isMobile ? "list" : localStorage.getItem("myCoursesViewMode") || "grid";
    });

    useEffect(() => {
        localStorage.setItem("myCoursesViewMode", viewMode);
    }, [viewMode]);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                const data = await fetchMyStudentCourses();
                if (!cancelled) setCourses(data);
            } catch (err) {
                if (!cancelled) setError(err.message);
                console.error("Failed to load courses:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    // Compute stats from real data
    const activeCourses = courses.filter(c => c.statusName === "Active");
    const inactiveCourses = courses.filter(c => c.statusName !== "Active");
    const totalHours = courses.reduce((sum, c) => sum + (c.creditHours || 0), 0);

    const stats = [
        { label: "Total Courses", value: courses.length },
        { label: "Active Courses", value: activeCourses.length },
        { label: "Completed Courses", value: inactiveCourses.length },
        { label: "Total Hours", value: totalHours },
    ];

    return (
        <>
            <MyCoursesHeader 
                isMobile={isMobile}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            <Section className="hidden md:grid grid-cols-4 gap-6 mb-6">
                <DataBanner
                    title="Course Statistics"
                    data={stats}
                />
            </Section>

            {loading && (
                <div className="flex justify-center py-12">
                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading courses...</p>
                </div>
            )}

            {error && (
                <div className="flex justify-center py-12">
                    <p className="text-red-500">Failed to load courses: {error}</p>
                </div>
            )}

            {!loading && !error && courses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h3 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
                        No courses enrolled
                    </h3>
                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-md">
                        You are not currently enrolled in any courses.
                    </p>
                </div>
            )}

            {!loading && !error && courses.length > 0 && (
                <Section className={`mb-6 ${viewMode === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}`}>
                    {courses.map((course) => (
                        <MyCourse key={course.courseId} course={course} role="student" viewMode={viewMode} isMobile={isMobile} />
                    ))}
                </Section>
            )}
        </>
    );
}
