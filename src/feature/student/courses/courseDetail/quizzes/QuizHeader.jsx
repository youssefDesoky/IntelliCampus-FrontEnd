import Button from "../../../../../components/ui/Button";
import { CheckIcon } from "../../../../../components/ui/icons";

export default function QuizHeader({
	title,
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
	return (
		<div className="mb-6 rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden">
			<div className="flex items-stretch">
				<div className="flex-1 flex flex-col justify-center gap-1.5 px-6 py-5 border-r border-border-primary-default-light dark:border-border-primary-default-dark">
					<h1 className="text-[19px] font-medium leading-snug text-text-primary-light dark:text-text-primary-dark">{title}</h1>
					<div className="flex items-center gap-3 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
						<span>
							<span className="font-medium text-text-primary-light dark:text-text-primary-dark">{answeredCount ?? "—"} of {totalCount ?? "—"}</span> answered
						</span>
						{currentQuestion && (
							<>
								<span className="opacity-30">·</span>
								<span>
									Question <span className="font-medium text-text-primary-light dark:text-text-primary-dark">{currentQuestion}</span>
								</span>
							</>
						)}
					</div>
				</div>

				{hideControls && score ? (
					<div className="flex flex-col items-center justify-center gap-1 px-6 py-5 min-w-[140px]">
						<p className="text-[10px] font-medium uppercase tracking-widest text-text-secondary-default-light dark:text-text-secondary-default-dark mb-0.5">Your Score</p>
						<p className="text-[28px] font-bold leading-none tracking-tight text-emerald-600 dark:text-emerald-400">
							{score.score}<span className="text-base font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark">/{score.maxScore}</span>
						</p>
						<p className="text-xs font-semibold text-emerald-500">{score.percentage}%</p>
					</div>
				) : !hideControls ? (
					<div className="flex flex-col items-center justify-center gap-3 px-6 py-5">
						<div className="text-center">
							<p className="text-[10px] font-medium uppercase tracking-widest text-text-secondary-default-light dark:text-text-secondary-default-dark mb-0.5">Time left</p>
							<p className="font-mono text-[30px] font-medium leading-none tracking-tight text-text-primary-light dark:text-text-primary-dark">{formatTime(timeLeft)}</p>
						</div>
						<div className="flex gap-2">
							<Button startIcon={<CheckIcon size={14} />} onClick={onSubmit}>
								Submit
							</Button>
						</div>
					</div>
				) : null}
			</div>

			<div className="px-6 pb-5">
				<div className="flex items-center gap-3">
					<div className="flex-1 h-0.75 rounded-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark overflow-hidden">
						<div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: progressPercent + '%' }} />
					</div>
					<span className="text-xs font-medium text-emerald-500">{progressPercent}%</span>
				</div>
			</div>
		</div>
	);
}
