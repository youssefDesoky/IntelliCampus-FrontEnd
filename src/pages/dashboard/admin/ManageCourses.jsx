import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import Section from "../../../components/ui/Section";
import Button from "../../../components/ui/Button";
import SearchBar from "../../../components/ui/SearchBar";
import Dialog from "../../../components/ui/Dialog";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import ToggleViewMode from "../../../components/ui/ToggleViewMode";
import Table from "../../../components/ui/Table";
import ImportDialog from "../../../components/ui/ImportDialog";
import CourseForm from "../../../feature/admin/components/CourseForm";
import {
    PlusIcon,
    ImportIcon,
    FilePenIcon,
    TrashIcon,
    CheckIcon,
    XIcon,
    BookIcon,
    UserTieIcon,
    ClipboardCheckIcon,
    ArrowRightIcon,
    Grid3ColIcon,
    TableIcon
} from "../../../components/ui/icons";
import {
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    activateCourse,
    deactivateCourse,
} from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 9;

function StatusBadge({ isActive }) {
    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                isActive
                    ? "bg-bg-fill-success-default-light dark:bg-bg-fill-success-default-dark text-white"
                    : "bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-secondary-active-light dark:text-text-secondary-active-dark"
            }`}
        >
            {isActive ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
            {isActive ? "Active" : "Inactive"}
        </span>
    );
}

const courseTableHeaders = ["Course", "Course ID", "Department", "Credit Hours", "Professor", "Status"];

function buildCourseRow(course) {
    return {
        course: (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                    {(course.courseName || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                    <p className="font-medium">{course.courseName}</p>
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-50 truncate">{course.description}</p>
                </div>
            </div>
        ),
        courseId: (
            <span className="px-2 py-1 rounded-full border text-xs font-semibold">{course.courseCode || course.courseId}</span>
        ),
        department: course.departmentName || "—",
        creditHours: course.creditHours || "—",
        professor: course.professor || "—",
        status: <StatusBadge isActive={!!course.isActive} />,
        _raw: course,
    };
}

function CourseCard({ course, onEdit, onDelete, onActivate, onDeactivate, onManage }) {
    const borderColor = course.isActive
        ? "border-l-border-success-default-light dark:border-l-border-success-default-dark"
        : "border-l-border-accent-default-light dark:border-l-border-accent-default-dark";

    return (
        <div
            className={`bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg border-l-4 ${borderColor} shadow-sm shadow-shadow-light hover:shadow-lg dark:hover:shadow-shadow-dark transition-shadow p-5 flex flex-col justify-between gap-4`}
        >
            {/* Top: Title + Status */}
            <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                            {(course.courseName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-semibold text-base leading-tight">{course.courseName}</h3>
                            <span className="text-xs text-text-secondary-active-light dark:text-text-secondary-active-dark">
                                {course.courseCode || course.courseId}
                            </span>
                        </div>
                    </div>
                    <StatusBadge isActive={!!course.isActive} />
                </div>

                {/* Info pills */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark mb-3">
                    <div className="flex items-center gap-1.5">
                        <BookIcon className="w-4 h-4" />
                        <span>{course.departmentName || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ClipboardCheckIcon className="w-4 h-4" />
                        <span>{course.creditHours || "—"} Credit Hrs</span>
                    </div>
                    {course.professor && (
                        <div className="flex items-center gap-1.5">
                            <UserTieIcon className="w-4 h-4" />
                            <span>{course.professor}</span>
                        </div>
                    )}
                </div>

                {course.description && (
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark line-clamp-2">
                        {course.description}
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
                {/* Manage Course button */}
                {course.isActive && (
                    <Button
                        variant="primary"
                        className="w-full justify-center"
                        onClick={() => onManage(course)}
                    >
                        Manage Course <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                )}

                {/* Quick actions row */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        className="flex-1 justify-center text-xs px-2 py-1.5"
                        onClick={() => onEdit(course)}
                    >
                        <FilePenIcon className="w-4 h-4" /> Edit
                    </Button>

                    {course.isActive ? (
                        <Button
                            variant="warning"
                            className="flex-1 justify-center text-xs px-2 py-1.5"
                            onClick={() => onDeactivate(course)}
                        >
                            <XIcon className="w-4 h-4" /> Deactivate
                        </Button>
                    ) : (
                        <Button
                            variant="success"
                            className="flex-1 justify-center text-xs px-2 py-1.5"
                            onClick={() => onActivate(course)}
                        >
                            <CheckIcon className="w-4 h-4" /> Activate
                        </Button>
                    )}

                    <Button
                        variant="danger"
                        className="flex-1 justify-center text-xs px-2 py-1.5"
                        onClick={() => onDelete(course)}
                    >
                        <TrashIcon className="w-4 h-4" /> Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function ManageCourses() {
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Dialogs
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [successMessage, setSuccessMessage] = useState(null);

    // View mode
    const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminCoursesViewMode") || "grid");

    // Table selection
    const [selectedRows, setSelectedRows] = useState([]);
    const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        localStorage.setItem("adminCoursesViewMode", viewMode);
    }, [viewMode]);

    const loadCourses = useCallback(async () => {
        try {
            setError(null);
            const data = await fetchCourses();
            const mapped = (Array.isArray(data) ? data : []).map((c) => ({
                ...c,
                isActive:
                    c.statusName?.toLowerCase() === "active" ||
                    (typeof c.status === "string" && c.status.toLowerCase() === "active") ||
                    c.status === 0,
            }));
            setCourses(mapped);
        } catch (err) {
            console.error("Failed to load courses:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCourses();
    }, [loadCourses]);

    // Search filter
    const filteredCourses = courses.filter((c) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            c.courseName?.toLowerCase().includes(q) ||
            String(c.courseId)?.toLowerCase().includes(q) ||
            c.courseCode?.toLowerCase().includes(q) ||
            c.departmentName?.toLowerCase().includes(q) ||
            c.professor?.toLowerCase().includes(q)
        );
    });

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));
    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // ─── Handlers ──────────────────────────────────────────────
    const handleCreate = async (formData) => {
        try {
            console.log("[ManageCourses] Creating course:", JSON.stringify(formData, null, 2));
            await createCourse(formData);
            setIsCreateFormOpen(false);
            await loadCourses();
        } catch (err) {
            console.error("Failed to create course:", err);
        }
    };

    const handleEditSubmit = async (formData) => {
        try {
            console.log("[ManageCourses] Editing course:", editingCourse.courseId, JSON.stringify(formData, null, 2));
            await updateCourse(editingCourse.courseId, formData);
            setEditingCourse(null);
            await loadCourses();
        } catch (err) {
            console.error("Failed to update course:", err);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            await deleteCourse(deleteTarget.courseId);
            await loadCourses();
        } catch (err) {
            console.error("Failed to delete course:", err);
        }
        setDeleteTarget(null);
    };

    const handleActivate = async (course) => {
        try {
            await activateCourse(course.courseId);
            await loadCourses();
            setSuccessMessage(`Course "${course.courseName}" has been activated successfully!`);
        } catch (err) {
            console.error("Failed to activate course:", err);
        }
    };

    const handleDeactivate = async (course) => {
        try {
            await deactivateCourse(course.courseId);
            await loadCourses();
            setSuccessMessage(`Course "${course.courseName}" has been deactivated successfully.`);
        } catch (err) {
            console.error("Failed to deactivate course:", err);
        }
    };

    const handleManage = (course) => {
        navigate(`/admin/courses/${course.courseId}`);
    };

    const handleDeleteSelected = async () => {
        for (const idx of selectedRows) {
            const row = paginatedCourses[idx];
            if (row) {
                try { await deleteCourse(row.courseId); } catch (err) { console.error(err); }
            }
        }
        setSelectedRows([]);
        setIsDeleteSelectedOpen(false);
        await loadCourses();
    };

    const handleActivateSelected = async () => {
        for (const idx of selectedRows) {
            const course = paginatedCourses[idx];
            if (course && !course.isActive) {
                try { await activateCourse(course.courseId); } catch (err) { console.error(err); }
            }
        }
        setSelectedRows([]);
        await loadCourses();
        setSuccessMessage(`${selectedRows.length} course(s) activated successfully!`);
    };

    const handleDeactivateSelected = async () => {
        for (const idx of selectedRows) {
            const course = paginatedCourses[idx];
            if (course && course.isActive) {
                try { await deactivateCourse(course.courseId); } catch (err) { console.error(err); }
            }
        }
        setSelectedRows([]);
        await loadCourses();
        setSuccessMessage(`${selectedRows.length} course(s) deactivated successfully.`);
    };

    // Determine selection status for bulk action buttons
    const selectedCourses = selectedRows.map((idx) => paginatedCourses[idx]).filter(Boolean);
    const allSelectedActive = selectedCourses.length > 0 && selectedCourses.every((c) => c.isActive);
    const allSelectedInactive = selectedCourses.length > 0 && selectedCourses.every((c) => !c.isActive);

    return (
        <>
            {/* Header */}
            <PageHeader title="Manage Courses" subtitle="Administer course records, activate and assign instructors">
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => setIsImportOpen(true)}>
                        <ImportIcon size={24} />
                        Import Courses
                    </Button>

                    <Button variant="primary" onClick={() => setIsCreateFormOpen(true)}>
                        <PlusIcon size={24} />
                        Add Course
                    </Button>
                </div>
            </PageHeader>

            {/* Content */}
            {isLoading ? (
                <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    Loading courses...
                </p>
            ) : error ? (
                <p className="text-center py-10 text-red-500">Error: {error}</p>
            ) : (
                <Section>
                    {/* Toolbar: Search + Toggle */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-semibold">
                            Courses{" "}
                            <span className="text-sm font-normal text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                ({filteredCourses.length})
                            </span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <SearchBar
                                placeholder="Search Courses..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <ToggleViewMode
                                isFirstMode={viewMode === "grid"}
                                onFirstModeSelect={() => setViewMode("grid")}
                                onSecondModeSelect={() => setViewMode("list")}
                                firstModeLabel={<Grid3ColIcon className="w-5 h-5" />}
                                secondModeLabel={<TableIcon className="w-5 h-5" />}
                            />
                            {viewMode === "list" && selectedRows.length > 0 && (
                                <>
                                    {allSelectedInactive && (
                                        <Button variant="success" className="whitespace-nowrap shrink-0" onClick={handleActivateSelected}>
                                            <CheckIcon size={20} />
                                            Activate ({selectedRows.length})
                                        </Button>
                                    )}
                                    {allSelectedActive && (
                                        <Button variant="warning" className="whitespace-nowrap shrink-0" onClick={handleDeactivateSelected}>
                                            <XIcon size={20} />
                                            Deactivate ({selectedRows.length})
                                        </Button>
                                    )}
                                    <Button variant="danger" className="whitespace-nowrap shrink-0" onClick={() => setIsDeleteSelectedOpen(true)}>
                                        <TrashIcon size={20} />
                                        Delete ({selectedRows.length})
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Delete Selected Confirmation */}
                    <Dialog
                        isOpen={isDeleteSelectedOpen}
                        variant="warning"
                        title="Delete Selected Courses"
                        onClose={() => setIsDeleteSelectedOpen(false)}
                        onConfirm={() => { handleDeleteSelected(); return true; }}
                        confirmText="Yes, Delete"
                        cancelText="No, Keep"
                        showCloseButton={true}
                    >
                        Are you sure you want to delete {selectedRows.length} selected course{selectedRows.length > 1 ? "s" : ""}? This action cannot be undone.
                    </Dialog>

                    {paginatedCourses.length > 0 ? (
                        viewMode === "grid" ? (
                            /* ─── Cards Grid ─── */
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                                {paginatedCourses.map((course) => (
                                    <CourseCard
                                        key={course.courseId}
                                        course={course}
                                        onEdit={setEditingCourse}
                                        onDelete={setDeleteTarget}
                                        onActivate={handleActivate}
                                        onDeactivate={handleDeactivate}
                                        onManage={handleManage}
                                    />
                                ))}
                            </div>
                        ) : (
                            /* ─── Table View ─── */
                            <div className="mb-6">
                                <Table
                                    role="course"
                                    roleLabel="Courses"
                                    headers={courseTableHeaders}
                                    data={paginatedCourses.map(buildCourseRow)}
                                    wrapInSection={false}
                                    showHeaderActions={false}
                                    showPagination={false}
                                    onSelectionChange={setSelectedRows}
                                    actions={(row) => [
                                        ...(row._raw.isActive ? [{
                                            label: "Manage Course",
                                            onClick: () => handleManage(row._raw),
                                            className: "text-text-accent-active-light dark:text-text-accent-active-dark font-medium",
                                        }] : []),
                                        {
                                            label: "Edit",
                                            onClick: () => setEditingCourse(row._raw),
                                            className: "text-text-primary-default-light dark:text-text-primary-default-dark",
                                        },
                                        row._raw.isActive
                                            ? {
                                                  label: "Deactivate",
                                                  onClick: () => handleDeactivate(row._raw),
                                                  className: "text-text-warning-default-light dark:text-text-warning-default-dark",
                                              }
                                            : {
                                                  label: "Activate",
                                                  onClick: () => handleActivate(row._raw),
                                                  className: "text-text-success-default-light dark:text-text-success-default-dark",
                                              },
                                        {
                                            label: "Delete",
                                            onClick: () => setDeleteTarget(row._raw),
                                            className: "text-text-danger-default-light dark:text-text-danger-default-dark",
                                        },
                                    ]}
                                />
                            </div>
                        )
                    ) : (
                        <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            No courses found.
                        </p>
                    )}

                    {/* Pagination */}
                    <PaginationButtons
                        totalPages={totalPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </Section>
            )}

            {/* Create Course Form */}
            {isCreateFormOpen && (
                <CourseForm
                    method="post"
                    onClose={() => setIsCreateFormOpen(false)}
                    onSubmit={handleCreate}
                />
            )}

            {/* Edit Course Form */}
            {editingCourse && (
                <CourseForm
                    method="put"
                    initialData={editingCourse}
                    onClose={() => setEditingCourse(null)}
                    onSubmit={handleEditSubmit}
                />
            )}

            {/* Import Dialog */}
            {isImportOpen && (
                <ImportDialog
                    title="Import Courses"
                    subtitle="Upload a file to bulk-import course records."
                    onClose={() => setIsImportOpen(false)}
                    onImport={(file) => {
                        console.log("Importing courses from:", file.name);
                        setIsImportOpen(false);
                    }}
                />
            )}

            {/* Delete Confirmation */}
            <Dialog
                isOpen={deleteTarget !== null}
                variant="error"
                title="Delete Course"
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => {
                    handleDeleteConfirm();
                    return true;
                }}
                confirmText="Delete"
                cancelText="Cancel"
                showCloseButton={true}
            >
                Are you sure you want to delete <strong>{deleteTarget?.courseName}</strong> ({deleteTarget?.courseCode || deleteTarget?.courseId})?
                This action cannot be undone.
            </Dialog>

            {/* Success Dialog */}
            <Dialog
                isOpen={successMessage !== null}
                variant="success"
                title="Success"
                onClose={() => setSuccessMessage(null)}
                confirmText="OK"
                showCloseButton={true}
            >
                {successMessage}
            </Dialog>
        </>
    );
}
