import { useEffect } from "react";
import { useLocation, useOutletContext } from "react-router-dom";

import CourseWeekMaterials from "../../../feature/student/courses/courseDetail/courseMaterials/CourseWeekMaterials";



export default function CourseMaterials() {
    const { course } = useOutletContext();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const folderId = searchParams.get("folderId");
    const materialId = searchParams.get("materialId");

    useEffect(() => {
        const id = materialId || folderId;
        if (!id) return;

        const timer = window.setTimeout(() => {
            const target = document.getElementById(materialId ? `material-${materialId}` : `material-folder-${folderId}`);
            target?.scrollIntoView({ behavior: "smooth", block: "center" });
            target?.classList.add("animate-pulse");
            setTimeout(() => target?.classList.remove("animate-pulse"), 2000);
        }, 300);

        return () => window.clearTimeout(timer);
    }, [folderId, materialId]);

    if (!course?.folders || course.folders.length === 0) {
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
                    highlightedMaterialId={materialId ? Number(materialId) : undefined}
                />
            ))}
        </div>
    );
}