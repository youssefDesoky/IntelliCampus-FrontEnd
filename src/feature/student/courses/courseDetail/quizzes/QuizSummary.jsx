import { BookIcon, BrainIcon, CheckIcon, FilePenIcon } from "../../../../../components/ui/icons";

function StatRow({ icon, label, value, percent, barColor }) {
    return (
        <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{label}</p>
                    <p className="text-xs font-bold text-text-primary-default-light dark:text-text-primary-default-dark">{value}</p>
                </div>
                <div className="h-1.5 w-full rounded-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
                </div>
            </div>
        </div>
    );
}

export default function QuizSummary({
    backendResult,
    attemptLimit = 1,
    isLocked = false,
    totalCount,
    progressPercent,
    tfSummary,
    mcqSummary,
    writtenSummary,
    tfPercent,
    mcqPercent,
    writtenPercent,
    questions = [],
    answers = {},
    currentPage,
    pageSize,
    onNavigate,
    reviewMode,
    questionResultsMap = {},
}) {
    return (
        <div className="space-y-5 xl:sticky xl:top-40 xl:self-start">
            {backendResult && (
                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-5 text-center">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                        Your Score
                    </p>
                    <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                        {backendResult.percentage}%
                    </p>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mt-2">
                        {backendResult.score} <span className="text-emerald-500">/ {backendResult.maxScore}</span> points
                    </p>
                </div>
            )}

            <div className="rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5 shadow-sm">
                <h3 className="text-sm font-bold text-text-primary-default-light dark:text-text-primary-default-dark mb-4">
                    Question Navigator
                </h3>
                <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, idx) => {
                        const qNum = idx + 1;
                        const isAnswered = (() => {
                            const ans = answers[q.id];
                            if (q.type === "Written") return typeof ans === "string" && ans.trim().length > 0;
                            return ans !== undefined && ans !== null && String(ans).length > 0;
                        })();
                        const isCurrent = Math.ceil(qNum / pageSize) === currentPage;
                        const result = questionResultsMap[q.id];

                        let btnClass = "h-9 w-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all ";
                        if (reviewMode && result) {
                            if (result.isCorrect) {
                                btnClass += "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
                            } else {
                                btnClass += "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
                            }
                        } else if (isAnswered) {
                            btnClass += "bg-bg-fill-accent-default-light text-white dark:bg-bg-fill-accent-default-dark";
                        } else {
                            btnClass += "bg-bg-surface-secondary-default-light text-text-secondary-default-light border border-border-primary-default-light dark:bg-bg-surface-secondary-default-dark dark:text-text-secondary-default-dark dark:border-border-primary-default-dark";
                        }

                        if (isCurrent && !reviewMode) {
                            btnClass += " ring-2 ring-offset-1 ring-bg-fill-accent-default-light dark:ring-bg-fill-accent-default-dark dark:ring-offset-bg-surface-primary-default-dark";
                        } else if (isCurrent && reviewMode) {
                            btnClass += " ring-2 ring-offset-1 ring-text-primary-default-light dark:ring-text-primary-default-dark dark:ring-offset-bg-surface-primary-default-dark";
                        }

                        return (
                            <button
                                key={q.id}
                                onClick={() => onNavigate && onNavigate(Math.ceil(qNum / pageSize))}
                                className={btnClass}
                                title={`Question ${qNum}`}
                            >
                                {qNum}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark" />
                        Answered
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-bg-surface-secondary-default-light border border-border-primary-default-light dark:bg-bg-surface-secondary-default-dark dark:border-border-primary-default-dark" />
                        Unanswered
                    </span>
                    {reviewMode && (
                        <>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800" />
                                Correct
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-100 border border-red-200 dark:bg-red-900/30 dark:border-red-800" />
                                Incorrect
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                    Summary
                </h3>
                <StatRow
                    icon={<BookIcon size={16} />}
                    label="Total Questions"
                    value={`${totalCount}`}
                    percent={progressPercent}
                    barColor="bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark"
                />
                <StatRow
                    icon={<CheckIcon size={16} />}
                    label="True / False"
                    value={`${tfSummary.answered}/${tfSummary.total}`}
                    percent={tfPercent}
                    barColor="bg-sky-500"
                />
                <StatRow
                    icon={<BrainIcon size={16} />}
                    label="Multiple Choice"
                    value={`${mcqSummary.answered}/${mcqSummary.total}`}
                    percent={mcqPercent}
                    barColor="bg-violet-500"
                />
                <StatRow
                    icon={<FilePenIcon size={16} />}
                    label="Written"
                    value={`${writtenSummary.answered}/${writtenSummary.total}`}
                    percent={writtenPercent}
                    barColor="bg-emerald-500"
                />
            </div>

            <div className="text-center rounded-xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark px-4 py-3 text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                Attempt limit: <span className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{attemptLimit}</span>.
                {" "}{isLocked ? "This attempt is locked." : "One submission is allowed."}
            </div>
        </div>
    );
}
