import { useState, useEffect } from "react";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import Button from "../../../components/ui/Button";
import NumberInput from "../../../components/form/NumberInput";
import { PlusIcon, TrashIcon, XIcon } from "../../../components/ui/icons";
import { fetchSpecializations, createSpecialization, deleteSpecialization } from "../services/adminApi";
import { useError } from '../../../contexts/ErrorContext.jsx';

export default function DepartmentSpecializationsForm({ department, onClose, onUpdate }) {
    const { showError } = useError();
    const [specializations, setSpecializations] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNameAr, setNewNameAr] = useState("");
    const [newMaxCapacity, setNewMaxCapacity] = useState("");
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    const departmentId = department?.id ?? department?.departmentId;

    const loadSpecializations = async () => {
        try {
            setLoading(true);
            const data = await fetchSpecializations(departmentId);
            setSpecializations(Array.isArray(data) ? data : []);
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (departmentId) loadSpecializations();
    }, [departmentId]);

    const handleAdd = async () => {
        const name = newName.trim();
        const nameAr = newNameAr.trim();
        if (!name) return;
        try {
            setAdding(true);
            const maxCap = newMaxCapacity ? parseInt(newMaxCapacity) : null;
            const created = await createSpecialization(departmentId, { name, nameAr: nameAr || null, maxCapacity: maxCap });
            setSpecializations(prev => [...prev, created]);
            setNewName("");
            setNewNameAr("");
            setNewMaxCapacity("");
            onUpdate?.();
        } catch (err) {
            showError(err.message);
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (specId) => {
        try {
            await deleteSpecialization(departmentId, specId);
            setSpecializations(prev => prev.filter(s => (s.id ?? s.specializationId) !== specId));
            onUpdate?.();
        } catch (err) {
            showError(err.message);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <ModelOverlay onClose={onClose} maxWidth="max-w-lg">
            <div className="relative z-50 w-full rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-[0_32px_80px_-12px_rgba(0,0,0,0.28)] flex flex-col max-h-[75vh]">
                <div className="shrink-0 flex items-center justify-between gap-4 border-b border-border-primary-default-light px-3 sm:px-6 py-4 dark:border-border-primary-default-dark">
                    <div className="min-w-0 truncate">
                        <h3 className="text-xl font-semibold truncate text-text-primary-default-light dark:text-text-primary-default-dark">
                            Set Specializations
                        </h3>
                        <p className="mt-1 text-sm truncate text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            {department?.departmentName || departmentId}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-border-primary-default-light bg-bg-surface-secondary-default-light p-2 text-icon-secondary-default-light transition-colors hover:bg-bg-surface-secondary-hover-light dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-icon-secondary-default-dark dark:hover:bg-bg-surface-secondary-hover-dark"
                        aria-label="Close"
                    >
                        <XIcon size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {loading ? (
                        <p className="text-center py-8 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            Loading specializations...
                        </p>
                    ) : (
                        <>
                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Enter English name"
                                        className="w-full px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md focus:outline-none focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark text-sm"
                                    />
                                    <div dir="rtl">
                                        <input
                                            type="text"
                                            value={newNameAr}
                                            onChange={(e) => setNewNameAr(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="اسم التخصص بالعربية"
                                            className="w-full px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md focus:outline-none focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark text-sm"
                                        />
                                    </div>
                                    <NumberInput
                                        value={newMaxCapacity}
                                        onChange={(e) => setNewMaxCapacity(e.target.value)}
                                        placeholder="Max capacity (optional)"
                                        min="0"
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        variant="primary"
                                        onClick={handleAdd}
                                        disabled={!newName.trim() || adding}
                                        loading={adding}
                                        className="w-full sm:w-auto"
                                    >
                                        <PlusIcon size={18} />
                                        Add Specialization
                                    </Button>
                                </div>
                            </div>

                            {specializations.length === 0 ? (
                                <p className="text-center py-8 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                    No specializations yet. Add one above.
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {specializations.map((spec) => {
                                        const specId = spec.id ?? spec.specializationId;
                                        return (
                                            <li
                                                key={specId}
                                                className="flex items-center justify-between px-3 py-2 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark"
                                            >
                                                <div className="flex flex-col text-left">
                                                    <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
                                                        {spec.name}
                                                    </span>
                                                    {spec.nameAr && (
                                                        <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark" dir="rtl">
                                                            {spec.nameAr}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(specId)}
                                                    className="p-1 rounded-md text-icon-secondary-default-light dark:text-icon-secondary-default-dark hover:bg-bg-status-error-light dark:hover:bg-bg-status-error-dark hover:text-text-status-error-light dark:hover:text-text-status-error-dark transition-colors"
                                                    aria-label={`Delete ${spec.name}`}
                                                >
                                                    <TrashIcon size={16} />
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </>
                    )}
                </div>

                <div className="shrink-0 flex justify-end border-t border-border-primary-default-light px-3 sm:px-6 py-4 dark:border-border-primary-default-dark">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </ModelOverlay>
    );
}
