import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import Section from "../../../components/ui/Section";
import Button from "../../../components/ui/Button";
import SearchBar from "../../../components/ui/SearchBar";
import Dialog from "../../../components/ui/Dialog";
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
} from "../../../components/ui/icons";
import {
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    activateCourse,
    deactivateCourse,
} from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 10;

function StatusBadge({ isActive, displaySemester }) {
    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                isActive
                    ? "bg-bg-fill-success-default-light dark:bg-bg-fill-success-default-dark text-white"
                    : "bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-secondary-active-light dark:text-text-secondary-active-dark"
            }`}
        >
            {isActive ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
            {isActive ? displaySemester : "Inactive"}
        </span>
    );
}

const courseTableHeaders = ["Course", "Course Code", "Department", "Credit Hours", "Professor", "Status"];

function buildCourseRow(course) {
    return {
        course: (
            <div className="flex flex-col text-left">
                <p className="font-medium">{course.courseName}</p>
                <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-50 truncate">{course.description}</p>
            </div>
        ),
        courseId: (
            <span className="px-2 py-1 rounded-full border text-xs font-semibold">{course.courseCode || course.courseId}</span>
        ),
        department: course.departmentName || "—",
        creditHours: course.creditHours || "—",
        professor: course.professor || "—",
        status: <StatusBadge isActive={course.isActive} displaySemester={course.semester} />,
        _raw: course,
    };
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
    const [viewingCourse, setViewingCourse] = useState(null);

    const [successMessage, setSuccessMessage] = useState(null);

    // Table selection
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

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
    const selectedIndices = paginatedCourses.map((c, i) => selectedRowIds.includes(c.courseId) ? i : -1).filter(i => i !== -1);

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
        for (const id of selectedRowIds) {
            try { await deleteCourse(id); } catch (err) { console.error(err); }
        }
        setSelectedRowIds([]);
        setIsDeleteSelectedOpen(false);
        await loadCourses();
    };

    const handleActivateSelected = async () => {
        for (const id of selectedRowIds) {
            const course = courses.find(c => c.courseId === id);
            if (course && !course.isActive) {
                try { await activateCourse(id); } catch (err) { console.error(err); }
            }
        }
        setSelectedRowIds([]);
        await loadCourses();
        setSuccessMessage(`${selectedRowIds.length} course(s) activated successfully!`);
    };

    const handleDeactivateSelected = async () => {
        for (const id of selectedRowIds) {
            const course = courses.find(c => c.courseId === id);
            if (course && course.isActive) {
                try { await deactivateCourse(id); } catch (err) { console.error(err); }
            }
        }
        setSelectedRowIds([]);
        await loadCourses();
        setSuccessMessage(`${selectedRowIds.length} course(s) deactivated successfully.`);
    };

    // Determine selection status for bulk action buttons
    const selectedCoursesData = selectedRowIds.map(id => courses.find(c => c.courseId === id)).filter(Boolean);
    const allSelectedActive = selectedCoursesData.length > 0 && selectedCoursesData.every((c) => c.isActive);
    const allSelectedInactive = selectedCoursesData.length > 0 && selectedCoursesData.every((c) => !c.isActive);

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
                    <div className="flex items-center justify-between gap-4 mb-3">
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
                            {selectedRowIds.length > 0 && (
                                <>
                                    {allSelectedInactive && (
                                        <Button variant="success" className="whitespace-nowrap shrink-0" onClick={handleActivateSelected}>
                                            <CheckIcon size={20} />
                                            Activate ({selectedRowIds.length})
                                        </Button>
                                    )}
                                    {allSelectedActive && (
                                        <Button variant="warning" className="whitespace-nowrap shrink-0" onClick={handleDeactivateSelected}>
                                            <XIcon size={20} />
                                            Deactivate ({selectedRowIds.length})
                                        </Button>
                                    )}
                                    <Button variant="danger" className="whitespace-nowrap shrink-0" onClick={() => setIsDeleteSelectedOpen(true)}>
                                        <TrashIcon size={20} />
                                        Delete ({selectedRowIds.length})
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
                        Are you sure you want to delete {selectedRowIds.length} selected course{selectedRowIds.length > 1 ? "s" : ""}? This action cannot be undone.
                    </Dialog>

                    {paginatedCourses.length > 0 ? (
                        <div className="mb-6">
                            <Table
                                role="course"
                                roleLabel="Courses"
                                headers={courseTableHeaders}
                                data={paginatedCourses.map(buildCourseRow)}
                                wrapInSection={false}
                                showHeaderActions={false}
                                showPagination={false}
                                selectedRows={selectedIndices}
                                page={currentPage}
                                onPageChange={setCurrentPage}
                                totalPages={totalPages}
                                totalItems={filteredCourses.length}
                                itemsLabel="Courses"
                                from={(currentPage - 1) * ITEMS_PER_PAGE + 1}
                                to={Math.min(currentPage * ITEMS_PER_PAGE, filteredCourses.length)}
                                onSelectionChange={(indices) => {
                                    const visibleIds = new Set(paginatedCourses.map(c => c.courseId).filter(Boolean));
                                    setSelectedRowIds([...selectedRowIds.filter(id => !visibleIds.has(id)), ...indices.map(i => paginatedCourses[i]?.courseId).filter(Boolean)]);
                                }}
                                actions={(row) => [
                                    ...(row._raw.isActive ? [{
                                        label: "Manage Course",
                                        onClick: () => handleManage(row._raw),
                                        className: "text-text-secondary-default-light dark:text-text-accent-active-dark font-medium",
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
                    ) : (
                        <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            No courses found.
                        </p>
                    )}


                </Section>
            )}

            {/* Create Course Form */}
            {isCreateFormOpen && (
                <CourseForm
                    method="post"
                    onClose={() => setIsCreateFormOpen(false)}
                    onSubmit={handleCreate}
                    allCourses={courses}
                />
            )}

            {/* Edit Course Form */}
            {editingCourse && (
                <CourseForm
                    method="put"
                    initialData={editingCourse}
                    onClose={() => setEditingCourse(null)}
                    onSubmit={handleEditSubmit}
                    allCourses={courses}
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

            {/* Course Details Modal */}
            {viewingCourse && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                {viewingCourse.courseName || viewingCourse.title || "Course Details"}
                            </h2>
                            <button
                                onClick={() => setViewingCourse(null)}
                                className="text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark transition-colors"
                            >
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Course Code & Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Course Code</p>
                                    <p className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                                        {viewingCourse.courseCode || viewingCourse.id || viewingCourse.courseId || "—"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Status</p>
                                    <StatusBadge isActive={!!viewingCourse.isActive} />
                                </div>
                            </div>

                            {/* Description */}
                            {viewingCourse.description && (
                                <div>
                                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2">Description</p>
                                    <p className="text-text-primary-default-light dark:text-text-primary-default-dark">
                                        {viewingCourse.description}
                                    </p>
                                </div>
                            )}

                            {/* Academic Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Department</p>
                                    <p className="text-text-primary-default-light dark:text-text-primary-default-dark font-medium">
                                        {viewingCourse.departmentName || viewingCourse.department || "—"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Credit Hours</p>
                                    <p className="text-text-primary-default-light dark:text-text-primary-default-dark font-medium">
                                        {viewingCourse.creditHours ?? viewingCourse.credits ?? "—"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Semester</p>
                                    <p className="text-text-primary-default-light dark:text-text-primary-default-dark font-medium">
                                        {viewingCourse.semester || viewingCourse.level || viewingCourse.term || "—"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Professor</p>
                                    <p className="text-text-primary-default-light dark:text-text-primary-default-dark font-medium">
                                        {viewingCourse.professor || viewingCourse.instructor || "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Enrollment Details */}
                            <div className="grid grid-cols-2 gap-4 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-lg p-4">
                                <div>
                                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Enrolled Students</p>
                                    <p className="text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                        {viewingCourse.numOfStudents ?? viewingCourse.enrolledCount ?? viewingCourse.enrolled ?? "0"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Capacity</p>
                                    <p className="text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                        {viewingCourse.capacity ?? viewingCourse.maxStudents ?? "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Schedule & Room (if available) */}
                            {(viewingCourse.schedule || viewingCourse.room) && (
                                <div className="grid grid-cols-2 gap-4">
                                    {viewingCourse.schedule && (
                                        <div>
                                            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Schedule</p>
                                            <p className="text-text-primary-default-light dark:text-text-primary-default-dark font-medium">
                                                {viewingCourse.schedule}
                                            </p>
                                        </div>
                                    )}
                                    {viewingCourse.room && (
                                        <div>
                                            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Room</p>
                                            <p className="text-text-primary-default-light dark:text-text-primary-default-dark font-medium">
                                                {viewingCourse.room}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setViewingCourse(null);
                                        setEditingCourse(viewingCourse);
                                    }}
                                >
                                    Edit Course
                                </Button>
                                {viewingCourse.isActive && (
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            setViewingCourse(null);
                                            handleManage(viewingCourse);
                                        }}
                                    >
                                        Manage Course
                                    </Button>
                                )}
                                <Button
                                    variant="tertiary"
                                    onClick={() => setViewingCourse(null)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

