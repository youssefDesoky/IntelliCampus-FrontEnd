import { useEffect, useState } from "react";

import Section from "../../../components/ui/Section";
import DataBanner from "../../../components/ui/DataBanner";
import useDeviceType from "../../../hooks/useDeviceType";

import MyCourse from "../../../feature/student/courses/myCourses/MyCourse";
import InstructorCoursesHeader from "../../../feature/instructor/components/courses/InstructorCoursesHeader";
import { fetchMyTeachingCourses } from "../../../feature/course/services/coursesApi";


export default function InstructorCourses() {
    const { isMobile } = useDeviceType();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [viewMode, setViewMode] = useState(() => {
        return isMobile ? "list" : localStorage.getItem("instructorCoursesViewMode") || "grid";
    });

    useEffect(() => {
        localStorage.setItem("instructorCoursesViewMode", viewMode);
    }, [viewMode]);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                const data = await fetchMyTeachingCourses();
                if (!cancelled) setCourses(data);
            } catch (err) {
                if (!cancelled) setError(err.message);
                console.error("Failed to load teaching courses:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    // Compute stats from real data
    const totalHours = courses.reduce((sum, c) => sum + (c.creditHours || 0), 0);

    const stats = [
        { label: "Assigned Courses", value: courses.length },
        { label: "Total Hours", value: totalHours },
        // { label: "Total Students", value: "⚠ missing from backend" },
        // { label: "Average Attendance", value: "⚠ missing from backend" },
    ];

    return (
        <>
            <InstructorCoursesHeader 
                isMobile={isMobile}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            <Section className="hidden md:grid grid-cols-2 gap-6 mb-6">
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
                        No courses assigned
                    </h3>
                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-md">
                        You are not currently assigned to any courses.
                    </p>
                </div>
            )}

            {!loading && !error && courses.length > 0 && (
                <Section className={`mb-6 ${viewMode === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}`}>
                    {courses.map((course) => (
                        <MyCourse key={course.courseId} course={course} role="instructor" viewMode={viewMode} isMobile={isMobile} />
                    ))}
                </Section>
            )}
        </>
    );
}
