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
import StudentForm from "../../../feature/admin/components/StudentForm";
import {
    FilePenIcon,
    TrashIcon,
    BookIcon,
    HashIcon,
    UserIcon,
    Grid3ColIcon,
    TableIcon,
    XIcon,
} from "../../../components/ui/icons";
import { fetchStudents, createStudent, deleteStudent } from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 9;
const studentTableHeaders = ["Student", "Student ID", "National ID", "Program", "Level", "Bylaw"];

function buildStudentRow(s) {
    return {
        student: (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark overflow-hidden">
                    {s.profileImage ? <img src={s.profileImage} alt={s.fullName} className="w-full h-full object-cover" /> : <span className="uppercase">{(s.fullName || "?").charAt(0)}</span>}
                </div>
                <div className="flex flex-col text-left">
                    <p>{s.fullName}</p>
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{s.email}</p>
                </div>
            </div>
        ),
        studentID: s.studentId || "—",
        nationalId: s.nationalId || "—",
        program: s.program || s.faculty || "—",
        level: s.level ?? "—",
        bylaw: s.baylawName ?? "—",
        _id: s.userId,
        _raw: s,
    };
}

import AdminCard from "../../../components/ui/AdminCard";

function buildCourseRow(course) {
    const percent = course.gradePercent ?? course.progress ?? course.score ?? course.finalGrade ?? null;
    function toLetter(p) {
        if (p === null || p === undefined) return '—';
        const n = Number(p);
        if (Number.isNaN(n)) return '—';
        if (n >= 90) return 'A';
        if (n >= 80) return 'B';
        if (n >= 70) return 'C';
        if (n >= 60) return 'D';
        return 'F';
    }

    return {
        course: course.title || course.name || course.code,
        attendance: `${course.attendance ?? 0}%`,
        courseWork: course.courseWorkScore ?? course.cwScore ?? '—',
        finalExam: course.finalExamScore ?? course.examScore ?? '—',
        grade: toLetter(percent),
    };
}

function StudentCard({ student, onEdit, onDelete, onPreview }) {
    const meta = [];
    if (student.faculty) meta.push({ icon: UserIcon, label: student.faculty });
    if (student.specialization) meta.push({ icon: BookIcon, label: student.specialization });
    if (student.phone) meta.push({ icon: HashIcon, label: student.phone });

    const actions = [
        { label: 'Edit', variant: 'secondary', icon: FilePenIcon, onClick: (e) => { e?.stopPropagation?.(); onEdit(student); } },
        { label: 'Delete', variant: 'danger', icon: TrashIcon, onClick: (e) => { e?.stopPropagation?.(); onDelete(student); } },
    ];

    const stats = [
        { label: 'GPA', value: student.gpa ?? '—' },
    ];

    return (
        <div onClick={() => onPreview?.(student)} className="cursor-pointer">
            <AdminCard
                avatar={student.profileImage}
                title={student.fullName || student.name}
                subtitle={student.email}
                idLabel={student.studentId}
                status={{ label: student.program || 'General', tone: 'neutral' }}
                stats={stats}
                meta={meta}
                footerActions={actions}
            >
                <div className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{`GPA: ${student.gpa ?? '—'}`}</div>
            </AdminCard>
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
    const [previewStudent, setPreviewStudent] = useState(null);
    const [previewCoursesPage, setPreviewCoursesPage] = useState(1);

    const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminStudentsViewMode") || "grid");
    const [selectedRowIds, setSelectedRowIds] = useState([]);
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
            s.program?.toLowerCase().includes(q) ||
            s.faculty?.toLowerCase().includes(q)
        );
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
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <ToggleViewMode
                                isFirstMode={viewMode === "grid"}
                                onFirstModeSelect={() => { setViewMode("grid"); setSelectedRowIds([]); }}
                                onSecondModeSelect={() => { setViewMode("list"); setSelectedRowIds([]); }}
                                firstModeLabel={<Grid3ColIcon className="w-5 h-5" />}
                                secondModeLabel={<TableIcon className="w-5 h-5" />}
                            />
                            {viewMode === "list" && selectedRowIds.length > 0 && (
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
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                                {paginatedStudents.map((s) => (
                                    <StudentCard
                                        key={s.studentId}
                                        student={s}
                                        onEdit={setEditingStudent}
                                        onDelete={setDeleteTarget}
                                        onPreview={setPreviewStudent}
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

            {previewStudent && (
<ModelOverlay
    onClose={() => {
        setPreviewStudent(null);
        setPreviewCoursesPage(1);
    }}
    maxWidth="max-w-5xl"
>
    <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark p-4 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    Student Profile Explorer
                </span>
            </div>
            <button
                onClick={() => {
                    setPreviewStudent(null);
                    setPreviewCoursesPage(1);
                }}
                className="p-1.5 rounded-lg text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-accent-default-light dark:hover:bg-bg-surface-accent-default-dark hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark transition-all"
            >
                <XIcon className="w-5 h-5" />
            </button>
        </div>

        {/* Main Content Area */}
        <div className="p-6 space-y-6 overflow-y-auto">
            
{/* Top Section: Split Info Grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    {/* Left Column: Profile Card */}
    <div className="lg:col-span-1 h-full flex flex-col items-center text-center p-5 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
        <div className="w-28 h-28 rounded-2xl overflow-hidden bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark ring-4 ring-bg-surface-primary-default-light dark:ring-bg-surface-primary-default-dark shadow-md shrink-0 mb-4">
            {previewStudent.profileImage ? (
                <img
                    src={previewStudent.profileImage}
                    alt={previewStudent.fullName || previewStudent.name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                    {(previewStudent.fullName || previewStudent.name || "?").charAt(0)}
                </div>
            )}
        </div>

        <h2 className="text-xl font-bold tracking-tight text-text-primary-default-light dark:text-text-primary-default-dark line-clamp-2 px-2">
            {previewStudent.fullName || previewStudent.name}
        </h2>
        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1 font-mono">
            ID: {previewStudent.studentId}
        </p>
        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark break-all max-w-full px-2 mt-0.5">
            {previewStudent.email}
        </p>

        {/* Score / Stats Widgets */}
        <div className="w-full mt-auto pt-6">
            {/* FIX: Centered, shorter break line */}
            <div className="w-3/4 mx-auto border-t border-border-primary-default-light dark:border-border-primary-default-dark mb-6"></div>
            
            <div className="grid grid-cols-2 gap-2 w-full">
                <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-3 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">GPA</span>
                    <span className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                        {previewStudent.gpa ?? "—"}
                    </span>
                </div>
                <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-3 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Level</span>
                    <span className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                        {previewStudent.level ?? "—"}
                    </span>
                </div>
            </div>
        </div>
    </div>

{/* Right Column: Detailed Info Fields */}
{/* FIX: Removed 'justify-between' so content stays packed tightly beneath the header */}
<div className="lg:col-span-2 h-full flex flex-col border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl p-5 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
    <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary-default-light dark:text-text-primary-default-dark mb-4 pb-2 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
        Administrative Information
    </h3>
    
    {/* Information Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm mt-2">
        <div className="space-y-0.5">
            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Program</span>
            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewStudent.program ?? "—"}</span>
        </div>
        <div className="space-y-0.5">
            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Department / Faculty</span>
            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewStudent.department ?? previewStudent.faculty ?? "—"}</span>
        </div>
        <div className="space-y-0.5">
            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Bylaw</span>
            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewStudent.baylawName ?? previewStudent.bylaw ?? "—"}</span>
        </div>
        <div className="space-y-0.5">
            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Enrollment Date</span>
            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewStudent.enrollmentDate ?? previewStudent.enrolledAt ?? "—"}</span>
        </div>
        
        {/* Secondary Details Divider Row */}
        <div className="sm:col-span-2 my-1 border-t border-dashed border-border-primary-default-light dark:border-border-primary-default-dark pt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-0.5">
                <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">National ID</span>
                <span className="font-medium tracking-wide text-text-primary-default-light dark:text-text-primary-default-dark">{previewStudent.nationalId ?? "—"}</span>
            </div>
            <div className="space-y-0.5">
                <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Nationality</span>
                <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewStudent.nationality ?? "—"}</span>
            </div>
            
            <div className="space-y-0.5">
                <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Home Address</span>
                <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark break-words line-clamp-2" title={previewStudent.address ?? "—"}>
                    {previewStudent.address ?? "—"}
                </span>
            </div>
            <div className="space-y-0.5">
                <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Phone Number</span>
                <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{previewStudent.phone ?? "—"}</span>
            </div>
        </div>
    </div>
</div>
</div>

            {/* Bottom Full-Width Section: Registered Courses */}
            <div className="border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl p-5 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark w-full">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary-default-light dark:text-text-primary-default-dark mb-4">
                    Registered Courses
                </h3>
                
                {previewStudent.courses && previewStudent.courses.length > 0 ? (
                    <div className="space-y-4">
                        <div className="overflow-x-auto border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg">
                            <Table
                                role="course"
                                headers={["Course", "Attendance", "Course Work", "Final Exam", "Grade"]}
                                data={previewStudent.courses.slice((previewCoursesPage - 1) * 5, previewCoursesPage * 5).map(buildCourseRow)}
                                wrapInSection={false}
                                showHeaderActions={false}
                                showPagination={false}
                                showSelectionColumn={false}
                                showActionsColumn={false}
                            />
                        </div>
                        
                        {previewStudent.courses.length > 5 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                                <div className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                    Showing <span className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{Math.min((previewCoursesPage - 1) * 5 + 1, previewStudent.courses.length)}</span> to <span className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{Math.min(previewCoursesPage * 5, previewStudent.courses.length)}</span> of <span className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{previewStudent.courses.length}</span> entries
                                </div>
                                <PaginationButtons
                                    totalPages={Math.ceil(previewStudent.courses.length / 5)}
                                    currentPage={previewCoursesPage}
                                    setCurrentPage={setPreviewCoursesPage}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 rounded-lg border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        No course records found for this academic term.
                    </div>
                )}
            </div>

        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 mt-auto bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-t border-border-primary-default-light dark:border-border-primary-default-dark p-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto order-2 sm:order-1"
                onClick={() => console.log("Message", previewStudent)}
            >
                Send Message
            </Button>
            
            <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 sm:flex-initial"
                    onClick={() => {
                        setEditingStudent(previewStudent);
                        setPreviewStudent(null);
                    }}
                >
                    Edit Profile
                </Button>
                <Button
                    variant="danger"
                    size="sm"
                    className="flex-1 sm:flex-initial"
                    onClick={() => {
                        setDeleteTarget(previewStudent);
                        setPreviewStudent(null);
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
