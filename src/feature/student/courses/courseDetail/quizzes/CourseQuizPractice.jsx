import { useState, useEffect, useRef, useCallback } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { useError } from "../../../../../contexts/ErrorContext.jsx";

import PaginationButtons from "../../../../../components/ui/PaginationButtons";
import QuestionCard from "./QuestionCard";
import QuizHeader from "./QuizHeader";
import QuizSummary from "./QuizSummary";
import QuizStartView from "./QuizStartView";
import { fetchPracticeQuiz, submitPracticeQuiz } from "../../../services/quizzesApi";
import { ArrowRightIcon } from "../../../../../components/ui/icons";

const PAGE_SIZE = 3;

export default function CourseQuizPractice() {
	const { course } = useOutletContext();
	const courseId = course?.id;
	const [searchParams] = useSearchParams();
	const reviewMode = searchParams.get("review") || null;
	const selectedQuizId = searchParams.get("quizId");
	const { showError } = useError();
	const [practiceQuizData, setPracticeQuizData] = useState(null);
	const [isQuizLoading, setIsQuizLoading] = useState(true);
	const submissionLockRef = useRef(false);

	const [currentPage, setCurrentPage] = useState(1);
	const [answers, setAnswers] = useState({});
	const [isSubmitted, setIsSubmitted] = useState(Boolean(reviewMode));
	const [submissionResult, setSubmissionResult] = useState(null);
	const [timeLeft, setTimeLeft] = useState(720);
	const [quizStarted, setQuizStarted] = useState(false);

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
			<div className="flex flex-col items-center justify-center py-20 gap-4">
				<div className="h-10 w-10 rounded-full border-2 border-border-primary-default-light dark:border-border-primary-default-dark border-t-bg-fill-accent-default-light dark:border-t-bg-fill-accent-default-dark animate-spin" />
				<p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading quiz...</p>
			</div>
		);
	}

	if (!quizStarted && !reviewMode && !isBackendSubmitted) {
		return (
			<QuizStartView
				quizData={practiceQuizData}
				courseName={courseName}
				onStart={() => setQuizStarted(true)}
			/>
		);
	}

	return (
		<div className="max-w-7xl mx-auto">
			<QuizHeader
				title={quizTitle}
				courseName={courseName}
				timeLeft={timeLeft}
				formatTime={formatTime}
				progressPercent={progressPercent}
				answeredCount={answeredCount}
				totalCount={quizSummary.total}
				currentQuestion={currentQuestionLabel}
				onSubmit={handleSubmitQuiz}
				hideControls={Boolean(reviewMode)}
				score={backendResult}
			/>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
				<div className="xl:col-span-2 space-y-5">
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
										<span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
											result.isCorrect
												? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
												: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
										}`}>
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

					<div className="flex items-center justify-between pt-2">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage <= 1}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
						>
							<ArrowRightIcon size={16} className="rotate-180" />
							Previous
						</button>

						<PaginationButtons totalPages={totalPages} currentPage={currentPage} setCurrentPage={handlePageChange} />

						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage >= totalPages}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
						>
							Next
							<ArrowRightIcon size={16} />
						</button>
					</div>
				</div>

				<div>
					<QuizSummary
						backendResult={backendResult}
						attemptLimit={practiceQuizData?.maxAttempts || 1}
						isLocked={Boolean(practiceQuizData?.previousSubmission)}
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
		</div>
	);
}
