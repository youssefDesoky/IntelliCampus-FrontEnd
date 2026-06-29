import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileSlashIcon } from "../../../../components/ui/icons";
import Section from "../../../../components/ui/Section";
import CoursePrerequisitesCard from "./CoursePrerequisitesCard";
import { PrereqPageSkeleton } from "./SkeletonLoader";
import { fetchCoursePrerequisites } from "../../services/profileApi";

export default function CoursePrerequisitesBody({ search = "" }) {
    const { data: courseData = [], isLoading: loading, error } = useQuery({
        queryKey: ["coursePrerequisites"],
        queryFn: async () => {
            const data = await fetchCoursePrerequisites();
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

    const filtered = useMemo(() => {
        if (!search.trim()) return courseData;
        const q = search.toLowerCase();
        return courseData.filter(
            (course) =>
                course.title.toLowerCase().includes(q) ||
                course.code.toLowerCase().includes(q) ||
                course.prerequisites.some(
                    (p) => p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
                )
        );
    }, [courseData, search]);

    if (loading) {
        return (
            <Section>
                <PrereqPageSkeleton />
            </Section>
        );
    }

    return (
        <Section className="flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((course) => (
                    <CoursePrerequisitesCard key={course.id} course={course} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                    <FileSlashIcon className="w-12 h-12 mb-4 opacity-40" />
                    <p className="text-sm">{search.trim() ? "No courses match your search." : "No prerequisite data available."}</p>
                </div>
            )}
        </Section>
    );
}
