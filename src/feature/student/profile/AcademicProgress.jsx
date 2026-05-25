import BaseComponent from "../../../components/ui/BaseComponent";
import { BookIcon, FilePenIcon, CheckIcon } from "../../../components/ui/icons";

function ProgressRow({ icon: Icon, label, completed, total, accentClassName }) {
    const safeTotal = Math.max(Number(total) || 0, 0);
    const safeCompleted = Math.min(Math.max(Number(completed) || 0, 0), safeTotal || 0);
    const percentage = safeTotal > 0 ? Math.round((safeCompleted / safeTotal) * 100) : 0;

    return (
        <div className="rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-accent-active-light dark:text-text-accent-active-dark ${accentClassName || ""}`}>
                        <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                            {label}
                        </p>
                        <p className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                            {safeCompleted} of {safeTotal}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark px-2.5 py-1 text-xs font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                    <CheckIcon size={12} />
                    {percentage}%
                </div>
            </div>

            <div className="h-2 rounded-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden border border-border-primary-default-light dark:border-border-primary-default-dark">
                <div
                    className="h-full rounded-full bg-linear-to-r from-accent-500 to-accent-700 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export default function AcademicProgress({ progress, className = "" }) {
    return (
        <BaseComponent
            title="Academic Progress"
            description="Track degree completion, subject requirements, and electives at a glance."
            className={className}
            contentClassName="space-y-4"
        >
            <ProgressRow
                icon={BookIcon}
                label="Credit Hours"
                completed={progress.completedCreditHours}
                total={progress.totalCreditHours}
                accentClassName="text-emerald-600 dark:text-emerald-400"
            />

            <ProgressRow
                icon={BookIcon}
                label="Total Subjects"
                completed={progress.completedTotalSubjects}
                total={progress.totalSubjects}
                accentClassName="text-sky-600 dark:text-sky-400"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProgressRow
                    icon={FilePenIcon}
                    label="University Required"
                    completed={progress.completedUniversityRequiredSubjects}
                    total={progress.totalUniversityRequiredSubjects}
                    accentClassName="text-violet-600 dark:text-violet-400"
                />

                <ProgressRow
                    icon={FilePenIcon}
                    label="College Required"
                    completed={progress.completedCollegeRequiredSubjects}
                    total={progress.totalCollegeRequiredSubjects}
                    accentClassName="text-amber-600 dark:text-amber-400"
                />
            </div>

            <ProgressRow
                icon={FilePenIcon}
                label="Elective Subjects"
                completed={progress.completedElectiveSubjects}
                total={progress.totalElectiveSubjects}
                accentClassName="text-emerald-600 dark:text-emerald-400"
            />
        </BaseComponent>
    );
}