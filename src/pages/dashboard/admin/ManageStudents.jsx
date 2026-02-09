import { useState, useEffect, useCallback } from "react";
import UserHeader from "../../../components/ui/UserHeader";
import Section from "../../../components/ui/Section";
import SearchBar from "../../../components/ui/SearchBar";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import Table from "../../../components/ui/Table";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import ToggleViewMode from "../../../components/ui/ToggleViewMode";
import StudentForm from "../../../feature/admin/components/StudentForm";
import {
    FilePenIcon,
    TrashIcon,
    BookIcon,
    HashIcon,
    UserIcon,
    Grid3ColIcon,
    TableIcon,
} from "../../../components/ui/icons";
import { fetchStudents, createStudent, deleteStudent } from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 9;
const studentTableHeaders = ["Student", "Student ID", "National ID", "Faculty", "Level"];

function buildStudentRow(s) {
    return {
        student: (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                    {(s.fullName || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                    <p>{s.fullName}</p>
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{s.email}</p>
                </div>
            </div>
        ),
        studentID: s.studentId || "—",
        nationalId: s.nationalId || "—",
        faculty: s.faculty || "—",
        level: s.level ?? "—",
        _id: s.userId,
        _raw: s,
    };
}

function StudentCard({ student, onEdit, onDelete }) {
    return (
        <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg border-l-4 border-l-border-accent-default-light dark:border-l-border-accent-default-dark shadow-sm shadow-shadow-light hover:shadow-lg dark:hover:shadow-shadow-dark transition-shadow p-5 flex flex-col justify-between gap-4">
            <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                            {(student.fullName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-semibold text-base leading-tight">{student.fullName}</h3>
                            <span className="text-xs text-text-secondary-active-light dark:text-text-secondary-active-dark">
                                {student.studentId}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark mb-3">
                    {student.email && (
                        <div className="flex items-center gap-1.5">
                            <UserIcon className="w-4 h-4" />
                            <span className="truncate max-w-40">{student.email}</span>
                        </div>
                    )}
                    {student.faculty && (
                        <div className="flex items-center gap-1.5">
                            <BookIcon className="w-4 h-4" />
                            <span>{student.faculty}</span>
                        </div>
                    )}
                    {student.level != null && (
                        <div className="flex items-center gap-1.5">
                            <HashIcon className="w-4 h-4" />
                            <span>Level {student.level}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
                <Button
                    variant="secondary"
                    className="flex-1 justify-center text-xs px-2 py-1.5"
                    onClick={() => onEdit(student)}
                >
                    <FilePenIcon className="w-4 h-4" /> Edit
                </Button>
                <Button
                    variant="danger"
                    className="flex-1 justify-center text-xs px-2 py-1.5"
                    onClick={() => onDelete(student)}
                >
                    <TrashIcon className="w-4 h-4" /> Delete
                </Button>
            </div>
        </div>
    );
}

export default function ManageStudents() {
    const [isAddStudentFormOpen, setIsAddStudentFormOpen] = useState(false);
    const [rawStudents, setRawStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [editingStudent, setEditingStudent] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminStudentsViewMode") || "grid");
    const [selectedRows, setSelectedRows] = useState([]);
    const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => { localStorage.setItem("adminStudentsViewMode", viewMode); }, [viewMode]);

    const loadStudents = useCallback(async () => {
        try {
            setError(null);
            const data = await fetchStudents();
            setRawStudents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load students:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadStudents(); }, [loadStudents]);

    const filteredStudents = rawStudents.filter((s) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            s.fullName?.toLowerCase().includes(q) ||
            s.studentId?.toLowerCase().includes(q) ||
            s.email?.toLowerCase().includes(q) ||
            s.faculty?.toLowerCase().includes(q)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE));
    const paginatedStudents = filteredStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const paginatedRows = paginatedStudents.map(buildStudentRow);

    const handleDelete = async (rowIndex) => {
        const row = paginatedRows[rowIndex];
        if (!row?._id) return;
        try { await deleteStudent(row._id); await loadStudents(); }
        catch (err) { console.error("Failed to delete student:", err); }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try { await deleteStudent(deleteTarget.userId); await loadStudents(); }
        catch (err) { console.error("Failed to delete student:", err); }
        setDeleteTarget(null);
    };

    const handleDeleteSelected = async () => {
        for (const idx of selectedRows) {
            const row = paginatedRows[idx];
            if (row?._id) {
                try { await deleteStudent(row._id); } catch (err) { console.error(err); }
            }
        }
        setSelectedRows([]);
        setIsDeleteSelectedOpen(false);
        await loadStudents();
    };

    const handleCreate = async (formData) => {
        try { console.log("[ManageStudents] Creating student:", JSON.stringify(formData, null, 2)); await createStudent(formData); setIsAddStudentFormOpen(false); await loadStudents(); }
        catch (err) { console.error("Failed to create student:", err); }
    };

    return (
        <>
            <UserHeader role="student" setIsUserFormOpen={setIsAddStudentFormOpen} />

            {isLoading ? (
                <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading students...</p>
            ) : error ? (
                <p className="text-center py-10 text-red-500">Error: {error}</p>
            ) : (
                <Section>
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-semibold">
                            Students{" "}
                            <span className="text-sm font-normal text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                ({filteredStudents.length})
                            </span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <SearchBar
                                placeholder="Search Students..."
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
                        title="Delete Selected Students"
                        onClose={() => setIsDeleteSelectedOpen(false)}
                        onConfirm={() => { handleDeleteSelected(); return true; }}
                        confirmText="Yes, Delete"
                        cancelText="No, Keep"
                        showCloseButton={true}
                    >
                        Are you sure you want to delete {selectedRows.length} selected student{selectedRows.length > 1 ? "s" : ""}? This action cannot be undone.
                    </Dialog>

                    {paginatedStudents.length > 0 ? (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                                {paginatedStudents.map((s) => (
                                    <StudentCard
                                        key={s.studentId}
                                        student={s}
                                        onEdit={setEditingStudent}
                                        onDelete={setDeleteTarget}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="mb-6">
                                <Table
                                    role="student"
                                    headers={studentTableHeaders}
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
                            No students found.
                        </p>
                    )}

                    <PaginationButtons totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </Section>
            )}

            {isAddStudentFormOpen && (
                <StudentForm method="post" onClose={() => setIsAddStudentFormOpen(false)} onSubmit={handleCreate} />
            )}

            {editingStudent && (
                <StudentForm method="put" initialData={editingStudent} onClose={() => setEditingStudent(null)} />
            )}

            <Dialog
                isOpen={deleteTarget !== null}
                variant="error"
                title="Delete Student"
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => { handleDeleteConfirm(); return true; }}
                confirmText="Delete"
                cancelText="Cancel"
                showCloseButton={true}
            >
                Are you sure you want to delete <strong>{deleteTarget?.fullName}</strong> ({deleteTarget?.studentId})? This action cannot be undone.
            </Dialog>
        </>
    );
}
