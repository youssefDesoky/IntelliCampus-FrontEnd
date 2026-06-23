import { useMemo, useState, useEffect } from "react";
import Section from "../../../../components/ui/Section";
import CoursePrerequisitesCard from "./CoursePrerequisitesCard";
import { API_URL } from "../../../../config/api";
import { useError } from "../../../../contexts/ErrorContext.jsx";

export default function CoursePrerequisitesBody({ search = "" }) {
    const [courseData, setCourseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showError } = useError();

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/api/courses/prerequisites`, {
                    credentials: "include",
                });
                if (!res.ok) throw new Error(`Failed to load prerequisites (${res.status})`);
                const data = await res.json();
                const list = Array.isArray(data) ? data : [];
                const mapped = list.map((course) => ({
                    id: course.courseId,
                    title: course.courseName || "",
                    code: course.courseCode || "",
                    creditHours: course.creditHours || "",
                    prerequisites: (course.prerequisites || []).map((p) => ({
                        id: p.code || "",
                        title: p.title || "",
                    })),
                }));
                if (!cancelled) setCourseData(mapped);
            } catch (err) {
                if (!cancelled) showError(err.message || "Failed to load prerequisites");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

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
                <div className="flex justify-center py-12">
                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading prerequisites...</p>
                </div>
            </Section>
        );
    }

    return (
        <Section>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((course) => (
                    <CoursePrerequisitesCard key={course.id} course={course} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="rounded-xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark p-10 text-center">
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        {search.trim() ? "No courses match your search." : "No prerequisite data available."}
                    </p>
                </div>
            )}
        </Section>
    );
}
