import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchCourseGrades } from "../../../feature/instructor/components/grades/instructorGradesApi";
import { useError } from '../../../contexts/ErrorContext.jsx';
import { ChartBarIcon, UsersIcon, CheckIcon, FilePenIcon, BrainIcon } from "../../../components/ui/icons";

function GradeIcon({ type }) {
    const cls = {
        Quiz: "bg-bg-surface-purple-default-light dark:bg-bg-surface-purple-default-dark text-text-purple-accent-light dark:text-text-purple-accent-dark",
        Assignment: "bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark text-text-blue-accent-light dark:text-text-blue-accent-dark",
        Exam: "bg-bg-surface-amber-default-light dark:bg-bg-surface-amber-default-dark text-text-amber-accent-light dark:text-text-amber-accent-dark",
    }[type] || "bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-icon-tertiary-default-light dark:text-icon-tertiary-default-dark";

    const icon = {
        Quiz: <BrainIcon size={18} />,
        Assignment: <FilePenIcon size={18} />,
        Exam: <ChartBarIcon size={18} />,
    }[type] || <ChartBarIcon size={18} />;

    return <div className={`p-2.5 rounded-lg shrink-0 ${cls}`}>{icon}</div>;
}

function getGradeColor(percent) {
    if (percent == null) return "bg-bg-surface-tertiary-default-light dark:bg-bg-surface-tertiary-default-dark";
    if (percent >= 85) return "bg-green-500";
    if (percent >= 75) return "bg-blue-500";
    if (percent >= 65) return "bg-amber-500";
    if (percent >= 50) return "bg-orange-500";
    return "bg-red-500";
}

function getGradeTextColor(percent) {
    if (percent == null) return "text-text-tertiary-default-light dark:text-text-tertiary-default-dark";
    if (percent >= 85) return "text-green-600 dark:text-green-400";
    if (percent >= 75) return "text-blue-600 dark:text-blue-400";
    if (percent >= 65) return "text-amber-600 dark:text-amber-400";
    if (percent >= 50) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
}

export default function InstructorCourseGrades() {
    const { course, courseId } = useOutletContext();
    const [grades, setGrades] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showError } = useError();
    const [selectedStudent, setSelectedStudent] = useState(null);

    const loadGrades = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchCourseGrades(courseId);
            setGrades(data);
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    }, [courseId, showError]);

    useEffect(() => { loadGrades(); }, [loadGrades]);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-xl h-24" />
                    ))}
                </div>
            </div>
        );
    }

    if (!grades) {
        return (
            <div className="space-y-4">
                <div className="rounded-2xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-12 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                        <ChartBarIcon size={24} className="text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">No grades available</h3>
                    <p className="mt-2 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        Grades will appear once assessments are graded.
                    </p>
                </div>
            </div>
        );
    }

    const { summary, assessments, students } = grades;

    const stats = [
        { label: "Total Students", value: summary.totalStudents, icon: <UsersIcon size={20} />, color: "text-blue-600 dark:text-blue-400" },
        { label: "Average Grade", value: `${summary.averageGrade}%`, icon: <ChartBarIcon size={20} />, color: "text-text-accent-default-light dark:text-text-accent-default-dark" },
        { label: "Pass Rate", value: `${summary.passRate}%`, icon: <CheckIcon size={20} />, color: "text-green-600 dark:text-green-400" },
        { label: "Assessments", value: `${summary.gradedAssessments}/${summary.totalAssessments}`, icon: <FilePenIcon size={20} />, color: "text-text-tertiary-default-light dark:text-text-tertiary-default-dark" },
    ];

    return (
        <div className="space-y-6">
            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                {course?.title || `Course ${courseId}`}
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark uppercase tracking-wide">{stat.label}</span>
                            <span className={stat.color}>{stat.icon}</span>
                        </div>
                        <p className="text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div>
                <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-4">Assessment Performance</h3>
                <div className="space-y-3">
                    {assessments.map((a) => (
                        <div key={a.id} className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-4 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <GradeIcon type={a.type} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div>
                                            <h4 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{a.title}</h4>
                                            <p className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">{a.type} &middot; {a.maxScore} pts</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm shrink-0">
                                            <div className="text-center">
                                                <p className={`text-lg font-bold ${getGradeTextColor(a.average)}`}>
                                                    {a.average != null ? `${a.average}%` : "—"}
                                                </p>
                                                <p className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">Average</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">{a.submissions}</p>
                                                <p className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">Submitted</p>
                                            </div>
                                        </div>
                                    </div>
                                    {a.average != null && (
                                        <div className="mt-3 h-2 w-full bg-bg-surface-tertiary-default-light dark:bg-bg-surface-tertiary-default-dark rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${getGradeColor(a.average)}`}
                                                style={{ width: `${a.average}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-4">Students</h3>
                <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-tertiary-default-light dark:text-text-tertiary-default-dark uppercase tracking-wider">Student</th>
                                    {assessments.map((a) => (
                                        <th key={a.id} className="text-center px-3 py-3 text-xs font-semibold text-text-tertiary-default-light dark:text-text-tertiary-default-dark uppercase tracking-wider whitespace-nowrap">
                                            {a.title.length > 12 ? a.title.slice(0, 12) + "…" : a.title}
                                        </th>
                                    ))}
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-text-tertiary-default-light dark:text-text-tertiary-default-dark uppercase tracking-wider">Overall</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-tertiary-default-light dark:divide-border-tertiary-default-dark">
                                {students.map((s) => (
                                    <tr
                                        key={s.id}
                                        className="hover:bg-bg-surface-secondary-default-light/50 dark:hover:bg-bg-surface-secondary-default-dark/50 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{s.name}</span>
                                        </td>
                                        {assessments.map((a) => {
                                            const match = s.assessments.find((sa) => sa.assessmentId === a.id);
                                            const score = match?.score;
                                            return (
                                                <td key={a.id} className="text-center px-3 py-3">
                                                    <span className={`text-sm font-semibold ${getGradeTextColor(score)}`}>
                                                        {score != null ? `${score}%` : "—"}
                                                    </span>
                                                </td>
                                            );
                                        })}
                                        <td className="text-center px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                s.overall >= 85 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                                                s.overall >= 75 ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" :
                                                s.overall >= 65 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" :
                                                s.overall >= 50 ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" :
                                                "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                            }`}>
                                                {s.grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
