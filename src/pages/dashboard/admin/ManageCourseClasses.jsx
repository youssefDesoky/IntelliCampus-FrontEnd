import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import Section from "../../../components/ui/Section";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import ImportDialog from "../../../components/ui/ImportDialog";
import ClassForm from "../../../feature/admin/components/ClassForm";
import {
    PlusIcon,
    ImportIcon,
    FilePenIcon,
    TrashIcon,
    CalendarIcon,
    LocationDotIcon,
    UserTieIcon,
    BookIcon,
    AngleDownIcon,
} from "../../../components/ui/icons";
import {
    fetchCourseById,
    fetchCourseClasses,
    addClassToCourse,
    updateClass,
    deleteClassFromCourse,
} from "../../../feature/admin/services/adminApi";

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

    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

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
                console.log("[ManageCourseClasses] Adding class:", courseId, JSON.stringify(data, null, 2));
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
            console.log("[ManageCourseClasses] Editing class:", id, JSON.stringify(formData, null, 2));
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
        <>
            <PageHeader
                title={course?.courseName || "Course Classes"}
                subtitle={`${course?.courseCode || ""} — ${course?.departmentName || ""} — ${course?.creditHours || "—"} Credit Hours`}
            >
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => navigate("/admin/courses")}>
                        ← Back to Courses
                    </Button>
                    <Button variant="secondary" onClick={() => setIsImportOpen(true)}>
                        <ImportIcon size={24} />
                        Import Classes
                    </Button>
                    <Button variant="primary" onClick={() => setIsCreateFormOpen(true)}>
                        <PlusIcon size={24} />
                        Add Class
                    </Button>
                </div>
            </PageHeader>

            {/* Stats Banner */}
            <Section>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
                        <div className="p-2 rounded-lg bg-bg-surface-purple-default-light dark:bg-bg-surface-purple-default-dark">
                            <BookIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                Total Classes
                            </p>
                            <p className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                {classes.length}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <AngleDownIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                Lectures
                            </p>
                            <p className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                {lectures.length}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <AngleDownIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 rotate-180" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                Sections
                            </p>
                            <p className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                {sections.length}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
                        <div className="p-2 rounded-lg bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark">
                            <CalendarIcon className="w-5 h-5 text-accent-default" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                Course Code
                            </p>
                            <p className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                {course?.courseCode || "—"}
                            </p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Lectures */}
            <ClassSection
                icon={AngleDownIcon}
                title="Lectures"
                classes={lectures}
                onEdit={handleEditClick}
                onDelete={setDeleteTarget}
            />

            {/* Sections */}
            <ClassSection
                icon={AngleDownIcon}
                title="Sections"
                classes={sections}
                onEdit={handleEditClick}
                onDelete={setDeleteTarget}
            />

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
        </>
    );
}
