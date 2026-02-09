import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import Section from "../../../components/ui/Section";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import Table from "../../../components/ui/Table";
import ImportDialog from "../../../components/ui/ImportDialog";
import ToggleViewMode from "../../../components/ui/ToggleViewMode";
import ClassForm from "../../../feature/admin/components/ClassForm";
import {
    PlusIcon,
    ImportIcon,
    TrashIcon,
    CalendarIcon,
    LocationDotIcon,
    UserTieIcon,
    UsersIcon,
    BookIcon,
    Grid3ColIcon,
    TableIcon,
} from "../../../components/ui/icons";
import {
    fetchCourseById,
    fetchCourseClasses,
    addClassToCourse,
    deleteClassFromCourse,
} from "../../../feature/admin/services/adminApi";

// ─── Helpers ────────────────────────────────────────────────

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

// ─── Card Component ─────────────────────────────────────────

function ClassCard({ cls, onDelete }) {
    const isLecture = cls.classTypeName === "Lecture";
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
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeBg}`}>
                        {cls.classTypeName}
                    </span>
                    <span className="text-xs text-text-secondary-active-light dark:text-text-secondary-active-dark font-medium">
                        #{cls.classId}
                    </span>
                </div>
                <Button variant="danger" className="text-xs px-2 py-1" onClick={() => onDelete(cls)}>
                    <TrashIcon className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark">
                <div className="flex items-center gap-1.5">
                    <UserTieIcon className="w-4 h-4" />
                    <span>{cls.instructorName || "Unassigned"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatSchedule(cls)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <LocationDotIcon className="w-4 h-4" />
                    <span>{cls.room || "—"}</span>
                </div>
            </div>
        </div>
    );
}

// ─── Table Row Builder ──────────────────────────────────────

const classTableHeaders = ["ID", "Instructor", "Day", "Time", "Room"];

function buildClassRow(cls) {
    const start = formatTime(cls.startTime);
    const end = formatTime(cls.endTime);
    const timeStr = start && end ? `${start} – ${end}` : start || "—";

    return {
        id: <span className="px-2 py-1 rounded-full border text-xs font-semibold">{cls.classId}</span>,
        instructor: cls.instructorName || "Unassigned",
        day: cls.dayName || "—",
        time: timeStr,
        room: cls.room || "—",
        _raw: cls,
    };
}

// ─── Reusable Class Section ─────────────────────────────────

function ClassSection({ title, classes, viewMode, onDelete }) {
    return (
        <Section>
            <h2 className="text-lg font-semibold mb-4">
                {title}{" "}
                <span className="text-sm font-normal text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    ({classes.length})
                </span>
            </h2>

            {classes.length > 0 ? (
                viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {classes.map((cls) => (
                            <ClassCard key={cls.classId} cls={cls} onDelete={onDelete} />
                        ))}
                    </div>
                ) : (
                    <Table
                        role="class"
                        roleLabel={title}
                        headers={classTableHeaders}
                        data={classes.map(buildClassRow)}
                        wrapInSection={false}
                        showHeaderActions={false}
                        showPagination={false}
                        actions={(row) => [
                            {
                                label: "Delete",
                                onClick: () => onDelete(row._raw),
                                className: "text-text-danger-default-light dark:text-text-danger-default-dark",
                            },
                        ]}
                    />
                )
            ) : (
                <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-4">
                    No {title.toLowerCase()} added yet.
                </p>
            )}
        </Section>
    );
}

// ─── Main Page ──────────────────────────────────────────────

export default function ManageCourseClasses() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isClassFormOpen, setIsClassFormOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminClassesViewMode") || "grid");
    useEffect(() => { localStorage.setItem("adminClassesViewMode", viewMode); }, [viewMode]);

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

    const handleAddClass = async (formData) => {
        try {
            console.log("[ManageCourseClasses] Adding class:", courseId, JSON.stringify(formData, null, 2));
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
                    <Button variant="primary" onClick={() => setIsClassFormOpen(true)}>
                        <PlusIcon size={24} />
                        Add Class
                    </Button>
                </div>
            </PageHeader>

            {/* Info Banner + View Toggle */}
            <Section>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-6 text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark">
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
                                <span className="text-sm font-semibold">{lectures.length} / {sections.length}</span>
                            </div>
                        </div>
                    </div>

                    <ToggleViewMode
                        isFirstMode={viewMode === "grid"}
                        onFirstModeSelect={() => setViewMode("grid")}
                        onSecondModeSelect={() => setViewMode("list")}
                        firstModeLabel={<Grid3ColIcon className="w-5 h-5" />}
                        secondModeLabel={<TableIcon className="w-5 h-5" />}
                    />
                </div>
            </Section>

            {/* Lectures */}
            <ClassSection title="Lectures" classes={lectures} viewMode={viewMode} onDelete={setDeleteTarget} />

            {/* Sections */}
            <ClassSection title="Sections" classes={sections} viewMode={viewMode} onDelete={setDeleteTarget} />

            {/* Add Class Form */}
            {isClassFormOpen && (
                <ClassForm onClose={() => setIsClassFormOpen(false)} onSubmit={handleAddClass} />
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
