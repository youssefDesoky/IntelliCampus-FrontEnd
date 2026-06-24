import {
	BookIcon,
	BrainIcon,
	CheckIcon,
	FilePenIcon,
} from "../../../../../components/ui/icons";
import BaseComponent from "../../../../../components/ui/BaseComponent";

function SummaryCard({ icon, iconClassName, title, value, percent, barClassName }) {
	return (
		<div className="p-4 rounded-xl shadow-sm flex items-center gap-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
			<div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconClassName}`}>{icon}</div>
			<div className="flex-1">
				<p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{title}</p>
				<p className="font-semibold text-text-primary-light dark:text-text-primary-dark text-lg">{value}</p>
				<div className="mt-2 h-2 w-full rounded-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden">
					<div className={`h-full rounded-full ${barClassName}`} style={{ width: percent + '%' }} />
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
}) {
	return (
		<BaseComponent
			title="Quiz Summary"
			subtitle="Backend graded result, one-attempt lock, and completion by question type."
			contentClassName="px-5 py-5 sm:px-6 space-y-4"
		>
			{backendResult && (
				<div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-200">
					<p className="text-xs uppercase tracking-wider font-semibold mb-1">Backend graded result</p>
					<p className="text-sm font-medium">
						Score {backendResult.score}/{backendResult.maxScore} ({backendResult.percentage}%)
					</p>
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<SummaryCard
					icon={<BookIcon size={18} />}
					iconClassName="bg-amber-100 text-amber-700"
					title="Total Questions"
					value={totalCount}
					percent={progressPercent}
					barClassName="bg-emerald-500"
				/>

				<SummaryCard
					icon={<CheckIcon size={18} />}
					iconClassName="bg-sky-100 text-sky-700"
					title="True / False"
					value={`${tfSummary.answered}/${tfSummary.total}`}
					percent={tfPercent}
					barClassName="bg-sky-500"
				/>

				<SummaryCard
					icon={<BrainIcon size={18} />}
					iconClassName="bg-violet-100 text-violet-700"
					title="Multiple Choice"
					value={`${mcqSummary.answered}/${mcqSummary.total}`}
					percent={mcqPercent}
					barClassName="bg-violet-500"
				/>

				<SummaryCard
					icon={<FilePenIcon size={18} />}
					iconClassName="bg-emerald-100 text-emerald-700"
					title="Written"
					value={`${writtenSummary.answered}/${writtenSummary.total}`}
					percent={writtenPercent}
					barClassName="bg-emerald-500"
				/>
			</div>

        	<div className="text-center rounded-xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark px-4 py-3 text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
				Attempt limit: {attemptLimit}. {isLocked ? "This attempt is locked." : "One submission is allowed."}
			</div>
		</BaseComponent>
	);
}
