import { useState, useEffect, useCallback } from "react";
import Table from "../../../components/ui/Table";
import UserHeader from "../../../components/ui/UserHeader";
import StudentForm from "../../../feature/admin/components/StudentForm";
import { fetchStudents, createStudent, deleteStudent } from "../../../feature/admin/services/adminApi";

function buildStudentRow(s) {
    return {
        // Display columns (first 5 values shown in table)
        student: (
            <div className="flex items-center justify-center gap-3">
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
        // Hidden data for edit form / delete
        _id: s.studentId,
        fullName: s.fullName,
        email: s.email,
        phoneNumber: s.phoneNumber || "",
        address: s.address || "",
    };
}

export default function ManageStudents() {
    const [isAddStudentFormOpen, setIsAddStudentFormOpen] = useState(false);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadStudents = useCallback(async () => {
        try {
            setError(null);
            const data = await fetchStudents();
            const rows = (Array.isArray(data) ? data : []).map(buildStudentRow);
            setStudents(rows);
        } catch (err) {
            console.error("Failed to load students:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadStudents(); }, [loadStudents]);

    const handleDelete = async (rowIndex) => {
        const row = students[rowIndex];
        if (!row?._id) return;
        try {
            await deleteStudent(row._id);
            await loadStudents();
        } catch (err) {
            console.error("Failed to delete student:", err);
        }
    };

    const handleDeleteSelected = async (selectedIndexes) => {
        for (const idx of selectedIndexes) {
            const row = students[idx];
            if (!row?._id) continue;
            try {
                await deleteStudent(row._id);
            } catch (err) {
                console.error("Failed to delete student:", err);
            }
        }
        await loadStudents();
    };

    const handleCreate = async (formData) => {
        try {
            await createStudent(formData);
            setIsAddStudentFormOpen(false);
            await loadStudents();
        } catch (err) {
            console.error("Failed to create student:", err);
        }
    };

    return (
        <>
            <UserHeader role="student" setIsUserFormOpen={setIsAddStudentFormOpen} />

            {isLoading ? (
                <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading students...</p>
            ) : error ? (
                <p className="text-center py-10 text-red-500">Error: {error}</p>
            ) : (
                <Table
                    role="student"
                    headers={studentTableHeaders}
                    data={students}
                    onDelete={handleDelete}
                    onDeleteSelected={handleDeleteSelected}
                />
            )}

            {isAddStudentFormOpen && (
                <StudentForm
                    method="post"
                    onClose={() => setIsAddStudentFormOpen(false)}
                    onSubmit={handleCreate}
                />
            )}
        </>
    );
}

const studentTableHeaders = ["Student", "Student ID", "National ID", "Faculty", "Level"];
