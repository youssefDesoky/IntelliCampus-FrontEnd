import { useState, useEffect, useCallback } from "react";
import UserHeader from "../../../components/ui/UserHeader";
import Section from "../../../components/ui/Section";
import SearchBar from "../../../components/ui/SearchBar";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import Table from "../../../components/ui/Table";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import AdminForm from "../../../feature/admin/components/AdminForm";
import {
    FilePenIcon,
    TrashIcon,
    UserIcon,
    XIcon,
} from "../../../components/ui/icons";
import { fetchAdmins, createAdmin, deleteAdmin } from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 10;
const adminTableHeaders = ["Admin ID", "Admin", "Role", "Phone", "Hire Date"];



function buildAdminRow(a) {
    return {
        adminID: a.adminId,
        admin: (
            <div className="flex items-center gap-3">
                {a.profileImage || a.avatar ? (
                    <img src={a.profileImage || a.avatar} alt={a.fullName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                    </div>
                )}
                <div className="flex flex-col text-left">
                    <p>{a.fullName}</p>
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{a.email}</p>
                </div>
            </div>
        ),
        role: a.role || "—",
        phone: a.phoneNumber || a.phone || "—",
        hireDate: a.hireDate || "—",
        _id: a.userId,
        _raw: a,
    };
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

    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

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
    const selectedIndices = paginatedRows.map((row, i) => selectedRowIds.includes(row._id) ? i : -1).filter(i => i !== -1);

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
        for (const id of selectedRowIds) {
            try { await deleteAdmin(id); } catch (err) { console.error(err); }
        }
        setSelectedRowIds([]);
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
                <div className="flex items-center justify-between gap-4 mb-3">
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
                    title="Delete Selected Admins"
                    onClose={() => setIsDeleteSelectedOpen(false)}
                    onConfirm={() => { handleDeleteSelected(); return true; }}
                    confirmText="Yes, Delete"
                    cancelText="No, Keep"
                    showCloseButton={true}
                >
                    Are you sure you want to delete {selectedRowIds.length} selected admin{selectedRowIds.length > 1 ? "s" : ""}? This action cannot be undone.
                </Dialog>

                {paginatedAdmins.length > 0 ? (
                    <div className="mb-6">
                        <Table
                            role="admin"
                            headers={adminTableHeaders}
                            data={paginatedRows}
                            wrapInSection={false}
                            showHeaderActions={false}
                            showPagination={false}
                            selectedRows={selectedIndices}
                                 page={currentPage}
                                 onPageChange={setCurrentPage}
                                 totalPages={totalPages}
                                 totalItems={filteredAdmins.length}
                                 itemsLabel="Admins"
                                 from={(currentPage - 1) * ITEMS_PER_PAGE + 1}
                                 to={Math.min(currentPage * ITEMS_PER_PAGE, filteredAdmins.length)}
                                 onSelectionChange={(indices) => {
                                    const visibleIds = new Set(paginatedRows.map(r => r._id).filter(Boolean));
                                    setSelectedRowIds([...selectedRowIds.filter(id => !visibleIds.has(id)), ...indices.map(i => paginatedRows[i]?._id).filter(Boolean)]);
                                }}
                                onPreview={(a) => setPreviewAdmin(a)}
                        />
                    </div>
                ) : (
                    <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        No admins found.
                    </p>
                )}


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
                    maxWidth="max-w-3xl"
                >
                    <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl shadow-2xl w-full flex flex-col">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark ring-2 ring-bg-surface-primary-default-light dark:ring-bg-surface-primary-default-dark shrink-0">
                                        {previewAdmin.profileImage || previewAdmin.avatar ? (
                                            <img src={previewAdmin.profileImage || previewAdmin.avatar} alt={previewAdmin.fullName || previewAdmin.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <UserIcon className="w-7 h-7 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                                            {previewAdmin.fullName || previewAdmin.name}
                                        </h2>
                                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark font-mono mt-1">
                                            ID: {previewAdmin.adminId || "—"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPreviewAdmin(null)}
                                    className="p-1.5 rounded-lg text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-accent-default-light dark:hover:bg-bg-surface-accent-default-dark transition-colors"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                <div className="p-3 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                                    <span className="block text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Role</span>
                                    <span className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">{previewAdmin.role || "—"}</span>
                                </div>
                                <div className="p-3 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                                    <span className="block text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Phone</span>
                                    <span className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">{previewAdmin.phoneNumber || previewAdmin.phone || "—"}</span>
                                </div>
                                <div className="p-3 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                                    <span className="block text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Hire Date</span>
                                    <span className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">{previewAdmin.hireDate || "—"}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 px-1">
                                    <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark w-20">Email</span>
                                    <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewAdmin.email || "—"}</span>
                                </div>
                                <div className="flex items-center gap-3 px-1">
                                    <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark w-20">Role</span>
                                    <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewAdmin.role || "—"}</span>
                                </div>
                                <div className="flex items-center gap-3 px-1">
                                    <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark w-20">Hire Date</span>
                                    <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewAdmin.hireDate || "—"}</span>
                                </div>
                                <div className="flex items-center gap-3 px-1">
                                    <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark w-20">Phone</span>
                                    <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewAdmin.phoneNumber || previewAdmin.phone || "—"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border-primary-default-light dark:border-border-primary-default-dark p-4 px-6 flex justify-end gap-3">
                            <Button variant="secondary" size="sm" onClick={() => setPreviewAdmin(null)}>Close</Button>
                            <Button variant="primary" size="sm" onClick={() => { setEditingAdmin(previewAdmin); setPreviewAdmin(null); }}>Edit Profile</Button>
                        </div>
                    </div>
                </ModelOverlay>
            )}
        </>
    );
}
