import { useState, useEffect, useCallback } from "react";
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
    TrashIcon,
    ArrowRightIcon,
    CalendarIcon,
    LocationDotIcon,
    UserTieIcon,
    UsersIcon,
    BookIcon,
} from "../../../components/ui/icons";
import {
    fetchCourseById,
    fetchCourseClasses,
    addClassToCourse,
    deleteClassFromCourse,
} from "../../../feature/admin/services/adminApi";

function ClassCard({ cls, onDelete }) {
    const isLecture = cls.type === "Lecture";
    const borderColor = isLecture
        ? "border-l-border-accent-default-light dark:border-l-border-accent-default-dark"
        : "border-l-border-success-default-light dark:border-l-border-success-default-dark";
    const badgeBg = isLecture
        ? "bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark"
        : "bg-bg-fill-success-default-light dark:bg-bg-fill-success-default-dark text-white";

    return (
        <div
            className={`bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg border-l-4 ${borderColor} shadow-sm shadow-shadow-light hover:shadow-lg dark:hover:shadow-shadow-dark transition-shadow p-5 flex flex-col gap-4`}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeBg}`}>
                        {cls.type}
                    </span>
                    {cls.group && (
                        <span className="text-xs text-text-secondary-active-light dark:text-text-secondary-active-dark font-medium">
                            {cls.group}
                        </span>
                    )}
                </div>
                <Button
                    variant="danger"
                    className="text-xs px-2 py-1"
                    onClick={() => onDelete(cls)}
                >
                    <TrashIcon className="w-4 h-4" />
                </Button>
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark">
                <div className="flex items-center gap-1.5">
                    <UserTieIcon className="w-4 h-4" />
                    <span>{cls.instructor || "—"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{cls.schedule || "—"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <LocationDotIcon className="w-4 h-4" />
                    <span>{cls.room || "—"}</span>
                </div>
            </div>
        </div>
    );
}

export default function ManageCourseClasses() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dialogs
    const [isClassFormOpen, setIsClassFormOpen] = useState(false);
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

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleAddClass = async (formData) => {
        try {
            await addClassToCourse(courseId, formData);
            setIsClassFormOpen(false);
            await loadData();
        } catch (err) {
            console.error("Failed to add class:", err);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            await deleteClassFromCourse(courseId, deleteTarget.id);
            await loadData();
        } catch (err) {
            console.error("Failed to delete class:", err);
        }
        setDeleteTarget(null);
    };

    const lectures = classes.filter((c) => c.type === "Lecture");
    const sections = classes.filter((c) => c.type === "Section");

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
            {/* Header */}
            <PageHeader
                title={course?.title || "Course Classes"}
                subtitle={`${course?.id || ""} — ${course?.department || ""} — ${course?.creditHours || "—"} Credit Hours`}
            >
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => navigate("/admin/courses")}>
                        ← Back to Courses
                    </Button>

                    <Button variant="secondary" onClick={() => setIsImportOpen(true)}>
                        <ImportIcon size={24} />
                        Import Classes
                    </Button>

                    <Button variant="primary" onClick={() => setIsClassFormOpen(true)}>
                        <PlusIcon size={24} />
                        Add Class
                    </Button>
                </div>
            </PageHeader>

            {/* Course Info Banner */}
            <Section>
                <div className="flex flex-wrap gap-6 text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark mb-2">
                    {course?.professor && (
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark rounded-md">
                                <UserTieIcon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs">Professor</span>
                                <span className="text-sm font-semibold">{course.professor}</span>
                            </div>
                        </div>
                    )}
                    {course?.semester && (
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark rounded-md">
                                <CalendarIcon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs">Semester</span>
                                <span className="text-sm font-semibold">{course.semester}</span>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-bg-surface-purple-default-light dark:bg-bg-surface-purple-default-dark rounded-md">
                            <BookIcon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs">Total Classes</span>
                            <span className="text-sm font-semibold">{classes.length}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark rounded-md">
                            <UsersIcon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs">Lectures / Sections</span>
                            <span className="text-sm font-semibold">
                                {lectures.length} / {sections.length}
                            </span>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Lectures */}
            <Section>
                <h2 className="text-lg font-semibold mb-4">
                    Lectures{" "}
                    <span className="text-sm font-normal text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        ({lectures.length})
                    </span>
                </h2>
                {lectures.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {lectures.map((cls) => (
                            <ClassCard key={cls.id} cls={cls} onDelete={setDeleteTarget} />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-4">
                        No lectures added yet.
                    </p>
                )}
            </Section>

            {/* Sections */}
            <Section>
                <h2 className="text-lg font-semibold mb-4">
                    Sections{" "}
                    <span className="text-sm font-normal text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        ({sections.length})
                    </span>
                </h2>
                {sections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {sections.map((cls) => (
                            <ClassCard key={cls.id} cls={cls} onDelete={setDeleteTarget} />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-4">
                        No sections added yet.
                    </p>
                )}
            </Section>

            {/* Add Class Form */}
            {isClassFormOpen && (
                <ClassForm
                    onClose={() => setIsClassFormOpen(false)}
                    onSubmit={handleAddClass}
                />
            )}

            {/* Import Dialog */}
            {isImportOpen && (
                <ImportDialog
                    title="Import Classes"
                    subtitle="Upload a file to bulk-import classes for this course."
                    onClose={() => setIsImportOpen(false)}
                    onImport={(file) => {
                        console.log("Importing classes from:", file.name);
                        setIsImportOpen(false);
                    }}
                />
            )}

            {/* Delete Confirmation */}
            <Dialog
                isOpen={deleteTarget !== null}
                variant="error"
                title="Delete Class"
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => {
                    handleDeleteConfirm();
                    return true;
                }}
                confirmText="Delete"
                cancelText="Cancel"
                showCloseButton={true}
            >
                Are you sure you want to delete this{" "}
                <strong>{deleteTarget?.type}</strong>
                {deleteTarget?.group ? ` (${deleteTarget.group})` : ""} taught by{" "}
                <strong>{deleteTarget?.instructor}</strong>? This action cannot be undone.
            </Dialog>
        </>
    );
}
