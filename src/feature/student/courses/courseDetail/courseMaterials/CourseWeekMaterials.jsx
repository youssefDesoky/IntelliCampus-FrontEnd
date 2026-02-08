import Button from "../../../../../components/ui/Button";
import CourseWeekMaterialContent from "./CourseWeekMaterialContent";
import { getMaterialDownloadUrl } from "../../../../course/services/materialsApi";

export default function CourseWeekMaterials({ folder }) {
    const materials = folder.materials || [];

    return (
        <div className="mt-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark overflow-hidden hover:shadow-lg dark:hover:shadow-shadow-dark">
            <div className="p-6 md:p-8 bg-linear-to-r from-bg-surface-secondary-default-light/50 to-transparent dark:from-bg-surface-secondary-default-dark/50 border-b border-border-tertiary-default-light dark:border-border-tertiary-default-dark">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center justify-between gap-3 mb-2">
                            <h3 className="text-xl md:text-2xl font-bold truncate text-text-primary-default-light dark:text-text-primary-default-dark">
                                {folder.name}
                            </h3>

                            <span className="px-3 py-1 w-fit text-nowrap rounded-full text-sm font-semibold bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark">
                                {materials.length} {materials.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>
                        {folder.description && (
                            <p className="text-base text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-3xl">
                                {folder.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-2 md:p-4">
                {materials.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-bg-surface-tertiary-default-light dark:bg-bg-surface-tertiary-default-dark flex items-center justify-center mb-4">
                            <FileLinesIcon size={24} className="text-icon-tertiary-default-light dark:text-icon-tertiary-default-dark" />
                        </div>
                        <h4 className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
                            No materials available
                        </h4>
                        <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-md">
                            Materials for this week will be uploaded soon. Check back later!
                        </p>
                    </div>
                ) : (
                    <ul className="flex flex-col divide-y divide-border-tertiary-default-light dark:divide-border-tertiary-default-dark">
                        {materials.map((material, index) => (
                            <CourseWeekMaterialContent 
                                key={material.materialId || index} 
                                material={material}
                                isFirst={index === 0}
                            />
                        ))}
                    </ul>
                )}
            </div>
            
            {materials.length > 0 && (
                <div className="px-6 md:px-8 py-4 border-t border-border-tertiary-default-light dark:border-border-tertiary-default-dark bg-bg-surface-secondary-default-light/30 dark:bg-bg-surface-secondary-default-dark/30">
                    <div className="flex flex-row items-center justify-between gap-3">
                        <p className="text-sm text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                            {materials.length} {materials.length === 1 ? 'file' : 'files'}
                        </p>
                        <Button variant="primary" >
                            Download All
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}