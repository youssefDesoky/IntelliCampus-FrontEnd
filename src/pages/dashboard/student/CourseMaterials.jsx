import { useEffect } from "react";
import { useLocation, useOutletContext } from "react-router-dom";

import CourseWeekMaterials from "../../../feature/student/courses/courseDetail/courseMaterials/CourseWeekMaterials";



export default function CourseMaterials() {
    const { course } = useOutletContext();
    const location = useLocation();
    const folderId = new URLSearchParams(location.search).get("folderId");

    useEffect(() => {
        if (!folderId) return;

        const timer = window.setTimeout(() => {
            const target = document.getElementById(`material-folder-${folderId}`);
            target?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);

        return () => window.clearTimeout(timer);
    }, [folderId]);

    if (!course.folders || course.folders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
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
        <div className="flex flex-col gap-6">
            {course.folders.map((folder) => (
                <CourseWeekMaterials 
                    key={folder.materialFolderId}
                    folder={folder}
                    highlighted={String(folder.materialFolderId) === String(folderId)}
                />
            ))}
        </div>
    );
}