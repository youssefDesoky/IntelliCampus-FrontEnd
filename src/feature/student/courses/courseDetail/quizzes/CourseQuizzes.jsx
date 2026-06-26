import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";

import Section from "../../../../../components/ui/Section";
import BaseComponent from "../../../../../components/ui/BaseComponent";
import Button from "../../../../../components/ui/Button";
import PaginationButtons from "../../../../../components/ui/PaginationButtons";
import { CalendarDaysIcon, ClockIcon, PlayIcon, EyeIcon, ChartBarIcon, StarIcon } from "../../../../../components/ui/icons";
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
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
    }

    if (status === "Missed") {
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
    }

    return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300";
}

function QuizCard({ quiz, isUpcoming, onStartQuiz, onViewResults, onReviewResults }) {
    const scoreLabel = quiz.maxScore ? `${quiz.score}/${quiz.maxScore}` : "TBD";

    return (
        <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl p-5 hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-row items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-1">
                        {quiz.title}
                    </h3>
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark line-clamp-2">
                        {isUpcoming
                            ? "Open the quiz window and complete it before the deadline."
                            : quiz.status === "Missed"
                                ? "This quiz was not completed before the deadline."
                                : "Review your score and results for this quiz."}
                    </p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${getQuizStatusStyle(quiz.status)}`}>
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

                    <div className="flex flex-row justify-between">
                        <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
                            {scoreLabel}
                        </p>
                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1">
                            {quiz.maxScore ? `${toPercent(quiz.score, quiz.maxScore)}%` : "TBD"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {isUpcoming ? (
                    <Button className="w-full sm:flex-1" startIcon={<PlayIcon size={16} />} onClick={() => onStartQuiz && onStartQuiz(quiz)}>
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
            <div className="text-center py-10">
                <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading quizzes...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Section>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                            Active Quizzes
                        </h2>
                    </div>

                    {activeQuizzes.length ? (
                        <div className="space-y-3">
                            {activeQuizzes.map((quiz) => (
                                <QuizCard key={quiz.id} quiz={quiz} isUpcoming onStartQuiz={() => navigate(`practice?quizId=${quiz.id}`)} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark p-6 text-center">
                            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">No quizzes available right now.</p>
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
                        <div className="rounded-xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark p-6 text-center">
                            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">No quiz history yet.</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
                        <p className="hidden sm:block text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            showing {pagedQuizzes.length} of {historyQuizzes.length} quizzes
                        </p>

                        <PaginationButtons totalPages={totalPages} currentPage={validCurrentPage} setCurrentPage={setCurrentPage} />
                    </div>
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
