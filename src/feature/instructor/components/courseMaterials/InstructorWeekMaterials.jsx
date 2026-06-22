import { useState, useRef } from "react";
import Button from "../../../../components/ui/Button";
import TextArea from "../../../../components/ui/TextArea";
import Dialog from "../../../../components/ui/Dialog";
import ModelOverlay from "../../../../components/ui/ModelOverlay";
import InstructorWeekMaterialContent from "./InstructorWeekMaterialContent";
import { CloudUploadIcon, DownloadIcon, FileLinesIcon, FilePenIcon, PlusIcon, TrashIcon, XIcon, FileSlashIcon } from "../../../../components/ui/icons";
import { useError } from '../../../../contexts/ErrorContext.jsx';
import { getMaterialDownloadUrl } from "../../../course/services/materialsApi";
    // Download all materials logic
    function downloadAllMaterials(materials) {
        materials.forEach((material, idx) => {
            const url = material.materialId ? getMaterialDownloadUrl(material.materialId) : material.fileUrl;
            if (url) {
                const link = document.createElement('a');
                link.href = url;
                link.download = material.title || `material-${idx+1}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    }

export default function InstructorWeekMaterials({ folder, onUpload, onDeleteMaterial, onDeleteFolder, onEditFolder }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // eslint-disable-line no-unused-vars
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const materials = folder.materials || [];
    const { showError } = useError();

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            setIsUploading(true);
            onUpload?.(folder.materialFolderId, files).finally(() => setIsUploading(false));
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setIsUploading(true);
            onUpload?.(folder.materialFolderId, files).finally(() => setIsUploading(false));
        }
        e.target.value = "";
    };

    const openEditModal = () => {
        setEditName(folder.name || "");
        setEditDescription(folder.description || "");
        setShowEditModal(true);
    };

    const handleEditSubmit = async () => {
        if (!editName.trim()) return;
        setIsEditSubmitting(true);
        try {
            await onEditFolder?.(folder.materialFolderId, editName.trim(), editDescription.trim() || null);
            setShowEditModal(false);
        } catch (err) {
            showError(err.message);
        } finally {
            setIsEditSubmitting(false);
        }
    };

    return (
        <>
        <div className="mt-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark overflow-hidden hover:shadow-lg dark:hover:shadow-shadow-dark">
            {/* Hidden file input — always in the DOM */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.ppt,.pptx,.mp4,.mkv,.avi,.mov,.webm,.mp3,.wav,.ogg,.flac,.aac,.doc,.docx,.xls,.xlsx,.txt,.rtf,.jpg,.jpeg,.png,.gif,.svg,.webp,.bmp,.zip,.rar"
            />
            {/* Week Header */}
            <div className="p-6 md:p-8 bg-linear-to-r from-bg-surface-secondary-default-light/50 to-transparent dark:from-bg-surface-secondary-default-dark/50 border-b border-border-tertiary-default-light dark:border-border-tertiary-default-dark">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center justify-between gap-3 mb-2">
                            <h3 className="text-xl md:text-2xl font-bold truncate text-text-primary-default-light dark:text-text-primary-default-dark">
                                {folder.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 w-fit text-nowrap rounded-full text-sm font-semibold bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark">
                                    {materials.length} {materials.length === 1 ? 'item' : 'items'}
                                </span>
                                {onEditFolder && (
                                    <button
                                        onClick={openEditModal}
                                        className="p-2 rounded-lg hover:bg-bg-surface-primary-hover-light dark:hover:bg-bg-surface-primary-hover-dark text-icon-tertiary-default-light dark:text-icon-tertiary-default-dark hover:text-icon-accent-default-light dark:hover:text-icon-accent-default-dark transition-all duration-200"
                                        aria-label="Edit folder"
                                        title="Edit folder"
                                    >
                                        <FilePenIcon size={18} />
                                    </button>
                                )}
                                {onDeleteFolder && (
                                    <button
                                        onClick={() => setShowDeleteDialog(true)}
                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-icon-tertiary-default-light dark:text-icon-tertiary-default-dark hover:text-red-500 dark:hover:text-red-400 transition-all duration-200"
                                        aria-label="Delete folder"
                                        title="Delete folder"
                                    >
                                        <TrashIcon size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                        {folder.description && (
                            <p className="text-base text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-3xl">
                                {folder.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Materials List */}
            <div className="p-2 md:p-4">
                {materials.length === 0 && !isUploadOpen ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-bg-surface-tertiary-default-light dark:bg-bg-surface-tertiary-default-dark flex items-center justify-center mb-4">
                            <FileSlashIcon size={24} className="text-icon-tertiary-default-light dark:text-icon-tertiary-default-dark" />
                        </div>
                        <h4 className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
                            No materials yet
                        </h4>
                        <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-md mb-4">
                            Upload lecture notes, slides, videos, or any resources for this week.
                        </p>
                        <Button variant="primary" onClick={() => { setIsUploadOpen(true); fileInputRef.current?.click(); }}>
                            <CloudUploadIcon size={20} />
                            Upload Materials
                        </Button>
                    </div>
                ) : (
                    <ul className="flex flex-col divide-y divide-border-tertiary-default-light dark:divide-border-tertiary-default-dark">
                        {materials.map((material, index) => (
                            <InstructorWeekMaterialContent
                                key={material.materialId || index}
                                material={material}
                                isFirst={index === 0}
                                onDelete={(materialId) => onDeleteMaterial?.(materialId)}
                            />
                        ))}
                    </ul>
                )}
            </div>

            {/* Upload Zone */}
            {(isUploadOpen || materials.length > 0) && (
                <div className="px-4 md:px-6 pb-4">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-200
                            ${isDragOver
                                ? "border-border-accent-default-light dark:border-border-accent-default-dark bg-bg-surface-accent-default-light/10 dark:bg-bg-surface-accent-default-dark/10"
                                : "border-border-tertiary-default-light dark:border-border-tertiary-default-dark hover:border-border-primary-focus-light dark:hover:border-border-primary-focus-dark hover:bg-bg-surface-secondary-default-light/50 dark:hover:bg-bg-surface-secondary-default-dark/50"
                            }`}
                    >
                        <CloudUploadIcon size={28} className={`mb-2 ${isDragOver ? "text-text-accent-default-light dark:text-text-accent-default-dark" : "text-icon-tertiary-default-light dark:text-icon-tertiary-default-dark"}`} />
                        <p className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                            {isDragOver ? "Drop files here" : "Drag & drop files here"}
                        </p>
                        <p className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark mt-1">
                            or click to browse — PDF, PPTX, MP4, MP3, and more
                        </p>
                    </div>
                </div>
            )}

            {/* Footer */}
            {materials.length > 0 && (
                <div className="px-6 md:px-8 py-4 border-t border-border-tertiary-default-light dark:border-border-tertiary-default-dark bg-bg-surface-secondary-default-light/30 dark:bg-bg-surface-secondary-default-dark/30">
                    <div className="flex flex-row items-center justify-between gap-3">
                        <p className="text-sm text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                            {materials.length} {materials.length === 1 ? 'file' : 'files'}
                        </p>
                        <Button variant="primary" onClick={() => downloadAllMaterials(materials)}>
                            <DownloadIcon size={18} />
                            Download All
                        </Button>
                    </div>
                </div>
            )}
        </div>

        {/* Delete Folder Confirmation Dialog */}
        <Dialog
            isOpen={showDeleteDialog}
            variant="warning"
            title="Delete Folder"
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={() => {
                onDeleteFolder?.(folder.materialFolderId);
                setShowDeleteDialog(false);
            }}
            confirmText="Delete"
            cancelText="Cancel"
        >
            Are you sure you want to delete &ldquo;{folder.name}&rdquo;{materials.length > 0 ? ` and its ${materials.length} material${materials.length > 1 ? 's' : ''}` : ''}? This action cannot be undone.
        </Dialog>

        {/* Edit Folder Modal */}
        {showEditModal && (
            <ModelOverlay onClose={() => setShowEditModal(false)}>
                <div className="w-full max-w-lg bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark overflow-hidden shadow-xl">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border-tertiary-default-light dark:border-border-tertiary-default-dark bg-linear-to-r from-bg-surface-secondary-default-light/50 to-transparent dark:from-bg-surface-secondary-default-dark/50">
                        <h3 className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                            Edit Folder
                        </h3>
                        <button
                            onClick={() => setShowEditModal(false)}
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
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                autoFocus
                                className="w-full px-3 py-2.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark outline-none focus:border-border-primary-focus-light dark:focus:border-border-primary-focus-dark transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-1.5">
                                Description
                            </label>
                            <TextArea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark outline-none focus:border-border-primary-focus-light dark:focus:border-border-primary-focus-dark transition-colors"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleEditSubmit}
                                disabled={!editName.trim() || isEditSubmitting}
                            >
                                <FilePenIcon size={18} />
                                {isEditSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </div>
            </ModelOverlay>
        )}
        </>
    );
}
