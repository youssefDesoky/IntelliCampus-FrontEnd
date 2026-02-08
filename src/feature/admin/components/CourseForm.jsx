import { useState } from "react";
import Button from "../../../components/ui/Button";
import { PlusIcon, FilePenIcon, XIcon } from "../../../components/ui/icons";
import InputItem from "../../../components/form/InputItem";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import SelectBox from "../../../components/ui/SelectBox";

const departments = [
    { value: "Computer Science", label: "Computer Science" },
    { value: "Information Systems", label: "Information Systems" },
    { value: "Information Technology", label: "Information Technology" },
    { value: "Artificial Intelligence", label: "Artificial Intelligence" },
    { value: "Data Science", label: "Data Science" },
];

export default function CourseForm({ onClose, method = "post", onSubmit, initialData = {} }) {
    const isEdit = method === "put";

    const [selectedDepartment, setSelectedDepartment] = useState(() => {
        if (initialData.department) {
            return departments.find(d => d.value === initialData.department) || departments[0];
        }
        return departments[0];
    });

    const [formData, setFormData] = useState({
        title: initialData.title || "",
        id: initialData.id || "",
        creditHours: initialData.creditHours || 3,
        description: initialData.description || "",
        prerequisites: initialData.prerequisites?.join(", ") || "",
    });

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const prereqs = formData.prerequisites
            .split(",")
            .map(p => p.trim())
            .filter(Boolean);

        const courseData = {
            title: formData.title,
            id: formData.id,
            creditHours: Number(formData.creditHours),
            department: selectedDepartment.value,
            description: formData.description,
            prerequisites: prereqs,
            weeks: initialData.weeks || [],
        };

        if (onSubmit) onSubmit(courseData);
    };

    return (
        <ModelOverlay onClose={onClose}>
            <form
                className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark w-full p-6 rounded-lg shadow-md"
                onSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1 mb-6">
                        <h2 className="text-2xl font-semibold">{isEdit ? "Edit" : "Create New"} Course</h2>
                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            {isEdit
                                ? "Update the details below to edit this course."
                                : "Fill in the details below to add a new course to the system."
                            }
                        </p>
                    </div>

                    <button type="button" onClick={onClose} className="p-2 place-self-start rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 hover:text-gray-800">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6 mb-6">
                    <div className="grid grid-cols-2 gap-6">
                        <InputItem
                            label="Course Title"
                            type="text"
                            name="title"
                            placeholder="e.g. Introduction to Computer Science"
                            value={formData.title}
                            onChange={handleChange("title")}
                            required
                        />

                        <InputItem
                            label="Course ID"
                            type="text"
                            name="id"
                            placeholder="e.g. CS-100"
                            value={formData.id}
                            onChange={handleChange("id")}
                            isDisabled={isEdit}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <SelectBox
                            className="w-full"
                            label="Department"
                            labelDirection="flex-col"
                            options={departments}
                            selectedOption={selectedDepartment}
                            onChange={setSelectedDepartment}
                        />

                        <InputItem
                            label="Credit Hours"
                            type="number"
                            name="creditHours"
                            placeholder="3"
                            value={formData.creditHours}
                            onChange={handleChange("creditHours")}
                            min="1"
                            max="6"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <InputItem
                            label="Prerequisites (comma-separated IDs)"
                            type="text"
                            name="prerequisites"
                            placeholder="e.g. CS-100, CS-201"
                            value={formData.prerequisites}
                            onChange={handleChange("prerequisites")}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block mb-2 font-bold text-sm text-text-primary-default-light dark:text-text-primary-default-dark">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            className="mt-1 block w-full px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark rounded-md focus:outline-none"
                            placeholder="Enter course description"
                            value={formData.description}
                            onChange={handleChange("description")}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => setFormData({ title: "", id: "", creditHours: 3, description: "", prerequisites: "" })}
                    >
                        Reset Form
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                    >
                        {isEdit
                            ? <><FilePenIcon className="w-5 h-5" /> Update Course</>
                            : <><PlusIcon className="w-6 h-6" /> Create Course</>
                        }
                    </Button>
                </div>
            </form>
        </ModelOverlay>
    );
}
