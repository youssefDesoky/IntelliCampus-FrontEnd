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
import AdminForm from "../../../feature/admin/components/AdminForm";
import SharedAdminCard from "../../../components/ui/AdminCard";
import {
    FilePenIcon,
    TrashIcon,
    Grid3ColIcon,
    TableIcon,
    XIcon,
} from "../../../components/ui/icons";
import { fetchAdmins, createAdmin, deleteAdmin } from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 9;
const adminTableHeaders = ["Admin", "Admin ID", "Role", "Department", "Hire Date"];



function buildAdminRow(a) {
    return {
        admin: (
            <div className="flex items-center gap-3">
                {a.avatar ? (
                    <img src={a.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                        {(a.fullName || "?").charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex flex-col text-left">
                    <p>{a.fullName}</p>
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{a.email}</p>
                </div>
            </div>
        ),
        adminID: a.adminId,
        role: a.role || "—",
        department: a.department || "—",
        hireDate: a.hireDate || "—",
        _id: a.userId,
        _raw: a,
    };
}

function AdminCard({ admin, onEdit, onDelete, onPreview }) {
    const stats = [
        { label: "Role", value: admin.role || "—" },
        { label: "Dept", value: admin.department || "—" },
    ];

    const actions = [
        { label: "Edit", variant: "secondary", icon: FilePenIcon, onClick: (e) => { e?.stopPropagation?.(); onEdit(admin); } },
        { label: "Delete", variant: "danger", icon: TrashIcon, onClick: (e) => { e?.stopPropagation?.(); onDelete(admin); } },
    ];

    return (
        <div className="cursor-pointer" onClick={() => onPreview?.(admin)}>
            <SharedAdminCard
                avatar={admin.avatar}
                title={admin.fullName || admin.name}
                subtitle={admin.email}
                idLabel={admin.adminId}
                status={{ label: admin.role || "Admin", tone: "neutral" }}
                stats={stats}
                meta={[]}
                footerActions={actions}
            >
                <div className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    {admin.department ? `${admin.department} • ${admin.hireDate || "No hire date"}` : admin.hireDate || "No department"}
                </div>
            </SharedAdminCard>
        </div>
    );
}

export default function ManageAdmins() {
    const [rawAdmins, setRawAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isAddAdminFormOpen, setIsAddAdminFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [editingAdmin, setEditingAdmin] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [previewAdmin, setPreviewAdmin] = useState(null);

    const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminAdminsViewMode") || "grid");
    const [selectedRows, setSelectedRows] = useState([]);
    const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => { localStorage.setItem("adminAdminsViewMode", viewMode); }, [viewMode]);

    const loadAdmins = useCallback(async () => {
        try {
            setError(null);
            const data = await fetchAdmins();
            setRawAdmins(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load admins:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadAdmins(); }, [loadAdmins]);

    const filteredAdmins = rawAdmins.filter((a) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            a.fullName?.toLowerCase().includes(q) ||
            String(a.adminId)?.toLowerCase().includes(q) ||
            a.email?.toLowerCase().includes(q) ||
            a.department?.toLowerCase().includes(q) ||
            a.role?.toLowerCase().includes(q)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / ITEMS_PER_PAGE));
    const paginatedAdmins = filteredAdmins.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const paginatedRows = paginatedAdmins.map(buildAdminRow);

    const handleCreate = async (formData) => {
        try {
            console.log("[ManageAdmins] Creating admin:", JSON.stringify(formData, null, 2));
            await createAdmin(formData);
            setIsAddAdminFormOpen(false);
            await loadAdmins();
        } catch (err) {
            console.error("Failed to create admin:", err);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            await deleteAdmin(deleteTarget.userId);
            await loadAdmins();
        } catch (err) {
            console.error("Failed to delete admin:", err);
        }
        setDeleteTarget(null);
    };

    const handleDeleteSelected = async () => {
        for (const idx of selectedRows) {
            const row = paginatedRows[idx];
            if (row?._id) {
                try { await deleteAdmin(row._id); } catch (err) { console.error(err); }
            }
        }
        setSelectedRows([]);
        setIsDeleteSelectedOpen(false);
        await loadAdmins();
    };

    return (
        <>
            <UserHeader role="admin" setIsUserFormOpen={setIsAddAdminFormOpen} />

            {isLoading ? (
                <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading admins...</p>
            ) : error ? (
                <p className="text-center py-10 text-red-500">Error: {error}</p>
            ) : (
            <Section>
                <div className="flex items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-semibold">
                        Admins{" "}
                        <span className="text-sm font-normal text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            ({filteredAdmins.length})
                        </span>
                    </h2>
                    <div className="flex items-center gap-3">
                        <SearchBar
                            placeholder="Search Admins..."
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
                    title="Delete Selected Admins"
                    onClose={() => setIsDeleteSelectedOpen(false)}
                    onConfirm={() => { handleDeleteSelected(); return true; }}
                    confirmText="Yes, Delete"
                    cancelText="No, Keep"
                    showCloseButton={true}
                >
                    Are you sure you want to delete {selectedRows.length} selected admin{selectedRows.length > 1 ? "s" : ""}? This action cannot be undone.
                </Dialog>

                {paginatedAdmins.length > 0 ? (
                    viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                            {paginatedAdmins.map((a) => (
                                <AdminCard
                                    key={a.adminId}
                                    admin={a}
                                    onEdit={setEditingAdmin}
                                    onDelete={setDeleteTarget}
                                    onPreview={setPreviewAdmin}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mb-6">
                            <Table
                                role="admin"
                                headers={adminTableHeaders}
                                data={paginatedRows}
                                wrapInSection={false}
                                showHeaderActions={false}
                                showPagination={false}
                                onSelectionChange={setSelectedRows}
                            />
                        </div>
                    )
                ) : (
                    <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        No admins found.
                    </p>
                )}

                <PaginationButtons totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </Section>
            )}

            {isAddAdminFormOpen && <AdminForm method="post" onClose={() => setIsAddAdminFormOpen(false)} onSubmit={handleCreate} />}

            {editingAdmin && <AdminForm method="put" initialData={editingAdmin} onClose={() => setEditingAdmin(null)} />}

            <Dialog
                isOpen={deleteTarget !== null}
                variant="error"
                title="Delete Admin"
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => { handleDeleteConfirm(); return true; }}
                confirmText="Delete"
                cancelText="Cancel"
                showCloseButton={true}
            >
                Are you sure you want to delete <strong>{deleteTarget?.fullName}</strong> ({deleteTarget?.adminId})? This action cannot be undone.
            </Dialog>

            {previewAdmin && (
                <ModelOverlay
                    onClose={() => setPreviewAdmin(null)}
                    maxWidth="max-w-5xl"
                >
                    <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
                        <div className="sticky top-0 z-10 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark p-4 px-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                    Admin Profile Explorer
                                </span>
                            </div>
                            <button
                                onClick={() => setPreviewAdmin(null)}
                                className="p-1.5 rounded-lg text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-accent-default-light dark:hover:bg-bg-surface-accent-default-dark hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark transition-all"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1 h-full flex flex-col items-center text-center p-5 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                                    <div className="w-28 h-28 rounded-2xl overflow-hidden bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark ring-4 ring-bg-surface-primary-default-light dark:ring-bg-surface-primary-default-dark shadow-md shrink-0 mb-4">
                                        {previewAdmin.avatar ? (
                                            <img
                                                src={previewAdmin.avatar}
                                                alt={previewAdmin.fullName || previewAdmin.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                                {(previewAdmin.fullName || previewAdmin.name || "?").charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-bold tracking-tight text-text-primary-default-light dark:text-text-primary-default-dark line-clamp-2 px-2">
                                        {previewAdmin.fullName || previewAdmin.name}
                                    </h2>
                                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1 font-mono">
                                        ID: {previewAdmin.adminId || "—"}
                                    </p>
                                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark break-all max-w-full px-2 mt-0.5">
                                        {previewAdmin.email || "—"}
                                    </p>

                                    <div className="w-full mt-auto pt-6">
                                        <div className="w-3/4 mx-auto border-t border-border-primary-default-light dark:border-border-primary-default-dark mb-6"></div>

                                        <div className="grid grid-cols-2 gap-2 w-full">
                                            <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-3 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark">
                                                <span className="block text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Role</span>
                                                <span className="text-sm font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                                    {previewAdmin.role || "Admin"}
                                                </span>
                                            </div>
                                            <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-3 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark">
                                                <span className="block text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Department</span>
                                                <span className="text-sm font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                                    {previewAdmin.department || "—"}
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
                                            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Role</span>
                                            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewAdmin.role || "—"}</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Department</span>
                                            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewAdmin.department || "—"}</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Hire Date</span>
                                            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewAdmin.hireDate || "—"}</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Status</span>
                                            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewAdmin.role || "Admin"}</span>
                                        </div>

                                        <div className="sm:col-span-2 my-1 border-t border-dashed border-border-primary-default-light dark:border-border-primary-default-dark pt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                            <div className="space-y-0.5">
                                                <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Account Security</span>
                                                <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
                                                    {previewAdmin.password ? "Configured" : "No password shown"}
                                                </span>
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Record Type</span>
                                                <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">Administrative User</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl p-5 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark w-full">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary-default-light dark:text-text-primary-default-dark mb-4">
                                    Access Summary
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark p-3">
                                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Role</p>
                                        <p className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mt-1">{previewAdmin.role || "Admin"}</p>
                                    </div>
                                    <div className="rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark p-3">
                                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Department</p>
                                        <p className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mt-1">{previewAdmin.department || "—"}</p>
                                    </div>
                                    <div className="rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark p-3">
                                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Hire Date</p>
                                        <p className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mt-1">{previewAdmin.hireDate || "—"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 mt-auto bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-t border-border-primary-default-light dark:border-border-primary-default-dark p-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto order-2 sm:order-1"
                                onClick={() => console.log("Message", previewAdmin)}
                            >
                                Send Message
                            </Button>

                            <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="flex-1 sm:flex-initial"
                                    onClick={() => {
                                        setEditingAdmin(previewAdmin);
                                        setPreviewAdmin(null);
                                    }}
                                >
                                    Edit Profile
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="flex-1 sm:flex-initial"
                                    onClick={() => {
                                        setDeleteTarget(previewAdmin);
                                        setPreviewAdmin(null);
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
