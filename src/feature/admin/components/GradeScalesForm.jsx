import { useState } from "react";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import Button from "../../../components/ui/Button";
import { PlusIcon, TrashIcon } from "../../../components/ui/icons";

const defaultGradeScale = { gradeLetter: "", minPercentage: 0, gpaValue: 0, sortOrder: 0 };

const inputClass = "w-full px-2 py-1.5 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-sm text-text-primary-default-light dark:text-text-primary-default-dark focus:outline-none focus:border-border-primary-active-light";

function GradeScaleCard({ scale, index, onChange, onRemove }) {
    return (
        <div className="grid grid-cols-5 gap-3 items-end p-3 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg">
            <div>
                <label className="block text-xs font-medium mb-1 text-text-secondary-default-light dark:text-text-secondary-default-dark">Grade</label>
                <input type="text" value={scale.gradeLetter} onChange={(e) => onChange(index, "gradeLetter", e.target.value)} placeholder="A" className={inputClass} />
            </div>
            <div>
                <label className="block text-xs font-medium mb-1 text-text-secondary-default-light dark:text-text-secondary-default-dark">Min %</label>
                <input type="number" step="0.01" value={scale.minPercentage} onChange={(e) => onChange(index, "minPercentage", e.target.value)} placeholder="90" className={inputClass} />
            </div>
            <div>
                <label className="block text-xs font-medium mb-1 text-text-secondary-default-light dark:text-text-secondary-default-dark">GPA</label>
                <input type="number" step="0.01" value={scale.gpaValue} onChange={(e) => onChange(index, "gpaValue", e.target.value)} placeholder="4.0" className={inputClass} />
            </div>
            <div>
                <label className="block text-xs font-medium mb-1 text-text-secondary-default-light dark:text-text-secondary-default-dark">Order</label>
                <input type="number" value={scale.sortOrder} onChange={(e) => onChange(index, "sortOrder", parseInt(e.target.value) || 0)} className={inputClass} />
            </div>
            <div className="flex justify-center">
                <Button variant="danger" type="button" onClick={() => onRemove(index)}>
                    <TrashIcon size={16} />
                </Button>
            </div>
        </div>
    );
}

export default function GradeScalesForm({ onClose, onSubmit, initialData = {}, isLoading = false, isOpen = true }) {
    const [gradeScales, setGradeScales] = useState(() => {
        if (initialData.gradeScales && initialData.gradeScales.length > 0) {
            return initialData.gradeScales.map((g, i) => ({ ...g, sortOrder: i + 1 }));
        }
        return [];
    });
    const [error, setError] = useState(null);

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

        const validGradeScales = gradeScales.filter(g => g.gradeLetter.trim() !== "");
        if (validGradeScales.length === 0) {
            setError("At least one grade scale is required");
            return;
        }

        try {
            await onSubmit({ gradeScales: validGradeScales.map(g => ({
                gradeLetter: g.gradeLetter,
                minPercentage: parseFloat(g.minPercentage) || 0,
                gpaValue: parseFloat(g.gpaValue) || 0,
                sortOrder: g.sortOrder,
            })) });
            onClose();
        } catch (err) {
            setError(err.message || "An error occurred");
        }
    };

    return (
        <BaseFormComponent
            isOpen={isOpen}
            title={`Grade Scales - ${initialData.name || "Bylaw"}`}
            description="Manage the grade scale mappings for this bylaw."
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText={isLoading ? "Saving..." : "Save Grade Scales"}
            submitLoading={isLoading}
        >
            <div className="mb-6">
                {error && (
                    <div className="mb-3 bg-bg-status-error-light dark:bg-bg-status-error-dark text-text-status-error-light dark:text-text-status-error-dark p-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
                        {gradeScales.length} grade scale{gradeScales.length !== 1 ? "s" : ""}
                    </span>
                    {gradeScales.length >= 18 ? (
                        <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Max grade scales reached</span>
                    ) : (
                        <Button variant="secondary" type="button" onClick={addGradeScale}>
                            <PlusIcon size={16} />
                            Add Grade Scale
                        </Button>
                    )}
                </div>

                {gradeScales.length === 0 ? (
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-4 text-center border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg">
                        No grade scales defined. Click "Add Grade Scale" to add one.
                    </p>
                ) : (() => {
                    const maxPerColumn = 6;
                    const maxColumns = 3;
                    const cols = [];
                    for (let i = 0; i < gradeScales.length; i += maxPerColumn) {
                        if (cols.length < maxColumns - 1) {
                            cols.push(gradeScales.slice(i, i + maxPerColumn));
                        } else {
                            cols.push(gradeScales.slice(i));
                            break;
                        }
                    }
                    const gridClass = cols.length === 1 ? "grid-cols-1" : cols.length === 2 ? "grid-cols-2" : "grid-cols-3";
                    return (
                        <div className={`grid ${gridClass} gap-4`}>
                            {cols.map((col, colIdx) => (
                                <div key={colIdx} className="space-y-3">
                                    {col.map((scale) => {
                                        const origIndex = gradeScales.indexOf(scale);
                                        return (
                                            <GradeScaleCard key={origIndex} scale={scale} index={origIndex} onChange={updateGradeScale} onRemove={removeGradeScale} />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    );
                })()}
            </div>
        </BaseFormComponent>
    );
}
