import { useMemo } from "react";
import Section from "../../../../components/ui/Section";
import CoursePrerequisitesCard from "./CoursePrerequisitesCard";

const courseData = [
    {
        id: 1, title: "Data Structures", code: "CS201", creditHours: 3,
        prerequisites: [{ id: "CS101", title: "Introduction to Programming" }],
    },
    {
        id: 2, title: "Algorithms", code: "CS202", creditHours: 3,
        prerequisites: [{ id: "CS201", title: "Data Structures" }],
    },
    {
        id: 3, title: "Operating Systems", code: "CS301", creditHours: 3,
        prerequisites: [{ id: "CS201", title: "Data Structures" }],
    },
    {
        id: 4, title: "Database Systems", code: "CS302", creditHours: 3,
        prerequisites: [{ id: "CS201", title: "Data Structures" }],
    },
    {
        id: 5, title: "Computer Networks", code: "CS303", creditHours: 3,
        prerequisites: [{ id: "CS201", title: "Data Structures" }],
    },
    {
        id: 6, title: "Artificial Intelligence", code: "CS401", creditHours: 3,
        prerequisites: [
            { id: "CS202", title: "Algorithms" },
            { id: "CS301", title: "Operating Systems" },
        ],
    },
];

export default function CoursePrerequisitesBody({ search = "" }) {
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
    }, [search]);

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
                        No courses match your search.
                    </p>
                </div>
            )}
        </Section>
    );
}
