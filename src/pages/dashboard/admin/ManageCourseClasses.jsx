import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Section from "../../../components/ui/Section";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import ImportDialog from "../../../components/ui/ImportDialog";
import ClassForm from "../../../feature/admin/components/ClassForm";
import CourseForm from "../../../feature/admin/components/CourseForm";
import ManageCourseStudentsTab from "./ManageCourseStudentsTab";
import ManageCourseGradesTab from "./ManageCourseGradesTab";
import {
    PlusIcon,
    ImportIcon,
    FilePenIcon,
    TrashIcon,
    CalendarIcon,
    LocationDotIcon,
    UserTieIcon,
    AngleDownIcon,
    ArrowRightIcon,
} from "../../../components/ui/icons";
import {
    fetchCourseById,
    fetchCourseClasses,
    addClassToCourse,
    updateClass,
    deleteClassFromCourse,
    updateCourse,
    deactivateCourse,
    fetchCourses,
} from "../../../feature/admin/services/adminApi";

const tabs = [
    { key: "classes", label: "Classes" },
    { key: "students", label: "Students" },
    { key: "grades", label: "Upload Final Grades" },
];

function formatTime(timeSpan) {
    if (!timeSpan) return "";
    const parts = String(timeSpan).split(":");
    const h = parseInt(parts[0], 10);
    const m = parts[1] || "00";
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${ampm}`;
}

function formatSchedule(cls) {
    const day = cls.dayName || "";
    const start = formatTime(cls.startTime);
    const end = formatTime(cls.endTime);
    if (start && end) return `${day} ${start} – ${end}`;
    if (start) return `${day} ${start}`;
    return day || "—";
}

function ClassCard({ cls, onEdit, onDelete }) {
    const isLecture = cls.classTypeName === "Lecture";

    return (
        <div className="relative border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark hover:shadow-md hover:border-border-primary-hover-light dark:hover:border-border-primary-hover-dark transition-all overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${isLecture ? 'bg-purple-500' : 'bg-emerald-500'}`} />

            <div className="p-4 pl-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white shrink-0 ${isLecture ? 'bg-purple-500/90' : 'bg-emerald-500/90'}`}>
                            {cls.classTypeName || "Class"}
                        </span>
                    </div>
                    <div className="flex items-center gap-0.5 -mr-1.5 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(cls)}
                            className="p-1.5 rounded-lg text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-accent-default-light dark:hover:bg-bg-surface-accent-default-dark hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark transition-colors"
                        >
                            <FilePenIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(cls)}
                            className="p-1.5 rounded-lg text-text-danger-default-light dark:text-text-danger-default-dark hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-text-primary-default-light dark:text-text-primary-default-dark">
                        <UserTieIcon className="w-4 h-4 shrink-0 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                        <span className="truncate">{cls.instructorName || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-primary-default-light dark:text-text-primary-default-dark">
                        <CalendarIcon className="w-4 h-4 shrink-0 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                        <span className="truncate">{formatSchedule(cls)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-primary-default-light dark:text-text-primary-default-dark">
                        <LocationDotIcon className="w-4 h-4 shrink-0 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                        <span className="truncate">{cls.room || "—"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ClassSection({ icon: Icon, title, classes, onEdit, onDelete }) {
    const isLecture = title === "Lectures";

    return (
        <Section>
            <div className="flex items-center gap-2 mb-4">
                {Icon && (
                    <div className={`p-1.5 rounded-md ${isLecture ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                        <Icon className={`w-4 h-4 ${isLecture ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                    </div>
                )}
                <h2 className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                    {title}
                </h2>
                <span className="text-sm font-normal text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    ({classes.length})
                </span>
            </div>

            {classes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {classes.map(cls => (
                        <ClassCard key={cls.classId} cls={cls} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-6 text-center">
                    No {title.toLowerCase()} added yet.
                </p>
            )}
        </Section>
    );
}

export default function ManageCourseClasses() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("classes");

    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
    const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
    const [allCourses, setAllCourses] = useState([]);

    const loadData = useCallback(async () => {
        try {
            setError(null);
            const [courseData, classesData] = await Promise.all([
                fetchCourseById(courseId),
                fetchCourseClasses(courseId),
            ]);
            setCourse(courseData);
            setClasses(Array.isArray(classesData) ? classesData : []);
        } catch (err) {
            console.error("Failed to load course data:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [courseId]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleAddClass = async (payloads) => {
        const arr = Array.isArray(payloads) ? payloads : [payloads];
        try {
            for (const data of arr) {
                await addClassToCourse(courseId, data);
            }
            setIsCreateFormOpen(false);
            await loadData();
        } catch (err) {
            console.error("Failed to add class:", err);
        }
    };

    const handleEditClick = (cls) => {
        const start = cls.startTime ? cls.startTime.slice(0, 5) : "";
        const scheduleStr = `${cls.dayName || ""} ${start}`.trim();
        setEditingClass({
            _classId: cls.classId,
            type: cls.classTypeName,
            instructor: cls.instructorName,
            schedule: scheduleStr,
            room: cls.room,
        });
    };

    const handleEditSubmit = async (formData) => {
        try {
            const id = editingClass._classId;
            await updateClass(id, formData);
            setEditingClass(null);
            await loadData();
        } catch (err) {
            console.error("Failed to update class:", err);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            await deleteClassFromCourse(courseId, deleteTarget.classId);
            await loadData();
        } catch (err) {
            console.error("Failed to delete class:", err);
        }
        setDeleteTarget(null);
    };

    const handleEditCourse = async (formData) => {
        try {
            await updateCourse(courseId, formData);
            setIsEditCourseOpen(false);
            await loadData();
        } catch (err) {
            console.error("Failed to update course:", err);
        }
    };

    const handleDeactivate = async () => {
        try {
            await deactivateCourse(courseId);
            navigate("/admin/courses");
        } catch (err) {
            console.error("Failed to deactivate course:", err);
        }
        setIsDeactivateOpen(false);
    };

    const handleOpenEdit = async () => {
        try {
            const courses = await fetchCourses();
            setAllCourses(Array.isArray(courses) ? courses : []);
        } catch (err) {
            console.error("Failed to load courses for edit:", err);
        }
        setIsEditCourseOpen(true);
    };

    const lectures = classes.filter((c) => c.classTypeName === "Lecture");
    const sections = classes.filter((c) => c.classTypeName === "Section");

    if (isLoading) {
        return (
            <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                Loading course...
            </p>
        );
    }

    if (error) {
        return <p className="text-center py-10 text-red-500">Error: {error}</p>;
    }

    return (
        <div className="p-0 sm:p-6">
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4 min-w-0">
                    <button
                        onClick={() => navigate("/admin/courses")}
                        className="shrink-0 w-10 h-10 rounded-xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark flex items-center justify-center hover:bg-bg-surface-accent-default-light dark:hover:bg-bg-surface-accent-default-dark transition-colors"
                    >
                        <ArrowRightIcon className="w-5 h-5 rotate-180 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-xl md:text-2xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark truncate">
                            {course?.courseName || "Course"}
                        </h1>
                        <p className="text-text-secondary-active-light dark:text-text-secondary-active-dark text-xs md:text-sm truncate">
                            {course?.courseCode || ""}{course?.courseCode && course?.departmentName ? " • " : ""}{course?.departmentName || ""}{course?.creditHours ? ` • ${course.creditHours} Credit Hours` : ""}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="secondary" size="sm" onClick={handleOpenEdit}>
                        <FilePenIcon className="w-4 h-4" />
                        <span className="hidden sm:inline"> Edit</span>
                    </Button>
                    <Button variant="warning" size="sm" onClick={() => setIsDeactivateOpen(true)}>
                        <span className="hidden sm:inline">Deactivate</span>
                        <span className="sm:hidden">X</span>
                    </Button>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 mb-6 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                            activeTab === tab.key
                                ? "border-border-accent-active-light dark:border-border-accent-active-dark text-text-primary-default-light dark:text-text-primary-default-dark"
                                : "border-transparent text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ─── Tab: Classes ─── */}
            {activeTab === "classes" && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => setIsImportOpen(true)}>
                            <ImportIcon size={20} />
                            <span className="hidden sm:inline"> Import Classes</span>
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => setIsCreateFormOpen(true)}>
                            <PlusIcon size={20} />
                            <span className="hidden sm:inline"> Create Class</span>
                        </Button>
                    </div>

                    <ClassSection
                        icon={AngleDownIcon}
                        title="Lectures"
                        classes={lectures}
                        onEdit={handleEditClick}
                        onDelete={setDeleteTarget}
                    />

                    <ClassSection
                        icon={AngleDownIcon}
                        title="Sections"
                        classes={sections}
                        onEdit={handleEditClick}
                        onDelete={setDeleteTarget}
                    />
                </div>
            )}

            {/* ─── Tab: Students ─── */}
            {activeTab === "students" && (
                <ManageCourseStudentsTab courseId={courseId} />
            )}

            {/* ─── Tab: Upload Final Grades ─── */}
            {activeTab === "grades" && (
                <ManageCourseGradesTab courseId={courseId} courseName={course?.courseName} />
            )}

            {/* Add Class Form */}
            {isCreateFormOpen && (
                <ClassForm
                    onClose={() => setIsCreateFormOpen(false)}
                    onSubmit={handleAddClass}
                    courseDepartment={course?.departmentName || course?.department || ""}
                />
            )}

            {/* Edit Class Form */}
            {editingClass && (
                <ClassForm
                    initialData={editingClass}
                    onClose={() => setEditingClass(null)}
                    onSubmit={handleEditSubmit}
                    courseDepartment={course?.departmentName || course?.department || ""}
                />
            )}

            {/* Edit Course Form */}
            {isEditCourseOpen && (
                <CourseForm
                    method="put"
                    initialData={course}
                    onClose={() => setIsEditCourseOpen(false)}
                    onSubmit={handleEditCourse}
                    allCourses={allCourses}
                />
            )}

            {/* Import Dialog */}
            {isImportOpen && (
                <ImportDialog
                    title="Import Classes"
                    subtitle="Upload a file to bulk-import classes for this course."
                    onClose={() => setIsImportOpen(false)}
                    onImport={(file) => { console.log("Importing classes from:", file.name); setIsImportOpen(false); }}
                />
            )}

            {/* Delete Confirmation */}
            <Dialog
                isOpen={deleteTarget !== null}
                variant="error"
                title="Delete Class"
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => { handleDeleteConfirm(); return true; }}
                confirmText="Delete"
                cancelText="Cancel"
                showCloseButton={true}
            >
                Are you sure you want to delete this{" "}
                <strong>{deleteTarget?.classTypeName}</strong> (#{deleteTarget?.classId})
                {deleteTarget?.instructorName ? ` taught by ${deleteTarget.instructorName}` : ""}?
                This action cannot be undone.
            </Dialog>

            {/* Deactivate Confirmation */}
            <Dialog
                isOpen={isDeactivateOpen}
                variant="warning"
                title="Deactivate Course"
                onClose={() => setIsDeactivateOpen(false)}
                onConfirm={() => { handleDeactivate(); return true; }}
                confirmText="Deactivate"
                cancelText="Cancel"
                showCloseButton={true}
            >
                Are you sure you want to deactivate{" "}
                <strong>{course?.courseName}</strong> ({course?.courseCode})?
                This will make the course unavailable to students.
            </Dialog>
        </div>
    );
}
