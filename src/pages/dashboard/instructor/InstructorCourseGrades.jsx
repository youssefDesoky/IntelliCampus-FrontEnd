import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useNavigate } from "react-router-dom";
import { fetchCourseGrades } from "../../../feature/instructor/services/gradesApi";
import { useError } from '../../../contexts/ErrorContext.jsx';
import { ChartBarIcon, UsersIcon, CheckIcon, FilePenIcon, BrainIcon, ExclamationIcon } from "../../../components/ui/icons";
import Button from "../../../components/ui/Button";
import Table from "../../../components/ui/Table";
import { CourseGradesSkeleton } from "../../../feature/instructor/SkeletonLoader";

function GradeIcon({ type }) {
    const cls = {
        Quiz: "bg-bg-surface-purple-default-light dark:bg-bg-surface-purple-default-dark text-text-purple-accent-light dark:text-text-purple-accent-dark",
        Assignment: "bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark text-text-blue-accent-light dark:text-text-blue-accent-dark",
        Exam: "bg-bg-surface-amber-default-light dark:bg-bg-surface-amber-default-dark text-text-amber-accent-light dark:text-text-amber-accent-dark",
        Midterm: "bg-bg-surface-amber-default-light dark:bg-bg-surface-amber-default-dark text-text-amber-accent-light dark:text-text-amber-accent-dark",
        Final: "bg-bg-surface-amber-default-light dark:bg-bg-surface-amber-default-dark text-text-amber-accent-light dark:text-text-amber-accent-dark",
    }[type] || "bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-icon-tertiary-default-light dark:text-icon-tertiary-default-dark";

    const icon = {
        Quiz: <BrainIcon size={18} />,
        Assignment: <FilePenIcon size={18} />,
        Exam: <ChartBarIcon size={18} />,
        Midterm: <ChartBarIcon size={18} />,
        Final: <ChartBarIcon size={18} />,
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
    const { courseId } = useOutletContext();
    const { showError } = useError();
    const navigate = useNavigate();

    const {
        data: grades,
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ["instructorCourseGrades", courseId],
        queryFn: () => fetchCourseGrades(courseId),
        staleTime: 5 * 60 * 1000,
        enabled: !!courseId,
    });

    useEffect(() => {
        if (error) showError(error.message || "Failed to load grades");
    }, [error, showError]);

    if (loading) {
        return <CourseGradesSkeleton />;
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
        { label: "Average Course Work", value: `${summary.averageCoursework} / ${summary.totalCoursework}`, icon: <ChartBarIcon size={20} />, color: "text-text-accent-default-light dark:text-text-accent-default-dark" },
        { label: "Pass Rate", value: `${summary.passRate}%`, icon: <CheckIcon size={20} />, color: "text-green-600 dark:text-green-400" },
        { label: "Assessments", value: `${summary.gradedAssessments}/${summary.totalAssessments}`, icon: <FilePenIcon size={20} />, color: "text-text-tertiary-default-light dark:text-text-tertiary-default-dark" },
    ];

    const assessmentHeaders = assessments.map(a => a.title.length > 12 ? a.title.slice(0, 12) + "\u2026" : a.title);
    const columnClassNames = ["", ...assessments.map(() => "hidden lg:table-cell"), ""];

    return (
        <div className="space-y-6">
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark uppercase tracking-wide">{stat.label}</span>
                            <span className={stat.color + " shrink-0"}>{stat.icon}</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-end">
                <Button
                    variant="secondary"
                    type="button"
                    onClick={() => navigate("complaints")}
                    className="inline-flex items-center gap-2"
                >
                    <ExclamationIcon size={16} />
                    View Complaints
                </Button>
            </div>

            <div>
                <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-3 sm:mb-4">Assessment Performance</h3>
                <div className="space-y-3">
                    {assessments.map((a) => (
                        <div key={a.id} className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200">
                            <div className="sm:flex sm:flex-row sm:items-center sm:gap-3">
                                <div className="hidden sm:block">
                                    <GradeIcon type={a.type} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-2 sm:gap-0 min-w-0">
                                            <span className="sm:hidden">
                                                <GradeIcon type={a.type} />
                                            </span>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark truncate">{a.title}</h4>
                                                <p className="text-[11px] sm:text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">{a.type} &middot; {a.maxScore} pts</p>
                                            </div>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-4 text-sm shrink-0">
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
                                        <div className="sm:hidden shrink-0">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${getGradeTextColor(a.average)} ${
                                                a.average >= 85 ? "bg-green-100 dark:bg-green-900/30" :
                                                a.average >= 75 ? "bg-blue-100 dark:bg-blue-900/30" :
                                                a.average >= 65 ? "bg-amber-100 dark:bg-amber-900/30" :
                                                a.average >= 50 ? "bg-orange-100 dark:bg-orange-900/30" :
                                                "bg-red-100 dark:bg-red-900/30"
                                            }`}>
                                                {a.average != null ? `${a.average}%` : "—"}
                                            </span>
                                        </div>
                                    </div>
                                    {a.average != null && (
                                        <div className="mt-2 sm:mt-3 flex items-center gap-3">
                                            <div className="flex-1 h-1.5 sm:h-2 bg-bg-surface-tertiary-default-light dark:bg-bg-surface-tertiary-default-dark rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${getGradeColor(a.average)}`}
                                                    style={{ width: `${a.average}%` }}
                                                />
                                            </div>
                                            <span className="sm:hidden text-[11px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark shrink-0">
                                                {a.submissions} submitted
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="hidden sm:block">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Students</h3>
                    {students.length > 0 && (
                        <span className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                            {students.length} student{students.length !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                <Table
                    role="instructor"
                    headers={["Student", ...assessmentHeaders, "Overall"]}
                    data={students.map(s => {
                        const row = {
                            student: <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{s.name}</span>,
                        };
                        assessments.forEach((a, idx) => {
                            const match = s.assessments.find(sa => sa.assessmentId === a.id);
                            const score = match?.score;
                            row[`col_${idx}`] = (
                                <span className={`text-sm font-semibold ${getGradeTextColor(score)}`}>
                                    {score != null ? `${score}%` : "\u2014"}
                                </span>
                            );
                        });
                        row["Overall"] = (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                s.overall >= 85 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                                s.overall >= 75 ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" :
                                s.overall >= 65 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" :
                                s.overall >= 50 ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" :
                                "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                            }`}>
                                {s.grade}
                            </span>
                        );
                        return row;
                    })}
                    columnAlignments={["text-left", ...assessments.map(() => "text-center"), "text-center"]}
                    columnClassNames={columnClassNames}
                    wrapInSection={false}
                    showHeaderActions={false}
                    showPagination={false}
                    showSelectionColumn={false}
                    showActionsColumn={false}
                />
            </div>
        </div>
    );
}