import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";

import Section from "../../../../../components/ui/Section";
import BaseComponent from "../../../../../components/ui/BaseComponent";
import Button from "../../../../../components/ui/Button";
import PaginationButtons from "../../../../../components/ui/PaginationButtons";
import { CalendarDaysIcon, ClockIcon, PlayIcon, EyeIcon, ChartBarIcon, StarIcon, BrainIcon, CheckIcon } from "../../../../../components/ui/icons";
import { fetchCourseQuizzesOverview } from "../../../services/quizzesApi";


const PAGE_SIZE = 3;

function toPercent(score, maxScore) {
    if (!maxScore) return 0;
    return Math.round((score / maxScore) * 100);
}

function formatDate(value) {
    if (!value) return "TBD";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "TBD";
    return date.toLocaleString();
}

function formatDuration(minutes) {
    const numericMinutes = Number(minutes);
    if (Number.isNaN(numericMinutes)) return "0 min";
    return `${numericMinutes} min`;
}

function getQuizStatusStyle(status) {
    if (status === "Completed") {
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800";
    }

    if (status === "Missed") {
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800";
    }

    return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
}

function QuizCard({ quiz, isUpcoming, onStartQuiz, onViewResults, onReviewResults }) {
    const scoreLabel = quiz.maxScore ? `${quiz.score}/${quiz.maxScore}` : "TBD";
    const scorePercent = quiz.maxScore ? toPercent(quiz.score, quiz.maxScore) : 0;
    const isHighScore = scorePercent >= 80;
    const isMidScore = scorePercent >= 50 && scorePercent < 80;

    return (
        <div className="group bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl p-5 hover:shadow-lg hover:border-bg-fill-accent-default-light/30 dark:hover:border-bg-fill-accent-default-dark/30 transition-all duration-200">
            <div className="flex flex-row items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <BrainIcon size={16} className="text-bg-fill-accent-default-light dark:text-bg-fill-accent-default-dark shrink-0" />
                        <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                            {quiz.title}
                        </h3>
                    </div>
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark line-clamp-2 ml-7">
                        {isUpcoming
                            ? "Open the quiz window and complete it before the deadline."
                            : quiz.status === "Missed"
                                ? "This quiz was not completed before the deadline."
                                : quiz.status === "Completed" || quiz.status === "Submitted"
                                    ? scorePercent >= 0
                                        ? `You scored ${scoreLabel} (${scorePercent}%). ${isHighScore ? "Great work!" : isMidScore ? "Keep practicing!" : "Review the material and try again."}`
                                        : "Review your score and results for this quiz."
                                    : "Review your score and results for this quiz."}
                    </p>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${getQuizStatusStyle(quiz.status)}`}>
                    {quiz.status === "Completed" && <CheckIcon size={11} />}
                    {quiz.status}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-3">
                <div className="col-span-2 sm:col-span-1 rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark p-3">
                    <div className="flex items-center gap-2 text-text-secondary-default-light dark:text-text-secondary-default-dark text-xs font-semibold uppercase tracking-wide mb-2">
                        <CalendarDaysIcon size={14} />
                        Deadline
                    </div>
                    <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
                        {quiz.dueDate}
                    </p>
                </div>

                <div className="rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark p-3">
                    <div className="flex items-center gap-2 text-text-secondary-default-light dark:text-text-secondary-default-dark text-xs font-semibold uppercase tracking-wide mb-2">
                        <ClockIcon size={14} />
                        Duration
                    </div>
                    <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
                        {quiz.duration}
                    </p>
                </div>

                <div className="rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark p-3">
                    <div className="flex items-center gap-2 text-text-secondary-default-light dark:text-text-secondary-default-dark text-xs font-semibold uppercase tracking-wide mb-2">
                        <StarIcon size={14} />
                        Score
                    </div>

                    <div className="flex flex-row justify-between items-center">
                        <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
                            {scoreLabel}
                        </p>
                        <p className={`text-xs font-bold ${isHighScore ? "text-green-600 dark:text-green-400" : isMidScore ? "text-amber-600 dark:text-amber-400" : "text-text-secondary-default-light dark:text-text-secondary-default-dark"}`}>
                            {quiz.maxScore ? `${scorePercent}%` : "TBD"}
                        </p>
                    </div>
                    {quiz.maxScore > 0 && (
                        <div className="mt-2 h-1.5 w-full rounded-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${isHighScore ? "bg-green-500" : isMidScore ? "bg-amber-500" : "bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark"}`}
                                style={{ width: `${scorePercent}%` }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {isUpcoming ? (
                    <Button className="w-full sm:flex-1 shadow-sm hover:shadow-md transition-shadow" startIcon={<PlayIcon size={16} />} onClick={() => onStartQuiz && onStartQuiz(quiz)}>
                        Start Quiz
                    </Button>
                ) : quiz.status === "Completed" ? (
                    <Button className="w-full sm:flex-1" variant="secondary" startIcon={<ChartBarIcon size={16} />} onClick={() => onViewResults && onViewResults(quiz)}>
                        View Results
                    </Button>
                ) : quiz.status === "Submitted" ? (
                    <Button className="w-full sm:flex-1" variant="secondary" startIcon={<EyeIcon size={16} />} onClick={() => onReviewResults && onReviewResults(quiz)}>
                        Review Results
                    </Button>
                ) : quiz.status === "Missed" ? (
                    <Button className="w-full sm:flex-1" variant="secondary" startIcon={<EyeIcon size={16} />} onClick={() => onReviewResults && onReviewResults(quiz)}>
                        View Exam
                    </Button>
                ) : (
                    <Button variant="secondary" className="w-full sm:flex-1" onClick={() => onReviewResults && onReviewResults(quiz)}>
                        View Details
                    </Button>
                )}
            </div>
        </div>
    );
}

export default function CourseQuizzes() {
    const { course } = useOutletContext();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const { data: overview = null, isLoading } = useQuery({
        queryKey: ["courseQuizzes", course?.id],
        queryFn: async () => {
            const res = await fetchCourseQuizzesOverview(course.id);
            return res?.data?.[0] ?? null;
        },
        staleTime: 2 * 60 * 1000,
        enabled: !!course?.id,
    });

    const activeQuizzes = useMemo(() => {
        const items = overview?.upcoming || [];
        return items
            .filter((quiz) => String(quiz.status || "").toLowerCase() === "active")
            .map((quiz) => ({
                id: quiz.id,
                title: quiz.title,
                score: 0,
                maxScore: Number(quiz.maxScore || 0),
                dueDate: formatDate(quiz.dueDate),
                duration: formatDuration(quiz.durationMinutes),
                status: "Active",
            }));
    }, [overview]);

    const historyQuizzes = useMemo(() => {
        const history = (overview?.history || []).map((quiz) => ({
            id: quiz.id,
            title: quiz.title,
            score: Number(quiz.score || 0),
            maxScore: Number(quiz.maxScore || 0),
            dueDate: formatDate(quiz.dueDate),
            duration: formatDuration(quiz.durationMinutes),
            status: quiz.status || "Completed",
        }));

        const missed = (overview?.upcoming || [])
            .filter((quiz) => String(quiz.status || "").toLowerCase() === "missed")
            .map((quiz) => ({
                id: quiz.id,
                title: quiz.title,
                score: 0,
                maxScore: Number(quiz.maxScore || 0),
                dueDate: formatDate(quiz.dueDate),
                duration: formatDuration(quiz.durationMinutes),
                status: "Missed",
            }));

        return [...history, ...missed];
    }, [overview]);

    const completedCount = Number(overview?.stats?.completed || 0);
    const missedCount = Number(overview?.stats?.missed || 0);
    const averageScore = Number(overview?.stats?.averageScore || 0);

    const totalPages = Math.max(1, Math.ceil(historyQuizzes.length / PAGE_SIZE));
    const validCurrentPage = Math.min(currentPage, totalPages);
    const pagedQuizzes = useMemo(() => {
        const start = (validCurrentPage - 1) * PAGE_SIZE;
        return historyQuizzes.slice(start, start + PAGE_SIZE);
    }, [historyQuizzes, validCurrentPage]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
            <div className="lg:col-span-2 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-5">
                            <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                            <div className="h-5 w-36 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        </div>
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5 animate-pulse">
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700" />
                                                <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                                            </div>
                                            <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700 ml-6 mt-2" />
                                        </div>
                                        <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-3">
                                        <div className="col-span-2 sm:col-span-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
                                            <div className="h-3 w-14 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                                            <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-600" />
                                        </div>
                                        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
                                            <div className="h-3 w-14 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                                            <div className="h-4 w-16 rounded bg-gray-300 dark:bg-gray-600" />
                                        </div>
                                        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
                                            <div className="h-3 w-10 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                                            <div className="h-4 w-12 rounded bg-gray-300 dark:bg-gray-600 mb-2" />
                                            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
                                        </div>
                                    </div>
                                    <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-5">
                            <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-1" />
                            <div className="h-3 w-64 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5 animate-pulse">
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700" />
                                                <div className="h-4 w-56 rounded bg-gray-200 dark:bg-gray-700" />
                                            </div>
                                            <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700 ml-6 mt-2" />
                                        </div>
                                        <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-3">
                                        <div className="col-span-2 sm:col-span-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
                                            <div className="h-3 w-14 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                                            <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-600" />
                                        </div>
                                        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
                                            <div className="h-3 w-14 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                                            <div className="h-4 w-16 rounded bg-gray-300 dark:bg-gray-600" />
                                        </div>
                                        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
                                            <div className="h-3 w-10 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                                            <div className="h-4 w-12 rounded bg-gray-300 dark:bg-gray-600 mb-2" />
                                            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
                                        </div>
                                    </div>
                                    <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block space-y-6">
                    <div className="rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5 sm:p-6 animate-pulse">
                        <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                                    <div className="h-5 w-10 rounded bg-gray-300 dark:bg-gray-600" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">

                <Section>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <BrainIcon size={20} className="text-bg-fill-accent-default-light dark:text-bg-fill-accent-default-dark" />
                            <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                                Active Quizzes
                            </h2>
                        </div>
                        {activeQuizzes.length > 0 && (
                            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold">
                                {activeQuizzes.length}
                            </span>
                        )}
                    </div>

                    {activeQuizzes.length ? (
                        <div className="space-y-3">
                            {activeQuizzes.map((quiz) => (
                                <QuizCard key={quiz.id} quiz={quiz} isUpcoming onStartQuiz={() => navigate(`practice?quizId=${quiz.id}`)} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark p-8 text-center">
                            <BrainIcon size={32} className="mx-auto mb-3 text-text-secondary-default-light dark:text-text-secondary-default-dark opacity-40" />
                            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">No active quizzes available right now.</p>
                        </div>
                    )}
                </Section>

                <Section>
                    <div className="mb-5">
                        <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">Quiz History</h3>
                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Completed and missed quiz attempts for this course</p>
                    </div>

                    {pagedQuizzes.length ? (
                        <div className="space-y-3">
                            {pagedQuizzes.map((quiz) => (
                                <QuizCard
                                    key={quiz.id}
                                    quiz={quiz}
                                    isUpcoming={false}
                                    onViewResults={() => navigate(`practice?quizId=${quiz.id}&review=graded`)}
                                    onReviewResults={() => navigate(`practice?quizId=${quiz.id}&review=graded`)}
                                    onStartQuiz={() => navigate(`practice?quizId=${quiz.id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark p-8 text-center">
                            <ChartBarIcon size={32} className="mx-auto mb-3 text-text-secondary-default-light dark:text-text-secondary-default-dark opacity-40" />
                            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">No quiz history yet.</p>
                        </div>
                    )}

                    {historyQuizzes.length > PAGE_SIZE && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
                            <p className="hidden sm:block text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                Showing {pagedQuizzes.length} of {historyQuizzes.length} quizzes
                            </p>

                            <PaginationButtons totalPages={totalPages} currentPage={validCurrentPage} setCurrentPage={setCurrentPage} />
                        </div>
                    )}
                </Section>
            </div>

            <div className="hidden lg:block space-y-6">
                <BaseComponent title="Quiz Stats" contentClassName="px-5 py-5 sm:px-6 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-lg">
                        <span className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Completed</span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">{completedCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-lg">
                        <span className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Active</span>
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{activeQuizzes.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-lg">
                        <span className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Missed</span>
                        <span className="text-lg font-bold text-red-600 dark:text-red-400">{missedCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-lg">
                        <span className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Average Score</span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{Math.round(averageScore)}%</span>
                    </div>
                </BaseComponent>
            </div>
        </div>
    );
}
