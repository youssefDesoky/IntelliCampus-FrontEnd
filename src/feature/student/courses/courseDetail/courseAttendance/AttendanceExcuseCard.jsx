import { useRef, useState } from "react";
import Button from "../../../../../components/ui/Button";
import TextArea from "../../../../../components/ui/TextArea";
import BaseComponent from "../../../../../components/ui/BaseComponent";
import BaseFormComponent from "../../../../../components/ui/BaseFormComponent";
import { CloudUploadIcon, FileLinesIcon, FileIcon, TrashIcon, PaperclipIcon } from "../../../../../components/ui/icons";
import { useError } from '../../../../../contexts/ErrorContext.jsx';

export default function AttendanceExcuseCard() {
    const fileInputRef = useRef(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [reason, setReason] = useState("");
    const { showError } = useError();

    const openForm = () => {
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedFile(null);
        setReason("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const handleSubmit = () => {
        if (!reason.trim() || !selectedFile) {
            showError("Please add a reason and attach a supporting file before submitting.");
            return;
        }

        closeForm();
    };

    return (
        <BaseComponent
            className="hidden sm:flex lg:col-span-1 h-full flex-col"
            contentClassName="flex flex-1 flex-col justify-center"
            title="Quick Action"
            description="Submit an attendance excuse request directly from this page."
            componentButton={<span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark">Fast track</span>}
        >
            <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-accent-active-light dark:text-text-accent-active-dark shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                            <path d="M13 2v7h7" />
                        </svg>
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary-light dark:text-text-secondary-dark">Attendance excuse</p>
                        <p className="mt-2 text-xl font-bold leading-tight text-text-primary-light dark:text-text-primary-dark">
                            Need to explain a missed session?
                        </p>
                        <p className="mt-2 text-sm leading-6 text-text-secondary-light dark:text-text-secondary-dark">
                            Send an excuse request, add context, and keep your attendance record organized.
                        </p>
                    </div>
                </div>
                
                <Button
                    variant="primary"
                    startIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M13 2v7h7" /></svg>}
                    className="w-full justify-center"
                    onClick={openForm}
                >
                    Request Excuse
                </Button>
            </div>

            <BaseFormComponent
                isOpen={isFormOpen}
                title="Request an excuse"
                description="Add a supporting file and explain the reason for your absence or delay."
                onClose={closeForm}
                onSubmit={handleSubmit}
                submitText="Submit Request"
                cancelText="Cancel"
                maxWidth="max-w-xl"
                contentClassName="space-y-6"
            >
                <div className="space-y-4">
                    <label className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                            <FileLinesIcon size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                            Reason for excuse
                        </span>
                        <TextArea
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            placeholder="Explain why you missed the session and any relevant details..."
                            className="w-full rounded-2xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 text-sm text-text-primary-light outline-none transition-all placeholder:text-text-secondary-light focus:border-border-accent-default-light focus:ring-4 focus:ring-accent-500/10 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-text-primary-dark dark:placeholder:text-text-secondary-dark"
                        />
                    </label>

                    <div className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                            <PaperclipIcon size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                            Supporting document
                        </span>
                        
                        {!selectedFile ? (
                            <label className="group flex flex-col items-center justify-center w-full min-h-36 rounded-2xl border-2 border-dashed border-border-primary-default-light bg-bg-surface-secondary-default-light hover:bg-bg-surface-primary-hover-light hover:border-border-accent-default-light transition-all dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:hover:bg-bg-surface-primary-hover-dark">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-fill-secondary-default-light group-hover:scale-110 transition-transform duration-200 dark:bg-bg-fill-secondary-default-dark mb-3">
                                    <CloudUploadIcon size={24} className="text-text-secondary-light dark:text-text-secondary-dark" />
                                </div>
                                <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                                    Click to upload or drag and drop
                                </p>
                                <p className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark text-center">
                                    PDF, PNG, JPG, or DOC (max. 10MB)
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                    onChange={handleFileChange}
                                />
                            </label>
                        ) : (
                            <div className="flex items-center justify-between p-4 rounded-2xl border border-border-primary-default-light bg-bg-surface-primary-default-light shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all dark:border-border-primary-default-dark dark:bg-bg-surface-primary-default-dark">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg-surface-accent-default-light text-text-accent-active-light dark:bg-bg-surface-accent-default-dark dark:text-text-accent-active-dark">
                                        <FileIcon size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate text-text-primary-light dark:text-text-primary-dark">{selectedFile.name}</p>
                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                                            {selectedFile.size ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={() => setSelectedFile(null)}
                                    className="shrink-0 text-text-danger-default-light hover:bg-bg-surface-danger-default-light dark:text-text-danger-default-dark dark:hover:bg-bg-surface-danger-default-dark"
                                >
                                    <TrashIcon size={18} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </BaseFormComponent>
        </BaseComponent>
    );
}