import { useState, useEffect, useRef, useMemo } from "react";
import Button from "../../../components/ui/Button";
import { PlusIcon, FilePenIcon, XIcon, SearchIcon, AngleDownIcon } from "../../../components/ui/icons";
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

export default function CourseForm({ onClose, method = "post", onSubmit, initialData = {}, isOpen = true, allCourses = [] }) {
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
    });

    const [selectedPrereqs, setSelectedPrereqs] = useState(() => {
        if (Array.isArray(initialData.prerequisites)) {
            const matched = allCourses.filter(c =>
                initialData.prerequisites.includes(c.courseId) ||
                initialData.prerequisites.includes(c.courseCode)
            );
            const matchedIds = new Set(matched.map(c => c.courseId || c.courseCode));
            const unmatched = initialData.prerequisites
                .filter(id => !matchedIds.has(id))
                .map(id => ({ courseId: id, courseCode: id, courseName: id }));
            return [...matched, ...unmatched];
        }
        return [];
    });

    const [prereqOpen, setPrereqOpen] = useState(false);
    const [prereqSearch, setPrereqSearch] = useState("");
    const prereqRef = useRef(null);

    const selfId = initialData.courseId || initialData.courseCode;

    const availablePrereqs = useMemo(() => {
        const selectedIds = new Set(selectedPrereqs.map(c => c.courseId || c.courseCode));
        return allCourses.filter(c => {
            const cid = c.courseId || c.courseCode;
            if (selfId && (cid === selfId)) return false;
            if (selectedIds.has(cid)) return false;
            if (!prereqSearch) return true;
            const q = prereqSearch.toLowerCase();
            return (c.courseName || "").toLowerCase().includes(q) ||
                   (c.courseCode || "").toLowerCase().includes(q) ||
                   (c.courseId || "").toLowerCase().includes(q);
        });
    }, [allCourses, selectedPrereqs, prereqSearch, selfId]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (prereqRef.current && !prereqRef.current.contains(e.target)) {
                setPrereqOpen(false);
                setPrereqSearch("");
            }
        };
        if (prereqOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [prereqOpen]);

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const prereqs = selectedPrereqs.map(c => c.courseCode || c.courseId);

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

    const togglePrereq = (course) => {
        setSelectedPrereqs(prev => [...prev, course]);
        setPrereqSearch("");
    };

    const removePrereq = (course) => {
        setSelectedPrereqs(prev => prev.filter(c =>
            (c.courseId || c.courseCode) !== (course.courseId || course.courseCode)
        ));
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
                        label="Course Code"
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

                    <div className="relative" ref={prereqRef}>
                        <label className="block font-semibold text-sm text-text-primary-active-light dark:text-text-primary-active-dark mb-1">
                            Prerequisites
                        </label>
                        <div
                            className="flex flex-wrap items-center gap-1.5 min-h-[42px] p-2 rounded-md border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark cursor-pointer"
                            onClick={() => setPrereqOpen(!prereqOpen)}
                        >
                            {selectedPrereqs.length === 0 ? (
                                <span className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark px-1">
                                    Select prerequisite courses...
                                </span>
                            ) : (
                                selectedPrereqs.map(c => (
                                    <span
                                        key={c.courseId || c.courseCode}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark"
                                    >
                                        {c.courseCode || c.courseId}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removePrereq(c); }}
                                            className="hover:text-text-danger-default-light dark:hover:text-text-danger-default-dark transition-colors"
                                        >
                                            <XIcon className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))
                            )}
                            <AngleDownIcon className={`w-4 h-4 ml-auto text-icon-secondary-default-light dark:text-icon-secondary-default-dark ${prereqOpen ? 'rotate-180' : ''} transition-transform duration-200`} />
                        </div>

                        {prereqOpen && (
                            <div className="absolute left-0 right-0 mt-1 rounded-md shadow-lg bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark ring-1 ring-black ring-opacity-5 z-50">
                                <div className="p-2 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
                                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                                        <SearchIcon className="w-4 h-4 shrink-0 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                                        <input
                                            type="text"
                                            placeholder="Search courses..."
                                            value={prereqSearch}
                                            onChange={(e) => setPrereqSearch(e.target.value)}
                                            className="w-full bg-transparent text-sm text-text-primary-default-light dark:text-text-primary-default-dark placeholder:text-text-secondary-default-light dark:placeholder:text-text-secondary-default-dark focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-44 overflow-y-auto no-scrollbar">
                                    {availablePrereqs.length === 0 ? (
                                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark text-center py-4">
                                            {prereqSearch ? "No courses match your search" : "No courses available"}
                                        </p>
                                    ) : (
                                        availablePrereqs.map(c => (
                                            <div
                                                key={c.courseId || c.courseCode}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-surface-primary-active-light dark:hover:bg-bg-surface-primary-active-dark cursor-pointer"
                                                onClick={() => togglePrereq(c)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={false}
                                                    readOnly
                                                    className="accent-accent-default shrink-0"
                                                />
                                                <span className="font-medium shrink-0">{c.courseCode || c.courseId}</span>
                                                <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark truncate">{c.courseName}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BaseFormComponent>
    );
}
