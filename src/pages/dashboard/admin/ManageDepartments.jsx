import { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import Section from "../../../components/ui/Section";
import SearchBar from "../../../components/ui/SearchBar";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import Table from "../../../components/ui/Table";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import DepartmentForm from "../../../feature/admin/components/DepartmentForm";
import {
    FilePenIcon,
    TrashIcon,
    PlusIcon,
} from "../../../components/ui/icons";
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment, fetchInstructors } from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 10;
const departmentTableHeaders = ["Department Name", "Head Instructor", "Courses", "Description"];

function buildDepartmentRow(department, instructorLookup = {}) {
    const headInstructorName = department.headInstructorName || instructorLookup[String(department.instructorId)] || "—";

    return {
        department: (
            <div className="flex flex-col text-left">
                <p className="font-medium">{department.departmentName}</p>
                <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark" dir="rtl">{department.departmentNameAr || "—"}</p>
            </div>
        ),
        headInstructor: headInstructorName,
        courses: `${department.courseCount ?? 0}`,
        description: department.description ? (
            <span className="truncate max-w-xs" title={department.description}>
                {department.description}
            </span>
        ) : "—",
        _id: department.id,
        _raw: department,
    };
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
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [formIsLoading, setFormIsLoading] = useState(false);

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
        lookup[String(instructor.instructorId)] = instructor.name;
        return lookup;
    }, {});

    const filteredDepartments = rawDepartments.filter((department) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const headName = department.headInstructorName || instructorLookup[String(department.instructorId)] || "";
        return (
            department.departmentName?.toLowerCase().includes(query) ||
            department.departmentNameAr?.toLowerCase().includes(query) ||
            department.description?.toLowerCase().includes(query) ||
            headName.toLowerCase().includes(query) ||
            department.id?.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE));
    const paginatedDepartments = filteredDepartments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const selectedIndices = paginatedDepartments.map((d, i) => selectedRowIds.includes(d.id) ? i : -1).filter(i => i !== -1);

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
            await Promise.all(selectedRowIds.map((id) => deleteDepartment(id)));
            setSelectedRowIds([]);
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
                        {selectedRowIds.length > 0 && (
                            <Button variant="danger" onClick={() => setIsDeleteSelectedOpen(true)}>
                                <TrashIcon size={20} />
                                Delete ({selectedRowIds.length})
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
                    Are you sure you want to delete {selectedRowIds.length} selected department{selectedRowIds.length > 1 ? "s" : ""}? This action cannot be undone.
                </Dialog>

                {isLoading ? (
                    <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading departments...</p>
                ) : filteredDepartments.length === 0 ? (
                    <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">No departments found.</p>
                ) : (
                    <>
                        <div className="mb-6">
                            <Table
                                role="department"
                                headers={departmentTableHeaders}
                                data={tableRows}
                                wrapInSection={false}
                                showHeaderActions={false}
                                showPagination={false}
                                selectedRows={selectedIndices}
                                onSelectionChange={(indices) => {
                                    const visibleIds = new Set(paginatedDepartments.map(d => d.id).filter(Boolean));
                                    setSelectedRowIds([...selectedRowIds.filter(id => !visibleIds.has(id)), ...indices.map(i => paginatedDepartments[i]?.id).filter(Boolean)]);
                                }}
                                actions={(row) => ([
                                    { label: "Edit", onClick: () => { setEditingDepartment(row._raw); setIsAddDepartmentFormOpen(true); } },
                                    { label: "Delete", onClick: () => setDeleteTarget(row._raw) },
                                ])}
                            />
                        </div>

                        {totalPages > 1 && (
                            <Section>
                                <PaginationButtons
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    setCurrentPage={setCurrentPage}
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