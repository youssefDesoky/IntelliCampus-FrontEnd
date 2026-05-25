import { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import Section from "../../../components/ui/Section";
import SearchBar from "../../../components/ui/SearchBar";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import Table from "../../../components/ui/Table";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import ToggleViewMode from "../../../components/ui/ToggleViewMode";
import DepartmentForm from "../../../feature/admin/components/DepartmentForm";
import {
    FilePenIcon,
    TrashIcon,
    BookIcon,
    UserTieIcon,
    UserIcon,
    Grid3ColIcon,
    TableIcon,
    PlusIcon,
} from "../../../components/ui/icons";
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment, fetchInstructors } from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 9;
const departmentTableHeaders = ["Department", "Head Instructor", "Courses", "Description"];

function buildDepartmentRow(department, instructorLookup = {}) {
    const headInstructorName = department.headInstructorName || instructorLookup[String(department.instructorId)] || "—";

    return {
        department: (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                    <BookIcon className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                    <p className="font-medium">{department.departmentName}</p>
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{department.id}</p>
                </div>
            </div>
        ),
        headInstructor: headInstructorName,
        courses: `${department.courseCount ?? 0}`,
        description: department.description ? (
            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark truncate max-w-xs" title={department.description}>
                {department.description}
            </span>
        ) : "—",
        _id: department.id,
        _raw: department,
    };
}

function DepartmentCard({ department, headInstructorName, onEdit, onDelete }) {
    return (
        <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg border-l-4 border-l-border-accent-default-light dark:border-l-border-accent-default-dark shadow-sm shadow-shadow-light hover:shadow-lg dark:hover:shadow-shadow-dark transition-shadow p-5 flex flex-col justify-between gap-4">
            <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                            <BookIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-base leading-tight">{department.departmentName}</h3>
                            <span className="text-xs text-text-secondary-active-light dark:text-text-secondary-active-dark">
                                {department.id}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark mb-3">
                    {headInstructorName && (
                        <div className="flex items-center gap-1.5">
                            <UserTieIcon className="w-4 h-4" />
                            <span>{headInstructorName}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <UserIcon className="w-4 h-4" />
                        <span>{department.courseCount ?? 0} courses</span>
                    </div>
                </div>

                {department.description && (
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark line-clamp-3">
                        {department.description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
                <Button
                    variant="secondary"
                    className="flex-1 justify-center text-xs px-2 py-1.5"
                    onClick={() => onEdit(department)}
                >
                    <FilePenIcon className="w-4 h-4" /> Edit
                </Button>
                <Button
                    variant="danger"
                    className="flex-1 justify-center text-xs px-2 py-1.5"
                    onClick={() => onDelete(department)}
                >
                    <TrashIcon className="w-4 h-4" /> Delete
                </Button>
            </div>
        </div>
    );
}

export default function ManageDepartments() {
    const [isAddDepartmentFormOpen, setIsAddDepartmentFormOpen] = useState(false);
    const [rawDepartments, setRawDepartments] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [editingDepartment, setEditingDepartment] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminDepartmentsViewMode") || "grid");
    const [selectedRows, setSelectedRows] = useState([]);
    const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [formIsLoading, setFormIsLoading] = useState(false);

    useEffect(() => { localStorage.setItem("adminDepartmentsViewMode", viewMode); }, [viewMode]);

    const loadDepartments = useCallback(async () => {
        try {
            setIsLoading(true);
            const [departmentData, instructorData] = await Promise.all([
                fetchDepartments(),
                fetchInstructors(),
            ]);
            setRawDepartments(Array.isArray(departmentData) ? departmentData : []);
            setInstructors(Array.isArray(instructorData) ? instructorData : []);
            setError(null);
        } catch (err) {
            setError(err.message);
            setRawDepartments([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadDepartments(); }, [loadDepartments]);

    const instructorLookup = instructors.reduce((lookup, instructor) => {
        lookup[String(instructor.id)] = instructor.name;
        return lookup;
    }, {});

    const filteredDepartments = rawDepartments.filter((department) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const headName = department.headInstructorName || instructorLookup[String(department.instructorId)] || "";
        return (
            department.departmentName?.toLowerCase().includes(query) ||
            department.description?.toLowerCase().includes(query) ||
            headName.toLowerCase().includes(query) ||
            department.id?.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE));
    const paginatedDepartments = filteredDepartments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleEdit = (department) => {
        setEditingDepartment(department);
        setIsAddDepartmentFormOpen(true);
    };

    const handleFormSubmit = async (data) => {
        try {
            setFormIsLoading(true);
            if (editingDepartment?.id) {
                await updateDepartment(editingDepartment.id, data);
            } else {
                await createDepartment(data);
            }
            await loadDepartments();
            setEditingDepartment(null);
            setIsAddDepartmentFormOpen(false);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setFormIsLoading(false);
        }
    };

    const handleDelete = (department) => {
        setDeleteTarget(department);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteDepartment(deleteTarget.id);
            await loadDepartments();
            setDeleteTarget(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            const idsToDelete = selectedRows
                .map((index) => paginatedDepartments[index]?._id)
                .filter(Boolean);
            await Promise.all(idsToDelete.map((id) => deleteDepartment(id)));
            setSelectedRows([]);
            setIsDeleteSelectedOpen(false);
            await loadDepartments();
        } catch (err) {
            setError(err.message);
        }
    };

    const tableRows = paginatedDepartments.map((department) => buildDepartmentRow(department, instructorLookup));

    return (
        <div className="space-y-6">
            <PageHeader title="Manage Departments" subtitle="Administer department records and ownership">
                <Button variant="primary" onClick={() => { setEditingDepartment(null); setIsAddDepartmentFormOpen(true); }}>
                    <PlusIcon size={24} />
                    Add Department
                </Button>
            </PageHeader>

            {error && (
                <div className="bg-bg-status-error-light dark:bg-bg-status-error-dark text-text-status-error-light dark:text-text-status-error-dark p-4 rounded-lg">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <Section>
                <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                    <h2 className="text-xl font-semibold">
                        Departments{" "}
                        <span className="text-sm font-normal text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            ({filteredDepartments.length})
                        </span>
                    </h2>
                    <div className="flex items-center gap-3">
                        <SearchBar
                            placeholder="Search departments..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                        <ToggleViewMode
                            isFirstMode={viewMode === "grid"}
                            onFirstModeSelect={() => { setViewMode("grid"); setSelectedRows([]); }}
                            onSecondModeSelect={() => { setViewMode("list"); setSelectedRows([]); }}
                            firstModeLabel={<Grid3ColIcon className="w-5 h-5" />}
                            secondModeLabel={<TableIcon className="w-5 h-5" />}
                        />
                        {viewMode === "list" && selectedRows.length > 0 && (
                            <Button variant="danger" onClick={() => setIsDeleteSelectedOpen(true)}>
                                <TrashIcon size={20} />
                                Delete ({selectedRows.length})
                            </Button>
                        )}
                    </div>
                </div>

                <Dialog
                    isOpen={isDeleteSelectedOpen}
                    variant="warning"
                    title="Delete Selected Departments"
                    onClose={() => setIsDeleteSelectedOpen(false)}
                    onConfirm={() => { handleDeleteSelected(); return true; }}
                    confirmText="Yes, Delete"
                    cancelText="No, Keep"
                    showCloseButton={true}
                >
                    Are you sure you want to delete {selectedRows.length} selected department{selectedRows.length > 1 ? "s" : ""}? This action cannot be undone.
                </Dialog>

                {isLoading ? (
                    <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading departments...</p>
                ) : filteredDepartments.length === 0 ? (
                    <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">No departments found.</p>
                ) : (
                    <>
                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                                {paginatedDepartments.map((department) => (
                                    <DepartmentCard
                                        key={department.id}
                                        department={department}
                                        headInstructorName={department.headInstructorName || instructorLookup[String(department.instructorId)] || ""}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="mb-6">
                                <Table
                                    role="department"
                                    headers={departmentTableHeaders}
                                    data={tableRows}
                                    wrapInSection={false}
                                    showHeaderActions={false}
                                    showPagination={false}
                                    onSelectionChange={setSelectedRows}
                                    actions={(row) => ([
                                        { label: "Edit", onClick: () => { setEditingDepartment(row._raw); setIsAddDepartmentFormOpen(true); } },
                                        { label: "Delete", onClick: () => setDeleteTarget(row._raw) },
                                    ])}
                                />
                            </div>
                        )}

                        {totalPages > 1 && (
                            <Section>
                                <PaginationButtons
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </Section>
                        )}
                    </>
                )}

                {isAddDepartmentFormOpen && (
                    <DepartmentForm
                        onClose={() => {
                            setIsAddDepartmentFormOpen(false);
                            setEditingDepartment(null);
                        }}
                        onSubmit={handleFormSubmit}
                        initialData={editingDepartment || {}}
                        instructors={instructors}
                        isLoading={formIsLoading}
                    />
                )}

                <Dialog
                    isOpen={!!deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    title="Delete Department"
                >
                    <div className="space-y-4">
                        <p className="text-text-primary-default-light dark:text-text-primary-default-dark">
                            Are you sure you want to delete <strong>{deleteTarget?.departmentName}</strong>?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={confirmDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </Section>
        </div>
    );
}