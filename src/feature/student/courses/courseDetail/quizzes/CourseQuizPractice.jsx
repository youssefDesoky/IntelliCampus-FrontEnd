import { useState, useEffect, useRef, useCallback } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useError } from "../../../../../contexts/ErrorContext.jsx";

import PaginationButtons from "../../../../../components/ui/PaginationButtons";
import QuestionCard from "./QuestionCard";
import QuizHeader from "./QuizHeader";
import QuizSummary from "./QuizSummary";
import { fetchPracticeQuiz, submitPracticeQuiz } from "../../../services/quizzesApi";
import { Grid2ColIcon, XIcon } from "../../../../../components/ui/icons";

const PAGE_SIZE = 3;

export default function CourseQuizPractice() {
	const { course } = useOutletContext();
	const courseId = course?.id;
	const [searchParams] = useSearchParams();
	const reviewMode = searchParams.get("review") || null;
	const selectedQuizId = searchParams.get("quizId");
	const { showError } = useError();
	const queryClient = useQueryClient();
	const [practiceQuizData, setPracticeQuizData] = useState(null);
	const [isQuizLoading, setIsQuizLoading] = useState(true);
	const submissionLockRef = useRef(false);

	const [currentPage, setCurrentPage] = useState(1);
	const [answers, setAnswers] = useState({});
	const [isSubmitted, setIsSubmitted] = useState(Boolean(reviewMode));
	const [submissionResult, setSubmissionResult] = useState(null);
	const [timeLeft, setTimeLeft] = useState(720);
	const [quizStarted, setQuizStarted] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const loadPracticeQuiz = useCallback(async () => {
		if (!courseId) return;
		try {
			setIsQuizLoading(true);
			const data = await fetchPracticeQuiz(courseId, selectedQuizId);
			setPracticeQuizData(data);
		} catch (err) {
			showError(err.message || "Failed to load quiz");
		} finally {
			setIsQuizLoading(false);
		}
	}, [courseId, selectedQuizId]);

	useEffect(() => {
		loadPracticeQuiz();
	}, [loadPracticeQuiz]);

	useEffect(() => {
		if (practiceQuizData?.durationSeconds) {
			setTimeLeft(practiceQuizData.durationSeconds);
		}
	}, [practiceQuizData?.durationSeconds]);

	const quizQuestions = practiceQuizData?.questions || [];
	const quizTitle = practiceQuizData?.title || "Practice Quiz";
	const courseName = practiceQuizData?.courseName || course?.title || course?.name;
	const isBackendSubmitted = Boolean(practiceQuizData?.previousSubmission) || Boolean(reviewMode);
	const quizSummary = practiceQuizData?.questionsSummary || { total: 0, tf: 0, mcq: 0, written: 0 };
	const totalDuration = practiceQuizData?.durationSeconds || 720;

	const answeredCount = quizQuestions.filter((q) => {
		const answer = answers[q.id];
		if (q.type === "Written") return typeof answer === "string" && answer.trim().length > 0;
		return answer !== undefined && answer !== null && String(answer).length > 0;
	}).length;

	const writtenQuestion = quizQuestions.find((q) => q.type === "Written");
	const writtenWordCount = writtenQuestion && answers[writtenQuestion.id] ? answers[writtenQuestion.id].trim().split(/\s+/).length : 0;
	const progressPercent = quizSummary.total ? Math.round((answeredCount / quizSummary.total) * 100) : 0;
	const pageSize = practiceQuizData?.pageSize || PAGE_SIZE;
	const totalPages = Math.max(1, Math.ceil(quizSummary.total / pageSize));
	const visibleQuestions = quizQuestions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const currentQuestionStart = (currentPage - 1) * pageSize + 1;
	const currentQuestionEnd = Math.min(currentPage * pageSize, quizSummary.total);
	const currentQuestionLabel = totalPages > 1 ? `${currentQuestionStart}-${currentQuestionEnd}` : String(currentQuestionStart);

	const tfAnswered = quizQuestions.filter((q) => q.type === "TF" && answers[q.id] !== undefined && answers[q.id] !== null).length;
	const mcqAnswered = quizQuestions.filter((q) => q.type === "MCQ" && answers[q.id] !== undefined && answers[q.id] !== null).length;
	const writtenAnswered = quizQuestions.filter((q) => q.type === "Written" && answers[q.id] && answers[q.id].trim().length > 0).length;

	const tfPercent = quizSummary.tf ? Math.round((tfAnswered / quizSummary.tf) * 100) : 0;
	const mcqPercent = quizSummary.mcq ? Math.round((mcqAnswered / quizSummary.mcq) * 100) : 0;
	const writtenPercent = quizSummary.written ? Math.round((writtenAnswered / quizSummary.written) * 100) : 0;

	const backendResult = submissionResult || practiceQuizData?.previousSubmission || null;
	const tfSummary = backendResult?.byType?.TF || { answered: tfAnswered, total: quizSummary.tf };
	const mcqSummary = backendResult?.byType?.MCQ || { answered: mcqAnswered, total: quizSummary.mcq };
	const writtenSummary = backendResult?.byType?.Written || { answered: writtenAnswered, total: quizSummary.written };

	const questionResultsMap = {};
	if (backendResult?.questionResults) {
		for (const r of backendResult.questionResults) {
			questionResultsMap[r.questionId] = r;
		}
	}

	useEffect(() => {
		if (reviewMode && practiceQuizData?.previousSubmission?.answers) {
			setAnswers(practiceQuizData.previousSubmission.answers);
		}
	}, [reviewMode, practiceQuizData]);

	const handleSubmitQuiz = useCallback(async () => {
		if (submissionLockRef.current) return;
		submissionLockRef.current = true;
		setIsSubmitted(true);

		try {
			if (!courseId) return;
			const payload = await submitPracticeQuiz(courseId, {
				quizId: practiceQuizData?.quizId,
				answers,
			});
			setSubmissionResult(payload);
			queryClient.invalidateQueries({ queryKey: ["reminders"] });
			queryClient.removeQueries({ queryKey: ["todayReminders"], exact: false });
			queryClient.invalidateQueries({ queryKey: ["courseQuizzes", courseId] });
		} catch {
			// submission failed — user will see the error via quizError or a UI notification
		}
	}, [answers, courseId, practiceQuizData?.quizId]);

	useEffect(() => {
		if (isSubmitted || isBackendSubmitted || reviewMode || !quizStarted) return;
		const timerId = setInterval(() => {
			setTimeLeft((remaining) => {
				if (remaining <= 1) {
					clearInterval(timerId);
					void handleSubmitQuiz();
					return 0;
				}
				return remaining - 1;
			});
		}, 1000);

		return () => clearInterval(timerId);
	}, [handleSubmitQuiz, isBackendSubmitted, isSubmitted, quizStarted, reviewMode]);

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return minutes + ":" + String(remainingSeconds).padStart(2, "0");
	}

	function handlePageChange(page) {
		setCurrentPage(Math.max(1, Math.min(totalPages, page)));
	}

	if (isQuizLoading) {
		return (
			<div className="max-w-7xl mx-auto relative">
				{/* Header skeleton */}
				<div className="sticky top-0 z-40 mb-6">
					<div className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm overflow-hidden animate-pulse">
						<div className="px-5 sm:px-6 py-4">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div className="min-w-0">
									<div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
									<div className="h-6 w-64 rounded bg-gray-300 dark:bg-gray-600" />
								</div>
								<div className="flex items-center gap-3 shrink-0">
									<div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-gray-100 dark:bg-gray-800">
										<div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
										<div className="flex flex-col min-w-[4.5rem]">
											<div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700 mb-1" />
											<div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
										</div>
									</div>
									<div className="h-9 w-24 rounded-lg bg-gray-200 dark:bg-gray-700" />
								</div>
							</div>
						</div>
						<div className="px-5 sm:px-6 pb-4">
							<div className="flex items-center gap-1">
								{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
									<div key={i} className="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700" />
								))}
							</div>
							<div className="flex items-center justify-between mt-2">
								<div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-700" />
								<div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
							</div>
						</div>
					</div>
				</div>

				<div className="flex gap-6 items-start">
					{/* Question cards skeleton */}
					<div className="flex-1 min-w-0 space-y-5">
						{[1, 2, 3].map((i) => (
							<div key={i} className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 p-5 animate-pulse">
								<div className="h-3 w-12 rounded bg-gray-200 dark:bg-gray-700 mb-3" />
								<div className="h-5 w-3/4 rounded bg-gray-300 dark:bg-gray-600 mb-4" />
								<div className="h-5 w-1/2 rounded bg-gray-300 dark:bg-gray-600 mb-6" />

								{/* Option rows */}
								<div className="space-y-3">
									{[1, 2, 3, 4].map((j) => (
										<div key={j} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
											<div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
											<div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
										</div>
									))}
								</div>
							</div>
						))}

						{/* Pagination skeleton */}
						<div className="flex items-center justify-center pt-2 pb-6 gap-2">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="h-9 w-9 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
							))}
						</div>
					</div>

					{/* Sidebar skeleton */}
					<div className="hidden xl:block w-80 shrink-0">
						<div className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 p-5 animate-pulse">
							<div className="h-5 w-28 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
							<div className="h-5 w-20 rounded bg-gray-300 dark:bg-gray-600 mb-4" />

							<div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 mb-4" />

							<div className="grid grid-cols-5 gap-2 mb-4">
								{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
									<div key={i} className="h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
								))}
							</div>

							<div className="space-y-2 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
								{[1, 2, 3].map((i) => (
									<div key={i} className="flex items-center justify-between">
										<div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
										<div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto relative">
			<QuizHeader
				title={quizTitle}
				courseName={courseName}
				timeLeft={timeLeft}
				formatTime={formatTime}
				answeredCount={answeredCount}
				totalCount={quizSummary.total}
				currentQuestion={currentQuestionLabel}
				onSubmit={handleSubmitQuiz}
				hideControls={Boolean(reviewMode)}
				score={backendResult}
				totalDuration={totalDuration}
				questions={quizQuestions}
				answers={answers}
				currentPage={currentPage}
				pageSize={pageSize}
			/>

			<div className="flex gap-6 items-start">
				{/* Main question area */}
				<div className="flex-1 min-w-0 space-y-5">
					{visibleQuestions.map((question, index) => {
						const questionNumber = (currentPage - 1) * pageSize + index + 1;
						const result = questionResultsMap[question.id];
						return (
							<QuestionCard
								key={question.id}
								question={question}
								questionType={question.type}
								answer={answers[question.id]}
								onAnswerChange={reviewMode ? null : (value) => setAnswers((state) => ({ ...state, [question.id]: value }))}
								writtenWordCount={writtenWordCount}
								showCorrectAnswer={reviewMode === "graded"}
								correctAnswer={question.correctAnswer}
								feedback={result?.feedback}
								scoreState={reviewMode && result ? (
									<div className="flex items-center gap-2">
										<span className={"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold " + (result.isCorrect ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300")}>
											{result.isCorrect ? "Correct" : "Incorrect"}
										</span>
										<span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
											{result.earnedPoints}/{result.points} pts
										</span>
									</div>
								) : (
									<span className="text-xs font-semibold uppercase tracking-wide text-text-secondary-default-light dark:text-text-secondary-default-dark">
										Q{questionNumber}
									</span>
								)}
							/>
						);
					})}

					{/* Pagination */}
					<div className="flex items-center justify-center pt-2 pb-6">
						<PaginationButtons totalPages={totalPages} currentPage={currentPage} setCurrentPage={handlePageChange} />
					</div>
				</div>

				{/* Desktop sidebar - hidden on smaller screens */}
				<div className="hidden xl:block w-80 shrink-0">
					<QuizSummary
						backendResult={backendResult}
						totalCount={quizSummary.total}
						progressPercent={progressPercent}
						tfSummary={tfSummary}
						mcqSummary={mcqSummary}
						writtenSummary={writtenSummary}
						tfPercent={tfPercent}
						mcqPercent={mcqPercent}
						writtenPercent={writtenPercent}
						questions={quizQuestions}
						answers={answers}
						currentPage={currentPage}
						pageSize={pageSize}
						onNavigate={handlePageChange}
						reviewMode={reviewMode}
						questionResultsMap={questionResultsMap}
					/>
				</div>
			</div>

			{/* Mobile floating nav toggle button */}
			<button
				onClick={() => setSidebarOpen(true)}
				className="xl:hidden fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
				aria-label="Open question navigator"
			>
				<Grid2ColIcon size={18} />
				<span className="text-sm font-semibold">{answeredCount}/{quizSummary.total}</span>
			</button>

			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div className="fixed inset-0 z-50 xl:hidden">
					<div
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						onClick={() => setSidebarOpen(false)}
					/>
					<div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-2xl overflow-y-auto">
						<div className="flex items-center justify-between p-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
							<h2 className="text-sm font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
								Quiz Navigator
							</h2>
							<button
								onClick={() => setSidebarOpen(false)}
								className="p-2 rounded-lg hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark transition-colors text-text-secondary-default-light dark:text-text-secondary-default-dark"
							>
								<XIcon size={18} />
							</button>
						</div>
						<div className="p-4">
							<QuizSummary
								backendResult={backendResult}
								totalCount={quizSummary.total}
								progressPercent={progressPercent}
								tfSummary={tfSummary}
								mcqSummary={mcqSummary}
								writtenSummary={writtenSummary}
								tfPercent={tfPercent}
								mcqPercent={mcqPercent}
								writtenPercent={writtenPercent}
								questions={quizQuestions}
								answers={answers}
								currentPage={currentPage}
								pageSize={pageSize}
								onNavigate={(page) => {
									handlePageChange(page);
									setSidebarOpen(false);
								}}
								reviewMode={reviewMode}
								questionResultsMap={questionResultsMap}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
