import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { BookIcon } from "../../../components/ui/icons";
import Section from "../../../components/ui/Section";
import DataBanner from "../../../components/ui/DataBanner";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import useDeviceType from "../../../hooks/useDeviceType";

import InstructorCourseCard from "../../../feature/instructor/components/courses/InstructorCourseCard";
import InstructorCoursesHeader from "../../../feature/instructor/components/courses/InstructorCoursesHeader";
import { fetchMyTeachingCourses } from "../../../feature/course/services/coursesApi";
import { InstructorCoursesSkeleton } from "../../../feature/instructor/SkeletonLoader";
import { getLocalizedField } from '../../../utils/getLocalizedField';


export default function InstructorCourses() {
    const { t, i18n } = useTranslation('instructor');
    const { isMobile } = useDeviceType();
    const navigate = useNavigate();

    const mapCourseToCardProps = (course) => {
        const initials = (getLocalizedField(course, 'departmentName', i18n.language) || getLocalizedField(course, 'courseCode', i18n.language) || course.courseCode || "")
            .split(" ")
            .map(w => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "CS";

        return {
            courseId: course.courseId,
            initials,
            code: getLocalizedField(course, 'courseCode', i18n.language) || course.courseCode || "",
            semester: getLocalizedField(course, 'semester', i18n.language) || course.semester || "",
            type: course.isElective ? "elective" : "core",
            title: getLocalizedField(course, 'courseName', i18n.language) || "",
            room: getLocalizedField(course, 'room', i18n.language) || course.roomAr || course.room || "",
            totalStudents: course.totalStudents,
            creditHours: course.creditHours,
        };
    };

    const PAGE_SIZE = 6;
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: courses = [], isLoading: loading, error } = useQuery({
        queryKey: ["instructorCourses", debouncedSearch],
        queryFn: async () => {
            const params = { pageSize: 50 };
            if (debouncedSearch) params.search = debouncedSearch;
            const data = await fetchMyTeachingCourses(params);
            return (Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []).map(mapCourseToCardProps);
        },
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });

    const [viewMode, setViewMode] = useState(() => {
        return isMobile ? "list" : localStorage.getItem("instructorCoursesViewMode") || "grid";
    });

    useEffect(() => {
        localStorage.setItem("instructorCoursesViewMode", viewMode);
    }, [viewMode]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(courses.length / PAGE_SIZE));
    const from = (page - 1) * PAGE_SIZE + 1;
    const to = Math.min(page * PAGE_SIZE, courses.length);
    const paginatedCourses = courses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [courses.length, page, totalPages]);

    // Compute stats from real data
    const totalHours = courses.reduce((sum, c) => sum + (c.creditHours || 0), 0);
    const totalStudents = courses.reduce((sum, c) => sum + (c.totalStudents || 0), 0);

    const handleEnterClassroom = useCallback((courseId) => {
        navigate(`/instructor/courses/${courseId}`);
    }, [navigate]);

    const stats = [
        { label: t('courses.assignedCourses'), value: courses.length },
        { label: t('courses.totalHours'), value: totalHours },
        { label: t('courses.totalStudents'), value: totalStudents },
    ];

    return (
        <div className="flex flex-col min-h-[calc(100vh-160px)]">
            <InstructorCoursesHeader
                isMobile={isMobile}
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                hasCourses={courses.length > 0}
            />

            <div className="flex flex-col flex-1">
                {courses.length > 0 && (
                    <Section className="hidden md:grid grid-cols-3 gap-6 mb-6">
                        <DataBanner
                            title={t('courses.statistics')}
                            data={stats}
                        />
                    </Section>
                )}

                {loading && <InstructorCoursesSkeleton viewMode={viewMode} />}

                {!loading && courses.length === 0 && (
                    <div className="flex flex-col items-center justify-center flex-1 text-center">
                        <BookIcon className="w-12 h-12 mb-4 opacity-40 text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
                        <h3 className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
                            {t('courses.empty')}
                        </h3>
                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-md">
                            {t('courses.emptyDesc')}
                        </p>
                    </div>
                )}

                {!loading && paginatedCourses.length > 0 && (
                    <Section className={`flex-1 ${viewMode === "grid" ? "flex flex-wrap justify-evenly gap-4 sm:grid sm:grid-cols-2" : "flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-evenly"}`}>
                        {paginatedCourses.map((course) => (
                            <InstructorCourseCard key={course.courseId} {...course} onEnterClassroom={() => handleEnterClassroom(course.courseId)} />
                        ))}
                    </Section>
                )}

                {!loading && totalPages > 1 && (
                    <Section className="mt-auto mb-6">
                        <PaginationButtons
                            totalPages={totalPages}
                            currentPage={page}
                            setCurrentPage={setPage}
                            {...(!isMobile ? { from, to, total: courses.length, label: "courses" } : {})}
                        />
                    </Section>
                )}
            </div>
        </div>
    );
}