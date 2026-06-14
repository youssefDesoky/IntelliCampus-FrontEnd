import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../../../components/ui/UserHeader";
import Section from "../../../components/ui/Section";
import SearchBar from "../../../components/ui/SearchBar";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import Table from "../../../components/ui/Table";
import StudentForm from "../../../feature/admin/components/StudentForm";
import {
    TrashIcon,
    UserIcon,
} from "../../../components/ui/icons";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import { fetchStudents, createStudent, deleteStudent } from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 10;
const studentTableHeaders = ["Student ID", "Student", "National ID", "Specilization", "Level", "Bylaw"];

function buildStudentRow(s) {
    return {
        studentID: s.studentId || "—",
        student: (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark overflow-hidden">
                    {s.profileImage ? <img src={s.profileImage} alt={s.fullName} className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-text-secondary-default-light dark:text-text-secondary-default-dark" />}
                </div>
                <div className="flex flex-col text-left">
                    <p>{s.fullName}</p>
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{s.email}</p>
                </div>
            </div>
        ),
        nationalId: s.nationalId || "—",
        specilization: s.specialization || "—",
        level: s.level ?? "—",
        bylaw: s.bylawName ?? "—",
        _id: s.userId,
        _raw: s,
    };
}

export default function ManageStudents() {
    const navigate = useNavigate();
    const [isAddStudentFormOpen, setIsAddStudentFormOpen] = useState(false);
    const [rawStudents, setRawStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [editingStudent, setEditingStudent] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [filterLevel, setFilterLevel] = useState([]);
    const [filterDepartment, setFilterDepartment] = useState([]);

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

    const levels = useMemo(() => {
        const set = new Set(rawStudents.map(s => s.level).filter(l => l != null));
        return [...set].sort((a, b) => a - b);
    }, [rawStudents]);

    const departments = useMemo(() => {
        const set = new Set(rawStudents.map(s => s.department || s.faculty).filter(Boolean));
        return [...set].sort();
    }, [rawStudents]);

    const filteredStudents = rawStudents.filter((s) => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            if (!(s.fullName?.toLowerCase().includes(q) ||
                s.studentId?.toLowerCase().includes(q) ||
                s.email?.toLowerCase().includes(q) ||
                s.program?.toLowerCase().includes(q) ||
                s.faculty?.toLowerCase().includes(q))) return false;
        }
        if (filterLevel.length > 0 && s.level != null && !filterLevel.includes(String(s.level))) return false;
        if (filterDepartment.length > 0 && !filterDepartment.includes(s.department || s.faculty)) return false;
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE));
    const paginatedStudents = filteredStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const paginatedRows = paginatedStudents.map(buildStudentRow);
    const selectedIndices = paginatedRows.map((row, i) => selectedRowIds.includes(row._id) ? i : -1).filter(i => i !== -1);

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
        for (const id of selectedRowIds) {
            try { await deleteStudent(id); } catch (err) { console.error(err); }
        }
        setSelectedRowIds([]);
        setIsDeleteSelectedOpen(false);
        await loadStudents();
    };

    const handleCreate = async (formData) => {
        try { console.log("[ManageStudents] Creating student:", JSON.stringify(formData, null, 2)); await createStudent(formData); setIsAddStudentFormOpen(false); await loadStudents(); }
        catch (err) { console.error("Failed to create student:", err); }
    };

    return (
        <>
            <UserHeader role="student" setIsUserFormOpen={setIsAddStudentFormOpen} onImportComplete={loadStudents} />

            {isLoading ? (
                <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading students...</p>
            ) : error ? (
                <p className="text-center py-10 text-red-500">Error: {error}</p>
            ) : (
                <Section>
                    <div className="flex flex-col gap-4 mb-3">
                        <div className="flex items-center justify-between gap-4">
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
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                <FilterDropdown
                                    label="Level"
                                    options={levels.map((l) => ({ value: String(l), label: `Level ${l}` }))}
                                    selectedValues={filterLevel}
                                    onChange={(v) => { setFilterLevel(v); setCurrentPage(1); }}
                                />
                                <FilterDropdown
                                    label="Department"
                                    options={departments.map((d) => ({ value: d, label: d }))}
                                    selectedValues={filterDepartment}
                                    onChange={(v) => { setFilterDepartment(v); setCurrentPage(1); }}
                                />
                                {selectedRowIds.length > 0 && (
                                    <Button variant="danger" onClick={() => setIsDeleteSelectedOpen(true)}>
                                        <TrashIcon size={20} />
                                        Delete ({selectedRowIds.length})
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <Dialog
                        isOpen={isDeleteSelectedOpen}
                        variant="warning"
                        title="Delete Selected Students"
                        onClose={() => setIsDeleteSelectedOpen(false)}
                        onConfirm={() => {
                            handleDeleteSelected();
                            return true;
                        }}
                        confirmText="Yes, Delete"
                        cancelText="No, Keep"
                        showCloseButton={true}
                    >
                        Are you sure you want to delete {selectedRowIds.length} selected student{selectedRowIds.length > 1 ? "s" : ""}? This action cannot be undone.
                    </Dialog>

                    {paginatedStudents.length > 0 ? (
                        <div className="mb-6">
                            <Table
                                role="student"
                                headers={studentTableHeaders}
                                data={paginatedRows}
                                wrapInSection={false}
                                showHeaderActions={false}
                                showPagination={false}
                                selectedRows={selectedIndices}
                                page={currentPage}
                                onPageChange={setCurrentPage}
                                totalPages={totalPages}
                                totalItems={filteredStudents.length}
                                itemsLabel="Students"
                                from={(currentPage - 1) * ITEMS_PER_PAGE + 1}
                                to={Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)}
                                onSelectionChange={(indices) => {
                                    const visibleIds = new Set(paginatedRows.map(r => r._id).filter(Boolean));
                                    setSelectedRowIds([...selectedRowIds.filter(id => !visibleIds.has(id)), ...indices.map(i => paginatedRows[i]?._id).filter(Boolean)]);
                                }}
                                onDelete={handleDelete}
                                onPreview={(s) => navigate(`/admin/students/${s.userId || s._id || s.studentId}`)}
                            />
                        </div>
                    ) : (
                        <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            No students found.
                        </p>
                    )}


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
                onConfirm={() => {
                    handleDeleteConfirm();
                    return true;
                }}
                confirmText="Delete"
                cancelText="Cancel"
                showCloseButton={true}
            >
                Are you sure you want to delete <strong>{deleteTarget?.fullName}</strong> ({deleteTarget?.studentId})? This action cannot be undone.
            </Dialog>
        </>
    );
}
