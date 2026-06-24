import { useState, useEffect, useCallback } from "react";
import { useError } from '../../../contexts/ErrorContext.jsx';
import { fetchCourseStudents } from "../../../feature/admin/services/adminApi";
import { SearchIcon, UserIcon } from "../../../components/ui/icons";

export default function ManageCourseStudentsTab({ courseId }) {
    const { showError } = useError();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const loadStudents = useCallback(async () => {
        try {
            const data = await fetchCourseStudents(courseId);
            setStudents(Array.isArray(data) ? data : []);
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => { loadStudents(); }, [loadStudents]);

    const filtered = students.filter(s => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            (s.fullName || s.name || "").toLowerCase().includes(q) ||
            (s.studentId || s.id || "").toLowerCase().includes(q) ||
            (s.email || "").toLowerCase().includes(q) ||
            (s.section || "").toLowerCase().includes(q)
        );
    });

    if (loading) {
        return (
            <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                Loading students...
            </p>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-sm text-text-primary-default-light dark:text-text-primary-default-dark placeholder:text-text-secondary-default-light dark:placeholder:text-text-secondary-default-dark focus:ring-2 focus:ring-border-accent-active-light dark:focus:ring-border-accent-active-dark outline-none transition-all"
                    />
                </div>
                <span className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    {filtered.length} / {students.length} students
                </span>
            </div>

            {filtered.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                <th className="text-left px-4 py-3 font-medium">Student</th>
                                <th className="text-left px-4 py-3 font-medium">ID</th>
                                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Email</th>
                                <th className="text-center px-4 py-3 font-medium hidden md:table-cell">Section</th>
                                <th className="text-center px-4 py-3 font-medium hidden md:table-cell">GPA</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-primary-default-light dark:divide-border-primary-default-dark">
                            {filtered.map((s) => (
                                <tr key={s.studentId || s.id} className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center shrink-0">
                                                <UserIcon className="w-4 h-4 text-text-accent-active-light dark:text-text-accent-active-dark" />
                                            </div>
                                            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark truncate max-w-40">
                                                {s.fullName || s.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-text-secondary-default-light dark:text-text-secondary-default-dark font-mono text-xs">
                                        {s.studentId || s.id || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-text-secondary-default-light dark:text-text-secondary-default-dark hidden sm:table-cell">
                                        {s.email || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-center text-text-secondary-default-light dark:text-text-secondary-default-dark hidden md:table-cell">
                                        {s.section || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-center text-text-secondary-default-light dark:text-text-secondary-default-dark hidden md:table-cell">
                                        {s.gpa != null ? s.gpa.toFixed(2) : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-16 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark">
                    <UserIcon className="w-12 h-12 mx-auto text-text-secondary-default-light dark:text-text-secondary-default-dark mb-3" />
                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        {search ? "No students match your search." : "No students registered in this course yet."}
                    </p>
                </div>
            )}
        </div>
    );
}
