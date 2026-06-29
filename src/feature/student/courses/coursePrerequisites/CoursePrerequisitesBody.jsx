import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Section from "../../../../components/ui/Section";
import CoursePrerequisitesCard from "./CoursePrerequisitesCard";
import { PrereqPageSkeleton } from "./SkeletonLoader";
import { fetchCoursePrerequisites } from "../../services/profileApi";

export default function CoursePrerequisitesBody({ search = "" }) {
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: courseData = [], isLoading: loading, error } = useQuery({
        queryKey: ["coursePrerequisites", debouncedSearch],
        queryFn: async () => {
            const params = debouncedSearch ? { searchQuery: debouncedSearch, PageSize: 500 } : { PageSize: 500 };
            const data = await fetchCoursePrerequisites(params);
            const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
            return list.map((course) => ({
                id: course.courseId,
                title: course.courseName || "",
                code: course.courseCode || "",
                creditHours: course.creditHours || "",
                prerequisites: (course.prerequisites || []).map((p) => ({
                    id: p.code || "",
                    title: p.title || "",
                })),
            }));
        },
        staleTime: 10 * 60 * 1000,
    });

    if (loading) {
        return (
            <Section>
                <PrereqPageSkeleton />
            </Section>
        );
    }

    return (
        <Section>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {courseData.map((course) => (
                    <CoursePrerequisitesCard key={course.id} course={course} />
                ))}
            </div>

            {courseData.length === 0 && (
                <div className="rounded-xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark p-10 text-center">
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        {search.trim() ? "No courses match your search." : "No prerequisite data available."}
                    </p>
                </div>
            )}
        </Section>
    );
}
