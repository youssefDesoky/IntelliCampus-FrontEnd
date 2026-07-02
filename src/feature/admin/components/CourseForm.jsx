import { useState, useEffect } from "react";
import InputItem from "../../../components/form/InputItem";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import SelectBox from "../../../components/ui/SelectBox";
import TextArea from "../../../components/ui/TextArea";
import { fetchDepartments } from "../services/adminDepartmentsApi";

export default function CourseForm({ onClose, method = "post", onSubmit, initialData = {}, isOpen = true }) {
    const isEdit = method === "put";

    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    useEffect(() => {
        fetchDepartments()
            .then(data => {
                const options = data.map(d => ({ value: d.departmentId, label: d.departmentName }));
                setDepartments(options);
                if (initialData.departmentId) {
                    const match = options.find(o => o.value === initialData.departmentId);
                    if (match) setSelectedDepartment(match);
                } else if (initialData.departmentName) {
                    const match = options.find(o => o.label === initialData.departmentName);
                    if (match) setSelectedDepartment(match);
                } else if (options.length > 0) {
                    setSelectedDepartment(options[0]);
                }
            })
            .catch(console.error);
    }, [initialData.departmentId, initialData.departmentName]);

    const [formData, setFormData] = useState({ title: "", titleArabic: "", id: "", courseCodeAr: "", creditHours: "", description: "", descriptionAr: "" });

    useEffect(() => {
        setFormData({
            title: initialData.courseName || initialData.title || "",
            titleArabic: initialData.courseNameAr || initialData.titleArabic || "",
            id: initialData.courseCode || initialData.id || "",
            courseCodeAr: initialData.courseCodeAr || "",
            creditHours: initialData.creditHours?.toString() || "",
            description: initialData.description || "",
            descriptionAr: initialData.descriptionAr || "",
        });
    }, [initialData.courseName, initialData.title, initialData.courseNameAr, initialData.titleArabic, initialData.courseCode, initialData.id, initialData.courseCodeAr, initialData.creditHours, initialData.description, initialData.descriptionAr]);

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const courseData = {
            courseName: formData.title,
            courseNameAr: formData.titleArabic || undefined,
            courseCodeAr: formData.courseCodeAr || undefined,
            courseId: formData.id,
            departmentName: selectedDepartment?.label,
            creditHours: parseInt(formData.creditHours, 10) || 0,
            description: formData.description,
            descriptionAr: formData.descriptionAr || undefined,
        };

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputItem
                        label="Course Title"
                        type="text"
                        name="title"
                        placeholder="e.g. Introduction to Computer Science"
                        value={formData.title}
                        onChange={handleChange("title")}
                        required
                    />

                    <div dir="rtl">
                        <InputItem
                            label="اسم المادة"
                            type="text"
                            name="titleArabic"
                            placeholder="مقدمة في علوم الحاسوب"
                            value={formData.titleArabic}
                            onChange={handleChange("titleArabic")}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputItem
                        label="Course Code"
                        type="text"
                        name="id"
                        placeholder="e.g. CS-100"
                        value={formData.id}
                        onChange={handleChange("id")}
                        isDisabled={isEdit}
                        required
                    />

                    <div dir="rtl">
                        <InputItem
                            label="رمز المادة"
                            type="text"
                            name="courseCodeAr"
                            placeholder="حاس-100"
                            value={formData.courseCodeAr}
                            onChange={handleChange("courseCodeAr")}
                        />
                    </div>
                </div>

                <SelectBox
                    className="w-full"
                    label="Department"
                    name="department"
                    labelDirection="flex-col"
                    options={departments}
                    selectedOption={selectedDepartment}
                    onChange={setSelectedDepartment}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputItem
                        label="Credit Hours"
                        type="number"
                        name="creditHours"
                        placeholder="e.g. 3"
                        value={formData.creditHours}
                        onChange={handleChange("creditHours")}
                        required
                        min="1"
                    />
                </div>

                <div>
                    <label className="block font-semibold text-sm text-text-primary-active-light dark:text-text-primary-active-dark mb-1">
                        Description
                    </label>
                    <TextArea
                        name="description"
                        placeholder="Enter course description..."
                        value={formData.description}
                        onChange={handleChange("description")}
                        className="w-full px-3 py-2 rounded-md border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark placeholder:text-text-secondary-default-light dark:placeholder:text-text-secondary-default-dark focus:outline-none focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark resize-none"
                    />
                </div>

                <div dir="rtl">
                    <label className="block font-semibold text-sm text-text-primary-active-light dark:text-text-primary-active-dark mb-1">
                        وصف المادة
                    </label>
                    <TextArea
                        name="descriptionAr"
                        placeholder="أدخل وصف المادة..."
                        value={formData.descriptionAr}
                        onChange={handleChange("descriptionAr")}
                        className="w-full px-3 py-2 rounded-md border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark placeholder:text-text-secondary-default-light dark:placeholder:text-text-secondary-default-dark focus:outline-none focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark resize-none"
                    />
                </div>
            </div>
        </BaseFormComponent>
    );
}
