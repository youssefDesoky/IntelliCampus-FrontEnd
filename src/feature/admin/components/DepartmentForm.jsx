import { useState } from "react";
import InputItem from "../../../components/form/InputItem";
import SelectBox from "../../../components/ui/SelectBox";
import Button from "../../../components/ui/Button";
import TextArea from "../../../components/ui/TextArea";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import { XIcon } from "../../../components/ui/icons";

const emptyInstructorOption = { value: "", label: "No head instructor" };

export default function DepartmentForm({ onClose, onSubmit, initialData = {}, instructors = [], isLoading = false, isOpen = true }) {
    const isEdit = !!initialData.id;
    const professors = instructors.filter((instructor) => instructor.role === "Professor");
    const instructorOptions = [
        emptyInstructorOption,
        ...professors.map((instructor) => ({
            value: String(instructor.instructorId),
            label: instructor.name,
        })),
    ];

    const [selectedInstructor, setSelectedInstructor] = useState(() => {
        if (initialData.instructorId) {
            return instructorOptions.find(option => option.value === String(initialData.instructorId)) || emptyInstructorOption;
        }
        return emptyInstructorOption;
    });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const formData = Object.fromEntries(new FormData(e.target));
        const departmentName = (formData.departmentName || "").trim();

        if (!departmentName) {
            setError("Department name is required");
            return;
        }

        try {
            await onSubmit({
                departmentName,
                departmentNameAr: (formData.departmentNameAr || "").trim(),
                description: (formData.description || "").trim(),
                instructorId: selectedInstructor.value || null,
            });
            onClose();
        } catch (err) {
            setError(err.message || "An error occurred");
        }
    };

    return (
        <BaseFormComponent
            isOpen={isOpen}
            title={`${isEdit ? "Edit" : "Create New"} Department`}
            description={isEdit ? "Update the department details below." : "Fill in the details below to add a new department to the system."}
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText={isEdit ? (isLoading ? "Saving..." : "Update Department") : (isLoading ? "Saving..." : "Create Department")}
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
                        label="Department Name"
                        type="text"
                        name="departmentName"
                        placeholder="e.g., Computer Science"
                        defaultValue={initialData.departmentName || ""}
                        required
                    />

                    <InputItem
                        label="Department Name (Arabic)"
                        type="text"
                        name="departmentNameAr"
                        placeholder="مثال: علوم الحاسب"
                        defaultValue={initialData.departmentNameAr || ""}
                        dir="rtl"
                    />

                    <SelectBox
                        className="w-full"
                        label="Head Instructor"
                        name="instructorId"
                        labelDirection="flex-col"
                        options={instructorOptions}
                        selectedOption={selectedInstructor}
                        onChange={setSelectedInstructor}
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2 text-text-primary-default-light dark:text-text-primary-default-dark">
                        Description
                    </label>
                    <TextArea
                        id="description"
                        name="description"
                        className="w-full px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md focus:outline-none focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark"
                        placeholder="Describe the department focus and scope"
                        defaultValue={initialData.description || ""}
                    />
                </div>
            </div>
        </BaseFormComponent>
    );
}