import { useState, useEffect, useCallback } from "react";
import Table from "../../../components/ui/Table";
import UserHeader from "../../../components/ui/UserHeader";
import InstructorForm from "../../../feature/admin/components/InstructorForm";
import { fetchInstructors, createInstructor, deleteInstructor } from "../../../feature/admin/services/adminApi";

function buildInstructorRow(i) {
    return {
        // Display columns (first 5 values shown in table)
        instructor: (
            <div className="flex items-center justify-center gap-3">
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
        // Hidden data for edit form / delete
        _id: i.instructorId,
        fullName: i.fullName,
        email: i.email,
        nationalId: i.nationalId || "",
        phoneNumber: i.phoneNumber || "",
        departmentId: i.departmentId,
        address: i.address || "",
    };
}

export default function ManageInstructors() {
    const [isAddInstructorFormOpen, setIsAddInstructorFormOpen] = useState(false);
    const [instructors, setInstructors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadInstructors = useCallback(async () => {
        try {
            setError(null);
            const data = await fetchInstructors();
            const rows = (Array.isArray(data) ? data : []).map(buildInstructorRow);
            setInstructors(rows);
        } catch (err) {
            console.error("Failed to load instructors:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadInstructors(); }, [loadInstructors]);

    const handleDelete = async (rowIndex) => {
        const row = instructors[rowIndex];
        if (!row?._id) return;
        try {
            await deleteInstructor(row._id);
            await loadInstructors();
        } catch (err) {
            console.error("Failed to delete instructor:", err);
        }
    };

    const handleDeleteSelected = async (selectedIndexes) => {
        for (const idx of selectedIndexes) {
            const row = instructors[idx];
            if (!row?._id) continue;
            try {
                await deleteInstructor(row._id);
            } catch (err) {
                console.error("Failed to delete instructor:", err);
            }
        }
        await loadInstructors();
    };

    const handleCreate = async (formData) => {
        try {
            await createInstructor(formData);
            setIsAddInstructorFormOpen(false);
            await loadInstructors();
        } catch (err) {
            console.error("Failed to create instructor:", err);
        }
    };

    return (
        <>
            <UserHeader role="instructor" setIsUserFormOpen={setIsAddInstructorFormOpen} />

            {isLoading ? (
                <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading instructors...</p>
            ) : error ? (
                <p className="text-center py-10 text-red-500">Error: {error}</p>
            ) : (
                <Table
                    role="instructor"
                    headers={instructorTableHeaders}
                    data={instructors}
                    onDelete={handleDelete}
                    onDeleteSelected={handleDeleteSelected}
                />
            )}

            {isAddInstructorFormOpen && (
                <InstructorForm
                    method="post"
                    onClose={() => setIsAddInstructorFormOpen(false)}
                    onSubmit={handleCreate}
                />
            )}
        </>
    );
}

const instructorTableHeaders = ["Instructor", "Instructor ID", "Department", "Role", "Specialization"];
