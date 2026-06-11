import { useState, useEffect, useCallback } from "react";
import UserHeader from "../../../components/ui/UserHeader";
import Section from "../../../components/ui/Section";
import SearchBar from "../../../components/ui/SearchBar";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import Table from "../../../components/ui/Table";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import ToggleViewMode from "../../../components/ui/ToggleViewMode";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import InstructorForm from "../../../feature/admin/components/InstructorForm";
import {
    FilePenIcon,
    TrashIcon,
    BookIcon,
    StarIcon,
    UserIcon,
    Grid3ColIcon,
    TableIcon,
    XIcon,
} from "../../../components/ui/icons";
import { fetchInstructors, createInstructor, deleteInstructor } from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 9;
const instructorTableHeaders = ["Instructor", "Instructor ID", "Department", "Role", "Specialization", "Status"];

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
        status: i.role === "Professor" ? (i.employmentStatus || i.professorStatus || "—") : "—",
        _id: i.userId,
        _raw: i,
    };
}

import AdminCard from "../../../components/ui/AdminCard";

function InstructorCard({ instructor, onEdit, onDelete, onPreview }) {
    const meta = [];
    if (instructor.departmentName) meta.push({ icon: BookIcon, label: instructor.departmentName });
    if (instructor.specialization) meta.push({ icon: StarIcon, label: instructor.specialization });
    if (instructor.phone) meta.push({ icon: UserIcon, label: instructor.phone });
    if (instructor.office) meta.push({ icon: BookIcon, label: instructor.office });

    const actions = [
        { label: 'Edit', variant: 'secondary', icon: FilePenIcon, onClick: (e) => { e?.stopPropagation?.(); onEdit(instructor); } },
        { label: 'Delete', variant: 'danger', icon: TrashIcon, onClick: (e) => { e?.stopPropagation?.(); onDelete(instructor); } },
    ];

    const stats = [
        { label: "Courses", value: instructor.coursesTaught?.length ?? 0 },
        { label: "Office Hours", value: instructor.officeHours ? "Set" : "—" },
    ];

    return (
        <div className="cursor-pointer" onClick={() => onPreview?.(instructor)}>
            <AdminCard
                avatar={instructor.avatar}
                title={instructor.fullName || instructor.name}
                subtitle={instructor.email}
                idLabel={instructor.instructorId}
                status={{ label: instructor.employmentStatus || instructor.role || "Instructor", tone: instructor.employmentStatus === "Permanent" ? "success" : "warning" }}
                stats={stats}
                meta={meta}
                footerActions={actions}
            >
                <div className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    {instructor.role === "Professor" ? `Professor • ${instructor.departmentName || "No department"}` : `Support staff • ${instructor.departmentName || "No department"}`}
                </div>
            </AdminCard>
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
    const [previewInstructor, setPreviewInstructor] = useState(null);

    const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminInstructorsViewMode") || "grid");
    const [selectedRowIds, setSelectedRowIds] = useState([]);
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
                                onFirstModeSelect={() => { setViewMode("grid"); setSelectedRowIds([]); }}
                                onSecondModeSelect={() => { setViewMode("list"); setSelectedRowIds([]); }}
                                firstModeLabel={<Grid3ColIcon className="w-5 h-5" />}
                                secondModeLabel={<TableIcon className="w-5 h-5" />}
                            />
                            {viewMode === "list" && selectedRowIds.length > 0 && (
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
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                                {paginatedInstructors.map((i) => (
                                    <InstructorCard
                                        key={i.instructorId}
                                        instructor={i}
                                        onEdit={setEditingInstructor}
                                        onDelete={setDeleteTarget}
                                        onPreview={setPreviewInstructor}
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
                                    selectedRows={selectedIndices}
                                    onSelectionChange={(indices) => {
                                        const visibleIds = new Set(paginatedRows.map(r => r._id).filter(Boolean));
                                        setSelectedRowIds([...selectedRowIds.filter(id => !visibleIds.has(id)), ...indices.map(i => paginatedRows[i]?._id).filter(Boolean)]);
                                    }}
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

            {previewInstructor && (
                <ModelOverlay
                    onClose={() => setPreviewInstructor(null)}
                    maxWidth="max-w-5xl"
                >
                    <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
                        <div className="sticky top-0 z-10 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark p-4 px-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                    Instructor Profile Explorer
                                </span>
                            </div>
                            <button
                                onClick={() => setPreviewInstructor(null)}
                                className="p-1.5 rounded-lg text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-accent-default-light dark:hover:bg-bg-surface-accent-default-dark hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark transition-all"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1 h-full flex flex-col items-center text-center p-5 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                                    <div className="w-28 h-28 rounded-2xl overflow-hidden bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark ring-4 ring-bg-surface-primary-default-light dark:ring-bg-surface-primary-default-dark shadow-md shrink-0 mb-4">
                                        {previewInstructor.avatar ? (
                                            <img
                                                src={previewInstructor.avatar}
                                                alt={previewInstructor.fullName || previewInstructor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                                {(previewInstructor.fullName || previewInstructor.name || "?").charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-bold tracking-tight text-text-primary-default-light dark:text-text-primary-default-dark line-clamp-2 px-2">
                                        {previewInstructor.fullName || previewInstructor.name}
                                    </h2>
                                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1 font-mono">
                                        ID: {previewInstructor.instructorId || "—"}
                                    </p>
                                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark break-all max-w-full px-2 mt-0.5">
                                        {previewInstructor.email || "—"}
                                    </p>

                                    <div className="w-full mt-auto pt-6">
                                        <div className="w-3/4 mx-auto border-t border-border-primary-default-light dark:border-border-primary-default-dark mb-6"></div>

                                        <div className="grid grid-cols-2 gap-2 w-full">
                                            <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-3 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark">
                                                <span className="block text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Courses</span>
                                                <span className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                                    {(previewInstructor.coursesTaught || []).length}
                                                </span>
                                            </div>
                                            <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-3 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark">
                                                <span className="block text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Status</span>
                                                <span className="text-sm font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                                    {previewInstructor.employmentStatus || previewInstructor.professorStatus || "—"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-2 h-full flex flex-col border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl p-5 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary-default-light dark:text-text-primary-default-dark mb-4 pb-2 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
                                        Administrative Information
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm mt-2">
                                        <div className="space-y-0.5">
                                            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Department</span>
                                            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewInstructor.departmentName || previewInstructor.department || "—"}</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Role</span>
                                            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewInstructor.role || "—"}</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Specialization</span>
                                            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewInstructor.specialization || "—"}</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Office</span>
                                            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewInstructor.office || "—"}</span>
                                        </div>

                                        <div className="sm:col-span-2 my-1 border-t border-dashed border-border-primary-default-light dark:border-border-primary-default-dark pt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                            <div className="space-y-0.5">
                                                <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Phone Number</span>
                                                <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewInstructor.phone || "—"}</span>
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Office Hours</span>
                                                <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewInstructor.officeHours || "—"}</span>
                                            </div>

                                            <div className="sm:col-span-2 space-y-0.5">
                                                <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">About</span>
                                                <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark wrap-break-word line-clamp-3" title={previewInstructor.bio || "No bio available."}>
                                                    {previewInstructor.bio || "No bio available."}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl p-5 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark w-full">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary-default-light dark:text-text-primary-default-dark mb-4">
                                    Courses Taught
                                </h3>

                                {(previewInstructor.coursesTaught || []).length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {(previewInstructor.coursesTaught || []).map((course, index) => (
                                            <span key={index} className="px-3 py-1 rounded-full text-xs bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-secondary-active-light dark:text-text-secondary-active-dark">
                                                {course}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 rounded-lg border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                        No courses listed for this instructor.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="sticky bottom-0 mt-auto bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-t border-border-primary-default-light dark:border-border-primary-default-dark p-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto order-2 sm:order-1"
                                onClick={() => console.log("Message", previewInstructor)}
                            >
                                Send Message
                            </Button>

                            <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="flex-1 sm:flex-initial"
                                    onClick={() => {
                                        setEditingInstructor(previewInstructor);
                                        setPreviewInstructor(null);
                                    }}
                                >
                                    Edit Profile
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="flex-1 sm:flex-initial"
                                    onClick={() => {
                                        setDeleteTarget(previewInstructor);
                                        setPreviewInstructor(null);
                                    }}
                                >
                                    Delete Record
                                </Button>
                            </div>
                        </div>
                    </div>
                </ModelOverlay>
            )}
        </>
    );
}
