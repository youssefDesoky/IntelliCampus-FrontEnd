import { useState, useEffect, useCallback } from "react";
import UserHeader from "../../../components/ui/UserHeader";
import Section from "../../../components/ui/Section";
import SearchBar from "../../../components/ui/SearchBar";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import Table from "../../../components/ui/Table";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import ToggleViewMode from "../../../components/ui/ToggleViewMode";
import InstructorForm from "../../../feature/admin/components/InstructorForm";
import {
    FilePenIcon,
    TrashIcon,
    BookIcon,
    StarIcon,
    UserIcon,
    Grid3ColIcon,
    TableIcon,
} from "../../../components/ui/icons";
import { fetchInstructors, createInstructor, deleteInstructor } from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 9;
const instructorTableHeaders = ["Instructor", "Instructor ID", "Department", "Role", "Specialization"];

function buildInstructorRow(i) {
    return {
        instructor: (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                    {(i.fullName || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                    <p>{i.fullName}</p>
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{i.email}</p>
                </div>
            </div>
        ),
        instructorID: i.instructorId || "—",
        department: i.departmentName || "—",
        role: i.role || "—",
        specialization: i.specialization || "—",
        _id: i.userId,
        _raw: i,
    };
}

function InstructorCard({ instructor, onEdit, onDelete }) {
    return (
        <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg border-l-4 border-l-border-accent-default-light dark:border-l-border-accent-default-dark shadow-sm shadow-shadow-light hover:shadow-lg dark:hover:shadow-shadow-dark transition-shadow p-5 flex flex-col justify-between gap-4">
            <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                            {(instructor.fullName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-semibold text-base leading-tight">{instructor.fullName}</h3>
                            <span className="text-xs text-text-secondary-active-light dark:text-text-secondary-active-dark">
                                {instructor.instructorId}
                            </span>
                        </div>
                    </div>
                    {instructor.role && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-secondary-active-light dark:text-text-secondary-active-dark">
                            {instructor.role}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark mb-3">
                    {instructor.email && (
                        <div className="flex items-center gap-1.5">
                            <UserIcon className="w-4 h-4" />
                            <span className="truncate max-w-40">{instructor.email}</span>
                        </div>
                    )}
                    {instructor.departmentName && (
                        <div className="flex items-center gap-1.5">
                            <BookIcon className="w-4 h-4" />
                            <span>{instructor.departmentName}</span>
                        </div>
                    )}
                    {instructor.specialization && (
                        <div className="flex items-center gap-1.5">
                            <StarIcon className="w-4 h-4" />
                            <span>{instructor.specialization}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
                <Button
                    variant="secondary"
                    className="flex-1 justify-center text-xs px-2 py-1.5"
                    onClick={() => onEdit(instructor)}
                >
                    <FilePenIcon className="w-4 h-4" /> Edit
                </Button>
                <Button
                    variant="danger"
                    className="flex-1 justify-center text-xs px-2 py-1.5"
                    onClick={() => onDelete(instructor)}
                >
                    <TrashIcon className="w-4 h-4" /> Delete
                </Button>
            </div>
        </div>
    );
}

export default function ManageInstructors() {
    const [isAddInstructorFormOpen, setIsAddInstructorFormOpen] = useState(false);
    const [rawInstructors, setRawInstructors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [editingInstructor, setEditingInstructor] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminInstructorsViewMode") || "grid");
    const [selectedRows, setSelectedRows] = useState([]);
    const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => { localStorage.setItem("adminInstructorsViewMode", viewMode); }, [viewMode]);

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

    const filteredInstructors = rawInstructors.filter((i) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            i.fullName?.toLowerCase().includes(q) ||
            i.instructorId?.toLowerCase().includes(q) ||
            i.email?.toLowerCase().includes(q) ||
            i.departmentName?.toLowerCase().includes(q) ||
            i.specialization?.toLowerCase().includes(q)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredInstructors.length / ITEMS_PER_PAGE));
    const paginatedInstructors = filteredInstructors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const paginatedRows = paginatedInstructors.map(buildInstructorRow);

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
        for (const idx of selectedRows) {
            const row = paginatedRows[idx];
            if (row?._id) {
                try { await deleteInstructor(row._id); } catch (err) { console.error(err); }
            }
        }
        setSelectedRows([]);
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
                    <div className="flex items-center justify-between gap-4 mb-6">
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
                            <ToggleViewMode
                                isFirstMode={viewMode === "grid"}
                                onFirstModeSelect={() => setViewMode("grid")}
                                onSecondModeSelect={() => setViewMode("list")}
                                firstModeLabel={<Grid3ColIcon className="w-5 h-5" />}
                                secondModeLabel={<TableIcon className="w-5 h-5" />}
                            />
                            {viewMode === "list" && selectedRows.length > 0 && (
                                <Button 
                                    variant="danger"
                                    onClick={() => setIsDeleteSelectedOpen(true)}
                                >
                                    <TrashIcon size={20} />
                                    Delete ({selectedRows.length})
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
                        Are you sure you want to delete {selectedRows.length} selected instructor{selectedRows.length > 1 ? "s" : ""}? This action cannot be undone.
                    </Dialog>

                    {paginatedInstructors.length > 0 ? (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                                {paginatedInstructors.map((i) => (
                                    <InstructorCard
                                        key={i.instructorId}
                                        instructor={i}
                                        onEdit={setEditingInstructor}
                                        onDelete={setDeleteTarget}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="mb-6">
                                <Table
                                    role="instructor"
                                    headers={instructorTableHeaders}
                                    data={paginatedRows}
                                    wrapInSection={false}
                                    showHeaderActions={false}
                                    showPagination={false}
                                    onSelectionChange={setSelectedRows}
                                    onDelete={handleDelete}
                                />
                            </div>
                        )
                    ) : (
                        <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            No instructors found.
                        </p>
                    )}

                    <PaginationButtons totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
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
