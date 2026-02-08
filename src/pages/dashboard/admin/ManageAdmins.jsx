import { useState } from "react";
import UserHeader from "../../../components/ui/UserHeader";
import Section from "../../../components/ui/Section";
import SearchBar from "../../../components/ui/SearchBar";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import Table from "../../../components/ui/Table";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import ToggleViewMode from "../../../components/ui/ToggleViewMode";
import AdminForm from "../../../feature/admin/components/AdminForm";
import {
    FilePenIcon,
    TrashIcon,
    BookIcon,
    UserTieIcon,
    UserIcon,
    Grid3ColIcon,
    TableIcon,
} from "../../../components/ui/icons";

const ITEMS_PER_PAGE = 9;
const adminTableHeaders = ["Admin", "Admin ID", "Role", "Department", "Hire Date"];

// Static mock data (raw)
const rawAdminData = [
    {
        fullName: "Alice Brown",
        adminId: "A3001",
        role: "System Admin",
        department: "IT Services",
        hireDate: "2015-03-20",
        email: "alice.brown@example.com",
        nationalID: "12345678",
        nationality: "us",
        phone: "+1234567890",
        address: "123 Admin St, Tech City",
        avatar: "https://tse4.mm.bing.net/th/id/OIP.IGNf7GuQaCqz_RPq5wCkPgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
        fullName: "David Wilson",
        adminId: "A3002",
        role: "HR Manager",
        department: "Human Resources",
        hireDate: "2017-11-05",
        email: "david.wilson@example.com",
        nationalID: "87654321",
        nationality: "uk",
        phone: "+1987654321",
        address: "456 HR Ave, Business Park",
        avatar: "https://tse4.mm.bing.net/th/id/OIP.IGNf7GuQaCqz_RPq5wCkPgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
    },
];

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
        _id: a.adminId,
        _raw: a,
    };
}

function AdminCard({ admin, onEdit, onDelete }) {
    return (
        <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg border-l-4 border-l-border-accent-default-light dark:border-l-border-accent-default-dark shadow-sm shadow-shadow-light hover:shadow-lg dark:hover:shadow-shadow-dark transition-shadow p-5 flex flex-col justify-between gap-4">
            <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                        {admin.avatar ? (
                            <img src={admin.avatar} alt="Avatar" className="w-10 h-10 shrink-0 rounded-full object-cover" />
                        ) : (
                            <div className="w-10 h-10 shrink-0 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                                {(admin.fullName || "?").charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h3 className="font-semibold text-base leading-tight">{admin.fullName}</h3>
                            <span className="text-xs text-text-secondary-active-light dark:text-text-secondary-active-dark">
                                {admin.adminId}
                            </span>
                        </div>
                    </div>
                    {admin.role && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-secondary-active-light dark:text-text-secondary-active-dark">
                            {admin.role}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark mb-3">
                    {admin.email && (
                        <div className="flex items-center gap-1.5">
                            <UserIcon className="w-4 h-4" />
                            <span className="truncate max-w-40">{admin.email}</span>
                        </div>
                    )}
                    {admin.department && (
                        <div className="flex items-center gap-1.5">
                            <BookIcon className="w-4 h-4" />
                            <span>{admin.department}</span>
                        </div>
                    )}
                    {admin.hireDate && (
                        <div className="flex items-center gap-1.5">
                            <UserTieIcon className="w-4 h-4" />
                            <span>Hired {admin.hireDate}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
                <Button
                    variant="secondary"
                    className="flex-1 justify-center text-xs px-2 py-1.5"
                    onClick={() => onEdit(admin)}
                >
                    <FilePenIcon className="w-4 h-4" /> Edit
                </Button>
                <Button
                    variant="danger"
                    className="flex-1 justify-center text-xs px-2 py-1.5"
                    onClick={() => onDelete(admin)}
                >
                    <TrashIcon className="w-4 h-4" /> Delete
                </Button>
            </div>
        </div>
    );
}

export default function ManageAdmins() {
    const [isAddAdminFormOpen, setIsAddAdminFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [editingAdmin, setEditingAdmin] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminAdminsViewMode") || "grid");
    const [selectedRows, setSelectedRows] = useState([]);
    const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredAdmins = rawAdminData.filter((a) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            a.fullName?.toLowerCase().includes(q) ||
            a.adminId?.toLowerCase().includes(q) ||
            a.email?.toLowerCase().includes(q) ||
            a.department?.toLowerCase().includes(q) ||
            a.role?.toLowerCase().includes(q)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / ITEMS_PER_PAGE));
    const paginatedAdmins = filteredAdmins.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const paginatedRows = paginatedAdmins.map(buildAdminRow);

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        console.log("Deleting admin:", deleteTarget.adminId);
        setDeleteTarget(null);
    };

    const handleDeleteSelected = () => {
        console.log("Deleting admins at indexes:", selectedRows);
        setSelectedRows([]);
        setIsDeleteSelectedOpen(false);
    };

    return (
        <>
            <UserHeader role="admin" setIsUserFormOpen={setIsAddAdminFormOpen} />

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

            {isAddAdminFormOpen && <AdminForm method="post" onClose={() => setIsAddAdminFormOpen(false)} />}

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
        </>
    );
}
