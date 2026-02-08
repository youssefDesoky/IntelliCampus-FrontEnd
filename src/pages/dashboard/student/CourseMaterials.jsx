import { useOutletContext } from "react-router-dom";

import CourseWeekMaterials from "../../../feature/student/courses/courseDetail/courseMaterials/CourseWeekMaterials";



export default function CourseMaterials() {
    const { course } = useOutletContext();

    if (!course.folders || course.folders.length === 0) {
        return (
            <div className="mt-10 flex flex-col items-center justify-center py-16 text-center">
                <h3 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
                    No materials available
                </h3>
                <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-md">
                    Materials for this course will be uploaded soon. Check back later!
                </p>
            </div>
        );
    }

    return (
        <>
            {course.folders.map((folder) => (
                <CourseWeekMaterials 
                    key={folder.materialFolderId}
                    folder={folder}
                />
            ))}
        </>
    );
}