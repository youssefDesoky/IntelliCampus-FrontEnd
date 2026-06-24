import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Section from "../../../components/ui/Section";

import MyCourse from "../../../feature/student/courses/myCourses/MyCourse";
import TranscriptView from "../../../feature/student/courses/myCourses/TranscriptView";
import useDeviceType from "../../../hooks/useDeviceType";

import DataBanner from "../../../components/ui/DataBanner";
import MyCoursesHeader from "../../../feature/student/courses/myCourses/MyCoursesHeader";
import { fetchMyStudentCourses } from "../../../feature/course/services/coursesApi";
import { useError } from '../../../contexts/ErrorContext.jsx';


function mapCourseToMyCourseProps(course) {
    const initials = (course.departmentName || course.courseCode || "")
        .split(" ")
        .map(w => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "CS";

    const type = course.isElective ? "elective" : "core";
    const status = course.studentCourseStatusName === "Completed" ? "completed" : "in-progress";

    let attendanceValue = "0%";
    let attendanceStatus = "good";
    if (course.attendance != null) {
        attendanceValue = `${Math.round(course.attendance)}%`;
        attendanceStatus = course.attendance >= 75 ? "good" : course.attendance >= 50 ? "warning" : "risk";
    }

    const gradeValue = course.grade != null ? `${Math.round(course.grade)}%` : "—";
    const section = course.className || "";
    const creditHours = course.creditHours || 0;

    return {
        courseId: course.courseId,
        initials,
        code: course.courseCode || "",
        semester: course.semester || "",
        type,
        status,
        title: course.courseName || "",
        instructor: course.professorName || "",
        room: course.room || "",
        attendance: { value: attendanceValue, status: attendanceStatus },
        section,
        grade: gradeValue,
        creditHours,
    };
}

export default function MyCourses() {
    const { isMobile } = useDeviceType();
    const navigate = useNavigate();
    const location = useLocation();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showError } = useError();
    const [showTranscript, setShowTranscript] = useState(() => location.state?.showTranscript || false);
    
    const [viewMode, setViewMode] = useState(() => {
        return isMobile ? "list" : localStorage.getItem("myCoursesViewMode") || "grid";
    });
    const [filterStatus, setFilterStatus] = useState([]);
    const [filterType, setFilterType] = useState([]);

    useEffect(() => {
        localStorage.setItem("myCoursesViewMode", viewMode);
    }, [viewMode]);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                const backendStatus =
                    filterStatus.length === 1
                        ? filterStatus[0] === "in-progress"
                            ? "inprogress"
                            : filterStatus[0]
                        : null;
                const data = await fetchMyStudentCourses(backendStatus);
                if (!cancelled) setCourses((Array.isArray(data) ? data : []).map(mapCourseToMyCourseProps));
            } catch (err) {
                showError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [filterStatus, showError]);

    // Apply filters
    const filteredCourses = courses.filter(c => {
        if (filterStatus.length > 0 && !filterStatus.includes(c.status)) return false;
        if (filterType.length > 0 && !filterType.includes(c.type)) return false;
        return true;
    });

    const handleEnterClassroom = useCallback((courseId) => {
        navigate(`/courses/${courseId}`);
    }, [navigate]);

    const handleViewMaterials = useCallback((courseId) => {
        navigate(`/courses/${courseId}/materials`);
    }, [navigate]);

    // Compute stats from filtered data
    const activeCourses = filteredCourses.filter(c => c.status === "in-progress");
    const inactiveCourses = filteredCourses.filter(c => c.status !== "in-progress");
    const totalHours = filteredCourses.reduce((sum, c) => sum + (c.creditHours || 0), 0);

    const stats = [
        { label: "Total Courses", value: filteredCourses.length },
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
                showTranscript={showTranscript}
                setShowTranscript={setShowTranscript}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterType={filterType}
                setFilterType={setFilterType}
            />

            {!showTranscript && (
                <Section className="hidden md:grid grid-cols-4 gap-6 mb-6">
                    <DataBanner
                        title="Course Statistics"
                        data={stats}
                    />
                </Section>
            )}

            {!showTranscript && loading && (
                <div className="flex justify-center py-12">
                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading courses...</p>
                </div>
            )}

            {!showTranscript && !loading && filteredCourses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h3 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
                        {courses.length === 0 ? "No courses enrolled" : "No courses match your filters"}
                    </h3>
                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-md">
                        {courses.length === 0
                            ? "You are not currently enrolled in any courses."
                            : "Try adjusting the status or type filters above."}
                    </p>
                </div>
            )}

            {!showTranscript && !loading && filteredCourses.length > 0 && (
                <Section className={`mb-6 ${viewMode === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}`}>
                    {filteredCourses.map((course) => (
                        <MyCourse key={course.courseId} {...course} onEnterClassroom={() => handleEnterClassroom(course.courseId)} onViewMaterials={() => handleViewMaterials(course.courseId)} />
                    ))}
                </Section>
            )}

            {showTranscript && <TranscriptView />}
        </>
    );
}
