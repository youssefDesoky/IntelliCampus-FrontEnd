import CoursePrerequisitesCard from "./CoursePrerequisitesCard";
import coursesData from "../../../../data/courses";

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