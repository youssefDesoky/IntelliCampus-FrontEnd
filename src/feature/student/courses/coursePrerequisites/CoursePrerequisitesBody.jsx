import CoursePrerequisitesCard from "./CoursePrerequisitesCard";

const coursesData = {
    "Computer Science": [
        { id: 1, title: "Data Structures", code: "CS201", prerequisites: ["CS101"] },
        { id: 2, title: "Algorithms", code: "CS202", prerequisites: ["CS201"] },
        { id: 3, title: "Operating Systems", code: "CS301", prerequisites: ["CS201"] },
        { id: 4, title: "Database Systems", code: "CS302", prerequisites: ["CS201"] },
        { id: 5, title: "Computer Networks", code: "CS303", prerequisites: ["CS201"] },
        { id: 6, title: "Artificial Intelligence", code: "CS401", prerequisites: ["CS202"] },
    ],
};

export default function CoursePrerequisitesBody({ isPhone, isTablet, viewMode }) {
    return (
        <div>
            <div className={`grid ${isPhone ? "grid-cols-1" : isTablet ? (viewMode === 'list' ? "grid-cols-1" : "grid-cols-2") : (viewMode === 'grid-3' ? "grid-cols-3" : "grid-cols-2")} gap-6 mb-4`}>
                {coursesData["Computer Science"].map((course) => (
                    <CoursePrerequisitesCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
}