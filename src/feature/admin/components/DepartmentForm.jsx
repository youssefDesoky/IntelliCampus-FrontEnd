import { useState } from "react";
import InputItem from "../../../components/form/InputItem";
import NumberInput from "../../../components/form/NumberInput";
import SelectBox from "../../../components/ui/SelectBox";
import Button from "../../../components/ui/Button";
import TextArea from "../../../components/ui/TextArea";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import { XIcon } from "../../../components/ui/icons";
import { useError } from '../../../contexts/ErrorContext.jsx';

const emptyInstructorOption = { value: "", label: "No head instructor" };

export default function DepartmentForm({ onClose, onSubmit, initialData = {}, instructors = [], isLoading = false, isOpen = true }) {
    const { showError } = useError();
    const isEdit = !!(initialData.id ?? initialData.departmentId);
    const instructorOptions = [
        emptyInstructorOption,
        ...instructors.map((instructor) => ({
            value: String(instructor.userId),
            label: instructor.fullName || instructor.name,
        })),
    ];

    const [selectedInstructor, setSelectedInstructor] = useState(() => {
        if (initialData.instructorId) {
            return instructorOptions.find(option => option.value === String(initialData.instructorId)) || emptyInstructorOption;
        }
        return emptyInstructorOption;
    });
    const [maxCapacity, setMaxCapacity] = useState(initialData.maxCapacity ?? "");
    const handleSubmit = async (e) => {
        e.preventDefault();
        const departmentName = ((e.target.departmentName?.value) || "").trim();

        if (!departmentName) {
            showError("Department name is required");
            return;
        }

        try {
            await onSubmit({
                departmentName,
                departmentNameAr: ((e.target.departmentNameAr?.value) || "").trim(),
                description: ((e.target.description?.value) || "").trim(),
                descriptionAr: ((e.target.descriptionAr?.value) || "").trim(),
                instructorId: selectedInstructor.value || null,
                maxCapacity: maxCapacity ? parseInt(maxCapacity) : null,
            });
        } catch (err) {
            showError(err.message || "An error occurred");
        }
    };

    return (
        <BaseFormComponent
            isOpen={isOpen}
            title={`${isEdit ? "Edit" : "Create New"} Department`}
            description={isEdit ? "Update the department details below." : "Fill in the details below to add a new department to the system."}
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText={isEdit ? (isLoading ? "Saving..." : "Save Changes") : (isLoading ? "Saving..." : "Create Department")}
            submitLoading={isLoading}
        >
            <div className="space-y-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputItem
                        label="Department Name"
                        type="text"
                        name="departmentName"
                        placeholder="e.g., Computer Science"
                        defaultValue={initialData.departmentName || ""}
                        required
                    />

                    <div dir="rtl">
                        <InputItem
                            label="اسم القسم"
                            type="text"
                            name="departmentNameAr"
                            placeholder="علوم الحاسب"
                            defaultValue={initialData.departmentNameAr || ""}
                        />
                    </div>
                </div>

                <SelectBox
                    className="w-full"
                    label="Head Instructor"
                    name="instructorId"
                    labelDirection="flex-col"
                    options={instructorOptions}
                    selectedOption={selectedInstructor}
                    onChange={setSelectedInstructor}
                />

                <NumberInput
                    label="Max Capacity"
                    name="maxCapacity"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    placeholder="Maximum student capacity (optional)"
                    min="0"
                    className="w-full"
                />

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

                <div dir="rtl">
                    <label htmlFor="descriptionAr" className="block text-sm font-medium mb-2 text-text-primary-default-light dark:text-text-primary-default-dark">
                        الوصف
                    </label>
                    <TextArea
                        id="descriptionAr"
                        name="descriptionAr"
                        className="w-full px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md focus:outline-none focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark"
                        placeholder="وصف مجال القسم ونطاقه"
                        defaultValue={initialData.descriptionAr || ""}
                    />
                </div>
            </div>
        </BaseFormComponent>
    );
}