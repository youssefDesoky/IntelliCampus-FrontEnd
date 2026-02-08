import { useState, useRef, useCallback } from "react";
import ModelOverlay from "./ModelOverlay";
import Button from "./Button";
import { CloudUploadIcon, XIcon, FileIcon, TrashIcon, CheckIcon } from "./icons";

const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".xls", ".json"];

function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImportDialog({ title = "Import Data", subtitle, acceptedFormats = ACCEPTED_EXTENSIONS, onClose, onImport }) {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    const acceptString = acceptedFormats.join(",");

    const validateFile = useCallback((f) => {
        const ext = "." + f.name.split(".").pop().toLowerCase();
        if (!acceptedFormats.includes(ext)) {
            setError(`Invalid file type. Accepted formats: ${acceptedFormats.join(", ")}`);
            return false;
        }
        setError("");
        return true;
    }, [acceptedFormats]);

    const handleFile = useCallback((f) => {
        if (validateFile(f)) {
            setFile(f);
        }
    }, [validateFile]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) handleFile(droppedFile);
    };

    const handleInputChange = (e) => {
        const selected = e.target.files?.[0];
        if (selected) handleFile(selected);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = () => {
        if (!file) return;
        if (onImport) onImport(file);
    };

    return (
        <ModelOverlay onClose={onClose}>
            <div className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark w-full p-6 rounded-lg shadow-md">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-semibold">{title}</h2>
                        {subtitle && (
                            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 place-self-start rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 hover:text-gray-800"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Drop Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !file && fileInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors cursor-pointer ${
                        isDragging
                            ? "border-border-accent-default-light dark:border-border-accent-default-dark bg-bg-surface-accent-default-light/50 dark:bg-bg-surface-accent-default-dark/50"
                            : file
                              ? "border-border-success-default-light dark:border-border-success-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark"
                              : "border-border-primary-default-light dark:border-border-primary-default-dark hover:border-border-accent-default-light dark:hover:border-border-accent-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark"
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={acceptString}
                        onChange={handleInputChange}
                        className="hidden"
                    />

                    {!file ? (
                        <>
                            <CloudUploadIcon size={48} className="text-text-secondary-active-light dark:text-text-secondary-active-dark" />
                            <div className="text-center">
                                <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
                                    Drag & drop your file here
                                </p>
                                <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1">
                                    or <span className="text-blue-500 dark:text-blue-400 font-semibold underline cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 transition-colors">browse</span> to choose a file
                                </p>
                            </div>
                            <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                Supported formats: {acceptedFormats.join(", ")}
                            </p>
                        </>
                    ) : (
                        <div className="flex items-center gap-4 w-full">
                            <div className="p-3 rounded-lg bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark">
                                <FileIcon size={28} className="text-text-accent-active-light dark:text-text-accent-active-dark" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-text-primary-default-light dark:text-text-primary-default-dark">
                                    {file.name}
                                </p>
                                <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                    {formatFileSize(file.size)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-text-danger-default-light dark:text-text-danger-default-dark"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <p className="text-xs text-text-danger-default-light dark:text-text-danger-default-dark mt-2">
                        {error}
                    </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={!file}>
                        <CheckIcon className="w-5 h-5" /> Import
                    </Button>
                </div>
            </div>
        </ModelOverlay>
    );
}
