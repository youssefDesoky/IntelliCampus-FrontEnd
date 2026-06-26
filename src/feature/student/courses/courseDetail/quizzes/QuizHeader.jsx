import Button from "../../../../../components/ui/Button";
import { CheckIcon, ClockIcon, BookIcon } from "../../../../../components/ui/icons";

export default function QuizHeader({
	title,
	courseName,
	timeLeft,
	formatTime,
	progressPercent,
	answeredCount,
	totalCount,
	currentQuestion,
	onSubmit,
	hideControls = false,
	score,
}) {
	const isUrgent = timeLeft < 60 && !hideControls;

	return (
		<div className="sticky top-0 z-40 mb-6 rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light/80 dark:bg-bg-surface-primary-default-dark/80 backdrop-blur-md shadow-sm overflow-hidden">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-6 py-4">
				<div className="min-w-0">
					<div className="flex items-center gap-2 text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">
						<BookIcon size={13} />
						<span className="truncate">{courseName}</span>
					</div>
					<h1 className="text-lg sm:text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
						{title}
					</h1>
				</div>

				<div className="flex items-center gap-3 shrink-0">
					{hideControls && score ? (
						<div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
							<div className="text-right">
								<p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
									Score
								</p>
								<p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
									{score.percentage}%
								</p>
							</div>
							<div className="h-8 w-px bg-emerald-200 dark:bg-emerald-800" />
							<div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
								{score.score}
								<span className="text-emerald-500">/{score.maxScore}</span>
							</div>
						</div>
					) : !hideControls ? (
						<>
							<div
								className={`flex items-center gap-2 px-3 py-2 rounded-xl border bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark ${
									isUrgent
										? "border-red-200 dark:border-red-900 text-red-600 dark:text-red-400"
										: "border-border-primary-default-light dark:border-border-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark"
									}`}
							>
								<ClockIcon
									size={16}
									className={
										isUrgent
											? "text-red-500"
											: "text-text-secondary-default-light dark:text-text-secondary-default-dark"
										}
								/>
								<span className="font-mono text-sm font-semibold tabular-nums">
									{formatTime(timeLeft)}
								</span>
							</div>
							<Button
								startIcon={<CheckIcon size={14} />}
								onClick={onSubmit}
								className="shadow-sm"
							>
								Submit
							</Button>
						</>
					) : null}
				</div>
			</div>

			<div className="px-5 sm:px-6 pb-4">
				<div className="flex items-center justify-between text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2">
					<span>
						<span className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
							{answeredCount ?? "—"} of {totalCount ?? "—"}
						</span>{" "}
						answered
					</span>
					{currentQuestion && (
						<span>
							Questions{" "}
							<span className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
								{currentQuestion}
							</span>
						</span>
					)}
				</div>
				<div className="h-2 w-full rounded-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark overflow-hidden">
					<div
						className="h-full rounded-full bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark transition-all duration-700 ease-out"
						style={{ width: `${progressPercent}%` }}
					/>
				</div>
			</div>
		</div>
	);
}
