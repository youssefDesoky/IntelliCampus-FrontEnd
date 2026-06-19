import { useState, useRef } from "react";
import InputItem from "../../../components/form/InputItem";

import Button from "../../../components/ui/Button";
import TextArea from "../../../components/ui/TextArea";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import { CloudUploadIcon } from "../../../components/ui/icons";
import { useError } from '../../../contexts/ErrorContext.jsx';

export default function BylawForm({ onClose, onSubmit, initialData = {}, isLoading = false, isOpen = true }) {
    const { showError } = useError();
    const isEdit = !!initialData.bylawId;
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        const name = (formData.name || "").trim();

        if (!name) {
            showError("Bylaw name is required");
            return;
        }

        const payload = {
            name,
            nameAr: (formData.nameAr || "").trim(),
            description: (formData.description || "").trim(),
            descriptionAr: (formData.descriptionAr || "").trim(),
        };

        try {
            await onSubmit({ ...payload, _file: selectedFile || null });
            onClose();
        } catch (err) {
            showError(err.message || "An error occurred");
        }
    };

    return (
        <BaseFormComponent
            isOpen={isOpen}
            title={`${isEdit ? "Edit" : "Create New"} Bylaw`}
            description={isEdit ? "Update the bylaw details below." : "Create a new academic bylaw."}
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText={isEdit ? (isLoading ? "Saving..." : "Update Bylaw") : (isLoading ? "Saving..." : "Create Bylaw")}
            submitLoading={isLoading}
        >
            <div className="space-y-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputItem
                        label="Bylaw Name"
                        type="text"
                        name="name"
                        placeholder="e.g., Credit Hour System"
                        defaultValue={initialData.name || ""}
                        required
                    />
                    <div dir="rtl">
                        <InputItem
                            label="اسم اللائحة"
                            type="text"
                            name="nameAr"
                            placeholder="نظام الساعات المعتمدة"
                            defaultValue={initialData.nameAr || ""}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2 text-text-primary-default-light dark:text-text-primary-default-dark">
                        Description
                    </label>
                    <TextArea
                        id="description"
                        name="description"
                        className="w-full px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md focus:outline-none focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark"
                        placeholder="Describe the bylaw purpose and scope"
                        defaultValue={initialData.description || ""}
                    />
                </div>

                <div dir="rtl">
                    <label htmlFor="descriptionAr" className="block text-sm font-medium mb-2 text-text-primary-default-light dark:text-text-primary-default-dark">
                        الوصف
                    </label>
                    <TextArea
                        id="descriptionAr"
                        name="descriptionAr"
                        className="w-full px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md focus:outline-none focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark"
                        placeholder="وصف الغرض من اللائحة ونطاقها"
                        defaultValue={initialData.descriptionAr || ""}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-text-primary-default-light dark:text-text-primary-default-dark">
                        Upload Document
                    </label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg p-4 text-center hover:border-border-accent-default-light dark:hover:border-border-accent-default-dark transition-colors"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="hidden"
                        />
                        {selectedFile ? (
                            <div className="flex items-center justify-center gap-2 text-sm">
                                <CloudUploadIcon className="w-5 h-5 text-text-accent-default-light dark:text-text-accent-default-dark" />
                                <span className="text-text-primary-default-light dark:text-text-primary-default-dark">{selectedFile.name}</span>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                    className="text-text-danger-default-light dark:text-text-danger-default-dark hover:underline text-xs"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                <CloudUploadIcon className="w-5 h-5" />
                                Click to upload a bylaw document (PDF, DOC)
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BaseFormComponent>
    );
}
