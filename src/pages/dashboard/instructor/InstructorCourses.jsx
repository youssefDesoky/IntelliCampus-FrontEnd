import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Section from "../../../components/ui/Section";
import DataBanner from "../../../components/ui/DataBanner";
import useDeviceType from "../../../hooks/useDeviceType";

import InstructorCourseCard from "../../../feature/instructor/components/courses/InstructorCourseCard";
import InstructorCoursesHeader from "../../../feature/instructor/components/courses/InstructorCoursesHeader";
import { fetchMyTeachingCourses } from "../../../feature/course/services/coursesApi";


function mapCourseToCardProps(course) {
    const initials = (course.departmentName || course.courseCode || "")
        .split(" ")
        .map(w => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "CS";

    return {
        courseId: course.courseId,
        initials,
        code: course.courseCode || "",
        semester: course.semester || "",
        type: course.isElective ? "elective" : "core",
        title: course.courseName || "",
        room: course.room || "",
        totalStudents: course.totalStudents,
        creditHours: course.creditHours,
    };
}

export default function InstructorCourses() {
    const { isMobile } = useDeviceType();
    const navigate = useNavigate();
    const { data: courses = [], isLoading: loading, error } = useQuery({
        queryKey: ["instructorCourses"],
        queryFn: async () => {
            const data = await fetchMyTeachingCourses();
            return (Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []).map(mapCourseToCardProps);
        },
        staleTime: 5 * 60 * 1000,
    });

    const [viewMode, setViewMode] = useState(() => {
        return isMobile ? "list" : localStorage.getItem("instructorCoursesViewMode") || "grid";
    });

    useEffect(() => {
        localStorage.setItem("instructorCoursesViewMode", viewMode);
    }, [viewMode]);

    // Compute stats from real data
    const totalHours = courses.reduce((sum, c) => sum + (c.creditHours || 0), 0);
    const totalStudents = courses.reduce((sum, c) => sum + (c.totalStudents || 0), 0);

    const handleEnterClassroom = useCallback((courseId) => {
        navigate(`/instructor/courses/${courseId}`);
    }, [navigate]);

    const stats = [
        { label: "Assigned Courses", value: courses.length },
        { label: "Total Hours", value: totalHours },
        { label: "Total Students", value: totalStudents },
    ];

    return (
        <>
            <InstructorCoursesHeader 
                isMobile={isMobile}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            <Section className="hidden md:grid grid-cols-3 gap-6 mb-6">
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

            {!loading && courses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h3 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
                        No courses assigned
                    </h3>
                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-md">
                        You are not currently assigned to any courses.
                    </p>
                </div>
            )}

            {!loading && courses.length > 0 && (
                <Section className={`mb-6 ${viewMode === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}`}>
                    {courses.map((course) => (
                        <InstructorCourseCard key={course.courseId} {...course} onEnterClassroom={() => handleEnterClassroom(course.courseId)} />
                    ))}
                </Section>
            )}
        </>
    );
}