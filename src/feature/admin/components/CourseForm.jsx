import { useState } from "react";
import Button from "../../../components/ui/Button";
import { PlusIcon, FilePenIcon } from "../../../components/ui/icons";
import InputItem from "../../../components/form/InputItem";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import SelectBox from "../../../components/ui/SelectBox";

const departments = [
    { value: "Computer Science", label: "Computer Science" },
    { value: "Information Systems", label: "Information Systems" },
    { value: "Information Technology", label: "Information Technology" },
    { value: "Artificial Intelligence", label: "Artificial Intelligence" },
    { value: "Data Science", label: "Data Science" },
];

export default function CourseForm({ onClose, method = "post", onSubmit, initialData = {}, isOpen = true }) {
    const isEdit = method === "put";

    const [selectedDepartment, setSelectedDepartment] = useState(() => {
        const dept = initialData.departmentName || initialData.department;
        if (dept) {
            return departments.find(d => d.value === dept || d.label === dept) || departments[0];
        }
        return departments[0];
    });

    const [formData, setFormData] = useState({
        title: initialData.courseName || initialData.title || "",
        titleArabic: initialData.courseNameAr || initialData.titleArabic || "",
        id: initialData.courseCode || initialData.id || "",
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
            courseName: formData.title,
            courseNameAr: formData.titleArabic || undefined,
            courseId: formData.id,
            creditHours: Number(formData.creditHours),
            departmentId: selectedDepartment.value,
            description: formData.description,
            prerequisites: prereqs,
        };

        console.log("[CourseForm] Submitting:", JSON.stringify(courseData, null, 2));
        if (onSubmit) onSubmit(courseData);
    };

    return (
        <BaseFormComponent
            isOpen={isOpen}
            title={`${isEdit ? "Edit" : "Create New"} Course`}
            description={isEdit ? "Update the details below to edit this course." : "Fill in the details below to add a new course to the system."}
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText={isEdit ? "Update Course" : "Create Course"}
        >
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
                        label="Course Title Arabic"
                        type="text"
                        name="titleArabic"
                        placeholder="e.g. مقدمة في علوم الحاسوب"
                        value={formData.titleArabic}
                        onChange={handleChange("titleArabic")}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
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

                    <SelectBox
                        className="w-full"
                        label="Department"
                        name="department"
                        labelDirection="flex-col"
                        options={departments}
                        selectedOption={selectedDepartment}
                        onChange={setSelectedDepartment}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
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

                    <InputItem
                        label="Prerequisites (comma-separated IDs)"
                        type="text"
                        name="prerequisites"
                        placeholder="e.g. CS-100, CS-201"
                        value={formData.prerequisites}
                        onChange={handleChange("prerequisites")}
                    />
                </div>
            </div>
        </BaseFormComponent>
    );
}
