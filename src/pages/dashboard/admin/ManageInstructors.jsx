import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../../../components/ui/UserHeader";
import Section from "../../../components/ui/Section";
import SearchBar from "../../../components/ui/SearchBar";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import Table from "../../../components/ui/Table";
import InstructorForm from "../../../feature/admin/components/InstructorForm";
import {
    TrashIcon,
    UserIcon,
} from "../../../components/ui/icons";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import { fetchInstructors, createInstructor, deleteInstructor } from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 10;
const instructorTableHeaders = ["Instructor ID", "Instructor", "Department", "Specialization", "Role"];

function buildInstructorRow(i) {
    return {
        instructorID: i.instructorId || "—",
        instructor: (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark overflow-hidden">
                    {i.profileImage ? <img src={i.profileImage} alt={i.fullName} className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-text-secondary-default-light dark:text-text-secondary-default-dark" />}
                </div>
                <div className="flex flex-col text-left">
                    <p>{i.fullName}</p>
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{i.email}</p>
                </div>
            </div>
        ),
        department: i.departmentName || "—",
        specialization: i.specialization || "—",
        role: i.role || "—",
        _id: i.userId,
        _raw: i,
    };
}

export default function ManageInstructors() {
    const navigate = useNavigate();
    const [isAddInstructorFormOpen, setIsAddInstructorFormOpen] = useState(false);
    const [rawInstructors, setRawInstructors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [editingInstructor, setEditingInstructor] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [filterDepartment, setFilterDepartment] = useState([]);
    const [filterType, setFilterType] = useState([]);

    const loadInstructors = useCallback(async () => {
        try {
            setError(null);
            const data = await fetchInstructors();
            setRawInstructors(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load instructors:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadInstructors(); }, [loadInstructors]);

    const departments = useMemo(() => {
        const set = new Set(rawInstructors.map((i) => i.departmentName).filter(Boolean));
        return [...set].sort();
    }, [rawInstructors]);

    const instructorTypes = useMemo(() => {
        const set = new Set(rawInstructors.map((i) => i.role).filter(Boolean));
        return [...set].sort();
    }, [rawInstructors]);

    const filteredInstructors = rawInstructors.filter((i) => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            if (!(
                i.fullName?.toLowerCase().includes(q) ||
                i.instructorId?.toLowerCase().includes(q) ||
                i.email?.toLowerCase().includes(q) ||
                i.departmentName?.toLowerCase().includes(q) ||
                i.specialization?.toLowerCase().includes(q)
            )) return false;
        }
        if (filterDepartment.length > 0 && !filterDepartment.includes(i.departmentName)) return false;
        if (filterType.length > 0 && !filterType.includes(i.role)) return false;
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredInstructors.length / ITEMS_PER_PAGE));
    const paginatedInstructors = filteredInstructors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const paginatedRows = paginatedInstructors.map(buildInstructorRow);
    const selectedIndices = paginatedRows.map((row, i) => selectedRowIds.includes(row._id) ? i : -1).filter(i => i !== -1);

    const handleDelete = async (rowIndex) => {
        const row = paginatedRows[rowIndex];
        if (!row?._id) return;
        try { await deleteInstructor(row._id); await loadInstructors(); }
        catch (err) { console.error("Failed to delete instructor:", err); }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try { await deleteInstructor(deleteTarget.userId); await loadInstructors(); }
        catch (err) { console.error("Failed to delete instructor:", err); }
        setDeleteTarget(null);
    };

    const handleDeleteSelected = async () => {
        for (const id of selectedRowIds) {
            try { await deleteInstructor(id); } catch (err) { console.error(err); }
        }
        setSelectedRowIds([]);
        setIsDeleteSelectedOpen(false);
        await loadInstructors();
    };

    const handleCreate = async (formData) => {
        try { console.log("[ManageInstructors] Creating instructor:", JSON.stringify(formData, null, 2)); await createInstructor(formData); setIsAddInstructorFormOpen(false); await loadInstructors(); }
        catch (err) { console.error("Failed to create instructor:", err); }
    };

    return (
        <>
            <UserHeader role="instructor" setIsUserFormOpen={setIsAddInstructorFormOpen} />

            {isLoading ? (
                <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading instructors...</p>
            ) : error ? (
                <p className="text-center py-10 text-red-500">Error: {error}</p>
            ) : (
                <Section>
                    <div className="flex items-center justify-between gap-4 mb-3">
                        <h2 className="text-xl font-semibold">
                            Instructors{" "}
                            <span className="text-sm font-normal text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                ({filteredInstructors.length})
                            </span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <SearchBar
                                placeholder="Search Instructors..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            />
                            <FilterDropdown
                                label="Department"
                                options={departments.map((d) => ({ value: d, label: d }))}
                                selectedValues={filterDepartment}
                                onChange={(v) => { setFilterDepartment(v); setCurrentPage(1); }}
                            />
                            <FilterDropdown
                                label="Type"
                                options={instructorTypes.map((t) => ({ value: t, label: t }))}
                                selectedValues={filterType}
                                onChange={(v) => { setFilterType(v); setCurrentPage(1); }}
                            />
                            {selectedRowIds.length > 0 && (
                                <Button 
                                    variant="danger"
                                    onClick={() => setIsDeleteSelectedOpen(true)}
                                >
                                    <TrashIcon size={20} />
                                    Delete ({selectedRowIds.length})
                                </Button>
                            )}
                        </div>
                    </div>

                    <Dialog
                        isOpen={isDeleteSelectedOpen}
                        variant="warning"
                        title="Delete Selected Instructors"
                        onClose={() => setIsDeleteSelectedOpen(false)}
                        onConfirm={() => { handleDeleteSelected(); return true; }}
                        confirmText="Yes, Delete"
                        cancelText="No, Keep"
                        showCloseButton={true}
                    >
                        Are you sure you want to delete {selectedRowIds.length} selected instructor{selectedRowIds.length > 1 ? "s" : ""}? This action cannot be undone.
                    </Dialog>

                    {paginatedInstructors.length > 0 ? (
                        <div className="mb-6">
                            <Table
                                role="instructor"
                                headers={instructorTableHeaders}
                                data={paginatedRows}
                                wrapInSection={false}
                                showHeaderActions={false}
                                showPagination={false}
                                selectedRows={selectedIndices}
                                page={currentPage}
                                onPageChange={setCurrentPage}
                                totalPages={totalPages}
                                totalItems={filteredInstructors.length}
                                itemsLabel="Instructors"
                                from={(currentPage - 1) * ITEMS_PER_PAGE + 1}
                                to={Math.min(currentPage * ITEMS_PER_PAGE, filteredInstructors.length)}
                                onSelectionChange={(indices) => {
                                    const visibleIds = new Set(paginatedRows.map(r => r._id).filter(Boolean));
                                    setSelectedRowIds([...selectedRowIds.filter(id => !visibleIds.has(id)), ...indices.map(i => paginatedRows[i]?._id).filter(Boolean)]);
                                }}
                                onDelete={handleDelete}
                                onPreview={(i) => navigate(`/admin/instructors/${i.userId || i._id || i.instructorId}`)}
                            />
                        </div>
                    ) : (
                        <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            No instructors found.
                        </p>
                    )}


                </Section>
            )}

            {isAddInstructorFormOpen && (
                <InstructorForm method="post" onClose={() => setIsAddInstructorFormOpen(false)} onSubmit={handleCreate} />
            )}

            {editingInstructor && (
                <InstructorForm method="put" initialData={editingInstructor} onClose={() => setEditingInstructor(null)} />
            )}

            <Dialog
                isOpen={deleteTarget !== null}
                variant="error"
                title="Delete Instructor"
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => { handleDeleteConfirm(); return true; }}
                confirmText="Delete"
                cancelText="Cancel"
                showCloseButton={true}
            >
                Are you sure you want to delete <strong>{deleteTarget?.fullName}</strong> ({deleteTarget?.instructorId})? This action cannot be undone.
            </Dialog>


        </>
    );
}
