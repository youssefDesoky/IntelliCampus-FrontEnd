import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { fetchCourseAnalytics } from "../../../feature/instructor/components/analytics/instructorAnalyticsApi";
import { useError } from '../../../contexts/ErrorContext.jsx';
import { ChartBarIcon, BrainIcon, CheckIcon, UserCheckIcon } from "../../../components/ui/icons";

function ChartCard({ title, icon, children, className = "" }) {
    return (
        <div className={`p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg ${className}`}>
            <div className="flex items-center gap-3 mb-4">
                {icon && (
                    <span className="text-icon-primary-default-light dark:text-icon-primary-default-dark shrink-0">{icon}</span>
                )}
                <h3 className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">{title}</h3>
            </div>
            {children}
        </div>
    );
}

const tooltipStyle = {
    backgroundColor: "var(--color-bg-surface-primary-default-light)",
    border: "1px solid var(--color-border-primary-default-light)",
    borderRadius: "8px",
    color: "var(--color-text-primary-default-light)",
};

export default function InstructorCourseAnalytics() {
    const { course, courseId } = useOutletContext();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showError } = useError();

    const loadAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            const result = await fetchCourseAnalytics(courseId);
            setData(result);
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    }, [courseId, showError]);

    useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-lg h-64" />
                    ))}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="rounded-2xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                    <ChartBarIcon size={24} className="text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">No analytics available</h3>
                <p className="mt-2 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    Analytics will appear once there is course activity.
                </p>
            </div>
        );
    }

    const { assessmentPerformance, submissionRate, weeklyAttendance } = data;

    return (
        <div className="space-y-6">
            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                {course?.title || `Course ${courseId}`} &middot; Analytics
            </p>

            <ChartCard title="Assessment Performance" icon={<BrainIcon size={20} />}>
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={assessmentPerformance} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border-primary-default-light dark:stroke-border-primary-default-dark" />
                        <XAxis dataKey="name" className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
                        <YAxis domain={[0, 100]} className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="average" name="Average Score" fill="var(--color-bg-fill-accent-default-light)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Submission Rate" icon={<CheckIcon size={20} />}>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={submissionRate}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {submissionRate.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Student Attendance" icon={<UserCheckIcon size={20} />}>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={weeklyAttendance} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border-primary-default-light dark:stroke-border-primary-default-dark" />
                            <XAxis dataKey="week" className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
                            <YAxis domain={[0, 42]} className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Line type="monotone" dataKey="present" stroke="var(--color-bg-fill-accent-default-light)" strokeWidth={3} dot={{ r: 5, fill: "var(--color-bg-fill-accent-default-light)" }} name="Students Attended" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
}
