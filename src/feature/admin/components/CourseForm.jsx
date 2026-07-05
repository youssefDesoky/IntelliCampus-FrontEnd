import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import InputItem from "../../../components/form/InputItem";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import SelectBox from "../../../components/ui/SelectBox";
import TextArea from "../../../components/ui/TextArea";
import { fetchDepartments } from "../services/adminDepartmentsApi";

export default function CourseForm({ onClose, method = "post", onSubmit, initialData = {}, isOpen = true }) {
    const { t } = useTranslation('admin');
    const isEdit = method === "put";

    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    useEffect(() => {
        fetchDepartments()
            .then(result => {
                const data = Array.isArray(result) ? result : (result?.data ?? []);
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

    const [formData, setFormData] = useState({ title: "", titleArabic: "", id: "", courseCodeAr: "", creditHours: "", description: "", descriptionAr: "", isProject: false });

    useEffect(() => {
        setFormData({
            title: initialData.courseName || initialData.title || "",
            titleArabic: initialData.courseNameAr || initialData.titleArabic || "",
            id: initialData.courseCode || initialData.id || "",
            courseCodeAr: initialData.courseCodeAr || "",
            creditHours: initialData.creditHours?.toString() || "",
            description: initialData.description || "",
            descriptionAr: initialData.descriptionAr || "",
            isProject: initialData.isProject ?? false,
        });
    }, [initialData.courseName, initialData.title, initialData.courseNameAr, initialData.titleArabic, initialData.courseCode, initialData.id, initialData.courseCodeAr, initialData.creditHours, initialData.description, initialData.descriptionAr, initialData.isProject]);

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
            isProject: formData.isProject,
        };

        if (onSubmit) onSubmit(courseData);
    };

    return (
        <BaseFormComponent
            isOpen={isOpen}
            title={t(isEdit ? 'courseForm.title.edit' : 'courseForm.title.create')}
            description={t(isEdit ? 'courseForm.description.edit' : 'courseForm.description.create')}
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText={t(isEdit ? 'courseForm.submit.edit' : 'courseForm.submit.create')}
        >
            <div className="space-y-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputItem
                        label={t('courseForm.title')}
                        type="text"
                        name="title"
                        placeholder={t('courseForm.titlePlaceholder')}
                        value={formData.title}
                        onChange={handleChange("title")}
                        required
                    />

                    <div dir="rtl">
                        <InputItem
                            label={t('courseForm.titleAr')}
                            type="text"
                            name="titleArabic"
                            placeholder={t('courseForm.titleArPlaceholder')}
                            value={formData.titleArabic}
                            onChange={handleChange("titleArabic")}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputItem
                        label={t('courseForm.code')}
                        type="text"
                        name="id"
                        placeholder={t('courseForm.codePlaceholder')}
                        value={formData.id}
                        onChange={handleChange("id")}
                        isDisabled={isEdit}
                        required
                    />

                    <div dir="rtl">
                        <InputItem
                            label={t('courseForm.codeAr')}
                            type="text"
                            name="courseCodeAr"
                            placeholder={t('courseForm.codeArPlaceholder')}
                            value={formData.courseCodeAr}
                            onChange={handleChange("courseCodeAr")}
                        />
                    </div>
                </div>

                <SelectBox
                    className="w-full"
                    label={t('courseForm.department')}
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

                <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        name="isProject"
                        checked={formData.isProject}
                        onChange={(e) => setFormData(prev => ({ ...prev, isProject: e.target.checked }))}
                        className="w-4 h-4 rounded border-border-primary-default-light dark:border-border-primary-default-dark text-bg-fill-accent-default-light dark:text-bg-fill-accent-default-dark focus:ring-bg-fill-accent-default-light dark:focus:ring-bg-fill-accent-default-dark"
                    />
                    <span className="text-sm font-semibold text-text-primary-active-light dark:text-text-primary-active-dark">
                        Project Course
                    </span>
                    <span className="text-xs text-text-secondary-active-light dark:text-text-secondary-active-dark">
                        (hides section selection during registration)
                    </span>
                </label>

                <div>
                    <label className="block font-semibold text-sm text-text-primary-active-light dark:text-text-primary-active-dark mb-1">
                        {t('courseForm.description')}
                    </label>
                    <TextArea
                        name="description"
                        placeholder={t('courseForm.descriptionPlaceholder')}
                        value={formData.description}
                        onChange={handleChange("description")}
                        className="w-full px-3 py-2 rounded-md border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark placeholder:text-text-secondary-default-light dark:placeholder:text-text-secondary-default-dark focus:outline-none focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark resize-none"
                    />
                </div>

                <div dir="rtl">
                    <label className="block font-semibold text-sm text-text-primary-active-light dark:text-text-primary-active-dark mb-1">
                        {t('courseForm.descriptionAr')}
                    </label>
                    <TextArea
                        name="descriptionAr"
                        placeholder={t('courseForm.descriptionArPlaceholder')}
                        value={formData.descriptionAr}
                        onChange={handleChange("descriptionAr")}
                        className="w-full px-3 py-2 rounded-md border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark placeholder:text-text-secondary-default-light dark:placeholder:text-text-secondary-default-dark focus:outline-none focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark resize-none"
                    />
                </div>
            </div>
        </BaseFormComponent>
    );
}
