import Button from "../../../../../components/ui/Button";
import { CheckIcon, ClockIcon, BookIcon, ExclamationIcon } from "../../../../../components/ui/icons";

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
	const isWarning = timeLeft >= 60 && timeLeft < 120 && !hideControls;

	const progressColor =
		progressPercent >= 100
			? "bg-green-500"
			: progressPercent >= 70
				? "bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark"
				: progressPercent >= 30
					? "bg-amber-500"
					: "bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark";

	return (
		<div className="sticky top-0 z-40 mb-6 rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light/80 dark:bg-bg-surface-primary-default-dark/80 backdrop-blur-md shadow-sm overflow-hidden">
			{isUrgent && !hideControls && (
				<div className="px-5 sm:px-6 py-2 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30 flex items-center gap-2 text-xs font-semibold text-red-700 dark:text-red-300">
					<ExclamationIcon size={13} />
					<span>Less than a minute remaining! Submit your quiz soon.</span>
				</div>
			)}
			{isWarning && !hideControls && (
				<div className="px-5 sm:px-6 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-900/30 flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
					<ExclamationIcon size={13} />
					<span>Less than 2 minutes remaining!</span>
				</div>
			)}
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
								className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${
									isUrgent
										? "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
										: isWarning
											? "border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
											: "bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-border-primary-default-light dark:border-border-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark"
									}`}
							>
								<ClockIcon
									size={16}
									className={
										isUrgent
											? "text-red-500"
											: isWarning
												? "text-amber-500"
												: "text-text-secondary-default-light dark:text-text-secondary-default-dark"
										}
								/>
								<span className={`font-mono text-sm font-semibold tabular-nums ${isUrgent ? "animate-pulse" : ""}`}>
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
						className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor}`}
						style={{ width: `${progressPercent}%` }}
					/>
				</div>
			</div>
		</div>
	);
}
