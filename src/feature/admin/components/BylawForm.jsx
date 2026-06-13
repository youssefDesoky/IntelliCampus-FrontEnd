import { useState, useRef } from "react";
import InputItem from "../../../components/form/InputItem";
import Button from "../../../components/ui/Button";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import { PlusIcon, TrashIcon, CloudUploadIcon } from "../../../components/ui/icons";

const defaultGradeScale = { gradeLetter: "", minPercentage: 0, gpaValue: 0, sortOrder: 0 };

export default function BylawForm({ onClose, onSubmit, initialData = {}, isLoading = false, isOpen = true }) {
    const isEdit = !!initialData.bylawId;
    const [gradeScales, setGradeScales] = useState(() => {
        if (initialData.gradeScales && initialData.gradeScales.length > 0) {
            return initialData.gradeScales.map((g, i) => ({ ...g, sortOrder: i + 1 }));
        }
        return [];
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const addGradeScale = () => {
        setGradeScales(prev => [...prev, { ...defaultGradeScale, sortOrder: prev.length + 1 }]);
    };

    const removeGradeScale = (index) => {
        setGradeScales(prev => prev.filter((_, i) => i !== index).map((g, i) => ({ ...g, sortOrder: i + 1 })));
    };

    const updateGradeScale = (index, field, value) => {
        setGradeScales(prev => prev.map((g, i) => i === index ? { ...g, [field]: value } : g));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const formData = Object.fromEntries(new FormData(e.target));
        const name = (formData.name || "").trim();

        if (!name) {
            setError("Bylaw name is required");
            return;
        }

        const validGradeScales = gradeScales.filter(g => g.gradeLetter.trim() !== "");
        const payload = {
            name,
            version: parseInt(formData.version || "1", 10),
            description: (formData.description || "").trim(),
            gradeScales: validGradeScales.length > 0 ? validGradeScales.map(g => ({
                gradeLetter: g.gradeLetter,
                minPercentage: parseFloat(g.minPercentage) || 0,
                gpaValue: parseFloat(g.gpaValue) || 0,
                sortOrder: g.sortOrder,
            })) : null,
        };

        try {
            await onSubmit({ ...payload, _file: selectedFile || null });
            onClose();
        } catch (err) {
            setError(err.message || "An error occurred");
        }
    };

    return (
        <BaseFormComponent
            isOpen={isOpen}
            title={`${isEdit ? "Edit" : "Create New"} Bylaw`}
            description={isEdit ? "Update the bylaw details and grade scales below." : "Create a new academic bylaw with grade scales."}
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText={isEdit ? (isLoading ? "Saving..." : "Update Bylaw") : (isLoading ? "Saving..." : "Create Bylaw")}
            submitLoading={isLoading}
        >
            <div className="space-y-6 mb-6">
                {error && (
                    <div className="bg-bg-status-error-light dark:bg-bg-status-error-dark text-text-status-error-light dark:text-text-status-error-dark p-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    <InputItem
                        label="Bylaw Name"
                        type="text"
                        name="name"
                        placeholder="e.g., Credit Hour System"
                        defaultValue={initialData.name || ""}
                        required
                    />
                    <InputItem
                        label="Version"
                        type="number"
                        name="version"
                        placeholder="1"
                        defaultValue={initialData.version ?? 1}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2 text-text-primary-default-light dark:text-text-primary-default-dark">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows="3"
                        className="w-full px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md focus:outline-none focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark"
                        placeholder="Describe the bylaw purpose and scope"
                        defaultValue={initialData.description || ""}
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

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
                            Grade Scales
                        </label>
                        <Button variant="secondary" type="button" onClick={addGradeScale}>
                            <PlusIcon size={16} />
                            Add Grade Scale
                        </Button>
                    </div>

                    {gradeScales.length === 0 && (
                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-4 text-center border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg">
                            No grade scales defined. Click "Add Grade Scale" to add one.
                        </p>
                    )}

                    <div className="space-y-3">
                        {gradeScales.map((scale, index) => (
                            <div key={index} className="grid grid-cols-5 gap-3 items-end p-3 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg">
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-text-secondary-default-light dark:text-text-secondary-default-dark">Grade</label>
                                    <input
                                        type="text"
                                        value={scale.gradeLetter}
                                        onChange={(e) => updateGradeScale(index, "gradeLetter", e.target.value)}
                                        placeholder="A"
                                        className="w-full px-2 py-1.5 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-sm text-text-primary-default-light dark:text-text-primary-default-dark focus:outline-none focus:border-border-primary-active-light"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-text-secondary-default-light dark:text-text-secondary-default-dark">Min %</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={scale.minPercentage}
                                        onChange={(e) => updateGradeScale(index, "minPercentage", e.target.value)}
                                        placeholder="90"
                                        className="w-full px-2 py-1.5 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-sm text-text-primary-default-light dark:text-text-primary-default-dark focus:outline-none focus:border-border-primary-active-light"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-text-secondary-default-light dark:text-text-secondary-default-dark">GPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={scale.gpaValue}
                                        onChange={(e) => updateGradeScale(index, "gpaValue", e.target.value)}
                                        placeholder="4.0"
                                        className="w-full px-2 py-1.5 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-sm text-text-primary-default-light dark:text-text-primary-default-dark focus:outline-none focus:border-border-primary-active-light"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-text-secondary-default-light dark:text-text-secondary-default-dark">Order</label>
                                    <input
                                        type="number"
                                        value={scale.sortOrder}
                                        onChange={(e) => updateGradeScale(index, "sortOrder", parseInt(e.target.value) || 0)}
                                        className="w-full px-2 py-1.5 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-sm text-text-primary-default-light dark:text-text-primary-default-dark focus:outline-none focus:border-border-primary-active-light"
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <Button
                                        variant="danger"
                                        type="button"
                                        onClick={() => removeGradeScale(index)}
                                    >
                                        <TrashIcon size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </BaseFormComponent>
    );
}
