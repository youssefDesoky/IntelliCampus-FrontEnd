import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import InstructorWeekMaterials from "../../../feature/instructor/components/courseMaterials/InstructorWeekMaterials";
import Button from "../../../components/ui/Button";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import { PlusIcon, XIcon } from "../../../components/ui/icons";
import { createFolder, createMaterial, deleteMaterial, deleteFolder, updateFolder } from "../../../feature/course/services/materialsApi";

export default function InstructorCourseMaterials() {
    const { course, courseId, refreshMaterials } = useOutletContext();
    const [showAddFolder, setShowAddFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [newFolderDescription, setNewFolderDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const handleUpload = async (folderId, files) => {
        setUploadError(null);
        const failedFiles = [];
        for (const file of files) {
            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("Title", file.name);
                if (folderId != null) {
                    formData.append("FolderId", folderId);
                }
                formData.append("CourseId", courseId);

                await createMaterial(formData);
            } catch (err) {
                console.error("Failed to upload material:", err);
                failedFiles.push({ name: file.name, error: err.message });
            }
        }
        if (failedFiles.length > 0) {
            setUploadError(
                `Failed to upload: ${failedFiles.map((f) => `${f.name} (${f.error})`).join(", ")}`
            );
        }
        // Refresh from API to get the updated list
        await refreshMaterials();
    };

    const handleDeleteMaterial = async (materialId) => {
        try {
            await deleteMaterial(materialId);
            await refreshMaterials();
        } catch (err) {
            console.error("Failed to delete material:", err);
        }
    };

    const handleDeleteFolder = async (folderId) => {
        try {
            await deleteFolder(folderId);
            await refreshMaterials();
        } catch (err) {
            console.error("Failed to delete folder:", err);
        }
    };

    const handleEditFolder = async (folderId, name, description) => {
        try {
            await updateFolder(folderId, { name, description });
            await refreshMaterials();
        } catch (err) {
            console.error("Failed to update folder:", err);
        }
    };

    const handleAddFolder = async () => {
        if (!newFolderName.trim()) return;
        setIsSubmitting(true);
        try {
            await createFolder({
                name: newFolderName.trim(),
                description: newFolderDescription.trim() || null,
                courseId,
            });
            setNewFolderName("");
            setNewFolderDescription("");
            setShowAddFolder(false);
            await refreshMaterials();
        } catch (err) {
            console.error("Failed to create folder:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setNewFolderName("");
        setNewFolderDescription("");
        setShowAddFolder(false);
    };

    const displayFolders = course.folders || [];

    return (
        <>
            {/* Add Folder Button */}
            <Button 
                variant="primary" 
                onClick={() => setShowAddFolder(true)}
                className="fixed bottom-5 right-5 z-50 group"
            >
                <PlusIcon size={24} />
                <span className="max-w-0 -ml-2 group-hover:ml-0 overflow-hidden group-hover:max-w-40 transition-all! duration-300! whitespace-nowrap">
                    Add New Folder
                </span>
            </Button>

            {/* Add Folder Popup */}
            {showAddFolder && (
                <ModelOverlay onClose={handleCancel}>
                    <div className="w-full max-w-lg bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark overflow-hidden shadow-xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border-tertiary-default-light dark:border-border-tertiary-default-dark bg-linear-to-r from-bg-surface-secondary-default-light/50 to-transparent dark:from-bg-surface-secondary-default-dark/50">
                            <h3 className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                Add New Folder
                            </h3>
                            <button
                                onClick={handleCancel}
                                className="p-2 rounded-lg text-icon-secondary-default-light dark:text-icon-secondary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark hover:text-icon-primary-default-light dark:hover:text-icon-primary-default-dark transition-all"
                            >
                                <XIcon size={20} />
                            </button>
                        </div>

                        <div className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-1.5">
                                    Folder Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder={`e.g. Week ${displayFolders.length + 1} - ${course.title}`}
                                    autoFocus
                                    className="w-full px-3 py-2.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark outline-none focus:border-border-primary-focus-light dark:focus:border-border-primary-focus-dark transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    value={newFolderDescription}
                                    onChange={(e) => setNewFolderDescription(e.target.value)}
                                    placeholder="Brief description of the folder contents..."
                                    rows={3}
                                    className="w-full px-3 py-2.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark outline-none focus:border-border-primary-focus-light dark:focus:border-border-primary-focus-dark transition-colors resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button variant="secondary" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleAddFolder}
                                    disabled={!newFolderName.trim() || isSubmitting}
                                >
                                    <PlusIcon size={18} />
                                    {isSubmitting ? "Creating..." : "Add Folder"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </ModelOverlay>
            )}

            {/* Upload Error Banner */}
            {uploadError && (
                <div className="mt-4 flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                    <p>{uploadError}</p>
                    <button
                        onClick={() => setUploadError(null)}
                        className="shrink-0 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                        <XIcon size={16} />
                    </button>
                </div>
            )}

            {/* Folder List */}
            {displayFolders.length === 0 ? (
                <div className="mt-10 flex flex-col items-center justify-center py-16 text-center">
                    <h3 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
                        No folders added yet
                    </h3>
                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-md mb-6">
                        Start building your course by adding a folder and uploading materials.
                    </p>
                    <Button variant="primary" onClick={() => setShowAddFolder(true)}>
                        <PlusIcon size={18} />
                        Add First Folder
                    </Button>
                </div>
            ) : (
                displayFolders.map((folder) => (
                    <InstructorWeekMaterials
                        key={folder.materialFolderId}
                        folder={folder}
                        onUpload={handleUpload}
                        onDeleteMaterial={handleDeleteMaterial}
                        onDeleteFolder={handleDeleteFolder}
                        onEditFolder={handleEditFolder}
                    />
                ))
            )}
        </>
    );
}
