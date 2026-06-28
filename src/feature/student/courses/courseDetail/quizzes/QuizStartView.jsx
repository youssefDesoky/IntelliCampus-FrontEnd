import { useState, useCallback, useRef, useEffect } from "react";
import Button from "../../../../../components/ui/Button";
import {
	BrainIcon,
	ClockIcon,
	CalendarDaysIcon,
	StarIcon,
	BookIcon,
	PlayIcon,
	CheckIcon,
} from "../../../../../components/ui/icons";

function CountdownOverlay({ onComplete }) {
	const [count, setCount] = useState(3);

	useEffect(() => {
		if (count <= 0) {
			onComplete();
			return;
		}
		const timer = setTimeout(() => setCount((c) => c - 1), 800);
		return () => clearTimeout(timer);
	}, [count, onComplete]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="text-center">
				{count > 0 ? (
					<div className="flex flex-col items-center gap-4">
						<span
							key={count}
							className="text-8xl font-extrabold text-white animate-bounce"
						>
							{count}
						</span>
						<p className="text-white/70 text-lg font-medium tracking-wide uppercase">
							Get Ready
						</p>
					</div>
				) : null}
			</div>
		</div>
	);
}

function InfoCard({ icon, label, value }) {
	return (
		<div className="flex items-center gap-3 p-4 rounded-xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark">
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-fill-accent-default-light/10 dark:bg-bg-fill-accent-default-dark/20 text-bg-fill-accent-default-light dark:text-bg-fill-accent-default-dark">
				{icon}
			</div>
			<div className="min-w-0">
				<p className="text-xs font-semibold uppercase tracking-wide text-text-secondary-default-light dark:text-text-secondary-default-dark">
					{label}
				</p>
				<p className="text-sm font-bold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
					{value}
				</p>
			</div>
		</div>
	);
}

export default function QuizStartView({ quizData, courseName, onStart }) {
	const [showCountdown, setShowCountdown] = useState(false);

	const handleStartRef = useRef(onStart);
	handleStartRef.current = onStart;

	const handleCountdownComplete = useCallback(() => {
		setShowCountdown(false);
		handleStartRef.current();
	}, []);

	const handleStartClick = useCallback(() => {
		setShowCountdown(true);
	}, []);

	const quizTitle = quizData?.title || "Quiz";
	const course = quizData?.courseName || courseName || "";
	const totalQuestions = quizData?.questionsSummary?.total || quizData?.questions?.length || 0;
	const durationMinutes = quizData?.durationSeconds
		? Math.round(quizData.durationSeconds / 60)
		: quizData?.durationMinutes || 0;
	const totalPoints = quizData?.totalPoints || quizData?.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0;
	const deadline = quizData?.dueDate || quizData?.deadline || "";
	const description = quizData?.description || "";
	const instructions = quizData?.instructions || "";
	const maxAttempts = quizData?.maxAttempts || 1;
	const passingScore = quizData?.passingScore || 0;

	return (
		<>
			{showCountdown && <CountdownOverlay onComplete={handleCountdownComplete} />}

			<div className="max-w-4xl mx-auto space-y-6">
				<div className="relative overflow-hidden rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-gradient-to-br from-bg-fill-accent-default-light/10 via-bg-surface-primary-default-light to-bg-surface-primary-default-light dark:from-bg-fill-accent-default-dark/10 dark:via-bg-surface-primary-default-dark dark:to-bg-surface-primary-default-dark shadow-sm">
					<div className="absolute top-0 right-0 w-64 h-64 bg-bg-fill-accent-default-light/5 dark:bg-bg-fill-accent-default-dark/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
					<div className="absolute bottom-0 left-0 w-48 h-48 bg-bg-fill-accent-default-light/5 dark:bg-bg-fill-accent-default-dark/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

					<div className="relative p-6 sm:p-8">
						<div className="flex items-center gap-2 text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark mb-3">
							<BookIcon size={13} />
							<span className="truncate">{course}</span>
						</div>

						<h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
							{quizTitle}
						</h1>

						<div className="flex flex-wrap items-center gap-3 mt-4">
							<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
								<BrainIcon size={13} />
								{totalQuestions} Question{totalQuestions !== 1 ? "s" : ""}
							</span>
							<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
								<StarIcon size={13} />
								{totalPoints} Point{totalPoints !== 1 ? "s" : ""}
							</span>
							{durationMinutes > 0 && (
								<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
									<ClockIcon size={13} />
									{durationMinutes} min
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					<InfoCard
						icon={<ClockIcon size={18} />}
						label="Duration"
						value={durationMinutes > 0 ? `${durationMinutes} minutes` : "No limit"}
					/>
					<InfoCard
						icon={<BrainIcon size={18} />}
						label="Questions"
						value={`${totalQuestions}`}
					/>
					<InfoCard
						icon={<StarIcon size={18} />}
						label="Total Points"
						value={`${totalPoints}`}
					/>
					<InfoCard
						icon={<CalendarDaysIcon size={18} />}
						label="Deadline"
						value={deadline || "No deadline"}
					/>
				</div>

				{(description || instructions) && (
					<div className="rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-6 sm:p-8 shadow-sm">
						{description && (
							<div className="space-y-2">
								<h2 className="text-sm font-bold uppercase tracking-wide text-text-secondary-default-light dark:text-text-secondary-default-dark">
									Description
								</h2>
								<p className="text-sm text-text-primary-default-light dark:text-text-primary-default-dark leading-relaxed">
									{description}
								</p>
							</div>
						)}

						{description && instructions && (
							<div className="my-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark" />
						)}

						{instructions && (
							<div className="space-y-2">
								<h2 className="text-sm font-bold uppercase tracking-wide text-text-secondary-default-light dark:text-text-secondary-default-dark">
									Instructions
								</h2>
								<div className="p-4 rounded-xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-sm text-text-primary-default-light dark:text-text-primary-default-dark leading-relaxed whitespace-pre-wrap">
									{instructions}
								</div>
							</div>
						)}
					</div>
				)}

				<div className="rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-6 sm:p-8 shadow-sm">
					<h2 className="text-sm font-bold uppercase tracking-wide text-text-secondary-default-light dark:text-text-secondary-default-dark mb-4">
						Guidelines
					</h2>
					<ul className="space-y-3">
						{[
							"Read each question carefully before answering.",
							"You can navigate between questions using the sidebar.",
							"Once submitted, answers cannot be changed.",
							durationMinutes > 0 ? `You have ${durationMinutes} minutes to complete this quiz.` : null,
							passingScore > 0 ? `The passing score is ${passingScore}%.` : null,
							maxAttempts > 1 ? `You have up to ${maxAttempts} attempts for this quiz.` : "Only one attempt is allowed for this quiz.",
						]
							.filter(Boolean)
							.map((item, idx) => (
								<li key={idx} className="flex items-start gap-3 text-sm text-text-primary-default-light dark:text-text-primary-default-dark">
									<CheckIcon size={16} className="mt-0.5 shrink-0 text-green-500" />
									<span>{item}</span>
								</li>
							))}
					</ul>
				</div>

				<div className="flex justify-center pb-8">
					<Button
						size="lg"
						startIcon={<PlayIcon size={18} />}
						onClick={handleStartClick}
						className="px-10 py-3.5 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
					>
						Start Quiz
					</Button>
				</div>
			</div>
		</>
	);
}
