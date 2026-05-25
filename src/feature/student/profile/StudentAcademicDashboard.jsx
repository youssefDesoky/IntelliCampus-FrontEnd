import BaseComponent from "../../../components/ui/BaseComponent";

// Mock data tracking active course loads for Spring 2026
const currentCourses = [
    { code: "IS-401", name: "Database Management Systems", credits: 3, grade: "A", attendance: "96%", status: "On Track" },
    { code: "SE-402", name: "Software Engineering Methodology", credits: 4, grade: "A-", attendance: "92%", status: "On Track" },
    { code: "IS-499", name: "Capstone Senior Project I", credits: 3, grade: "B+", attendance: "100%", status: "Review Needed" },
    { code: "HCI-305", name: "Human-Computer Interaction", credits: 3, grade: "A", attendance: "94%", status: "On Track" },
];

const degreeRequirements = [
    { category: "Core Information Systems", completed: 36, total: 42, color: "bg-accent-600" },
    { category: "Computer Science Foundations", completed: 24, total: 24, color: "bg-green-500" },
    { category: "Elective Tracks", completed: 12, total: 18, color: "bg-amber-500" },
    { category: "General Education", completed: 15, total: 15, color: "bg-purple-500" },
];

export default function StudentAcademicDashboard() {
    return (
        <div className="lg:col-span-8 space-y-6">
            
            {/* SECTION 1: Active Term Performance */}
            <BaseComponent
                title="Current Term Workspace"
                description="Spring 2026 active course registry and performance updates."
                contentClassName="space-y-4"
            >
                <div className="overflow-x-auto rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-border-primary-default-light bg-bg-surface-secondary-default-light text-xs font-bold uppercase tracking-wider text-text-tertiary-default-light dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-text-tertiary-default-dark">
                                <th className="px-4 py-3">Course</th>
                                <th className="px-4 py-3 text-center">Credits</th>
                                <th className="px-4 py-3 text-center">Est. Grade</th>
                                <th className="px-4 py-3 text-center">Attendance</th>
                                <th className="px-4 py-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-primary-default-light bg-bg-surface-primary-default-light dark:divide-border-primary-default-dark dark:bg-bg-surface-primary-default-dark">
                            {currentCourses.map((course) => (
                                <tr key={course.code} className="hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark transition-colors group">
                                    <td className="px-4 py-3.5">
                                        <div className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                                            {course.name}
                                        </div>
                                        <div className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark font-mono mt-0.5">
                                            {course.code}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                        {course.credits}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className="inline-flex items-center justify-center font-bold px-2 py-0.5 rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-accent-active-light dark:text-text-accent-active-dark border border-border-primary-default-light dark:border-border-primary-default-dark min-w-[32px]">
                                            {course.grade}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                        {course.attendance}
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                            course.status === 'On Track' 
                                                ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400' 
                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                                        }`}>
                                            {course.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </BaseComponent>

            {/* SECTION 2: Curriculum Completion Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Visual Analytics Block */}
                <div className="md:col-span-7">
                    <BaseComponent
                        title="Degree Progress Matrix"
                        description="Completed program units breakdown."
                        contentClassName="space-y-4"
                    >
                        <div className="space-y-3.5">
                            {degreeRequirements.map((req) => {
                                const percentage = Math.round((req.completed / req.total) * 100);
                                return (
                                    <div key={req.category} className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-text-primary-default-light dark:text-text-primary-default-dark truncate max-w-[220px]">
                                                {req.category}
                                            </span>
                                            <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark font-mono">
                                                {req.completed}/{req.total} Hrs ({percentage}%)
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark overflow-hidden border border-border-primary-default-light dark:border-border-primary-default-dark">
                                            <div 
                                                className={`h-full rounded-full ${req.color} transition-all duration-500`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </BaseComponent>
                </div>

                {/* Aggregate Summary Block */}
                <div className="md:col-span-5 flex flex-col justify-between rounded-3xl border border-border-primary-default-light bg-bg-surface-primary-default-light p-5 dark:border-border-primary-default-dark dark:bg-bg-surface-primary-default-dark shadow-sm">
                    <div>
                        <div className="flex items-center justify-between border-b border-border-primary-default-light dark:border-border-primary-default-dark pb-3">
                            <div>
                                <h4 className="text-sm font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                    Graduation Audit
                                </h4>
                                <p className="text-[11px] font-medium text-text-tertiary-default-light dark:text-text-tertiary-default-dark mt-0.5">
                                    Senior Year Baseline Checklist
                                </p>
                            </div>
                            {/* <AwardIcon size={18} className="text-text-accent-default-light dark:text-text-accent-default-dark" /> */}
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-3">
                                {/* <CheckCircleIcon size={16} className="text-green-500 shrink-0" /> */}
                                <div className="text-xs">
                                    <p className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Total Credit Hours</p>
                                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">87 of 99 Required Credits Completed</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* <CheckCircleIcon size={16} className="text-green-500 shrink-0" /> */}
                                <div className="text-xs">
                                    <p className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">GPA Benchmark Threshold</p>
                                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">3.80 Actual vs 2.00 Minimum</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* <HourglassIcon size={16} className="text-amber-500 shrink-0" /> */}
                                <div className="text-xs">
                                    <p className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Capstone Requirements</p>
                                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">Project proposal approved</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="mt-5 w-full flex items-center justify-between rounded-xl bg-bg-surface-secondary-default-light hover:bg-bg-surface-primary-hover-light dark:bg-bg-surface-secondary-default-dark dark:hover:bg-bg-surface-primary-hover-dark border border-border-primary-default-light dark:border-border-primary-default-dark px-3.5 py-2.5 text-xs font-bold text-text-primary-default-light dark:text-text-primary-default-dark transition-colors group">
                        <span>View Detailed Transcript</span>
                        {/* <ChevronRightIcon size={14} className="text-text-tertiary-default-light group-hover:translate-x-0.5 transition-transform" /> */}
                    </button>
                </div>

            </div>
        </div>
    );
}