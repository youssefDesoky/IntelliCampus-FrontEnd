import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import QuickUpload from "../../../../../components/ui/QuickUpload";
import Section from "../../../../../components/ui/Section";
import BaseComponent from "../../../../../components/ui/BaseComponent";
import AssignmentCard from "./AssignmentCard";
import PaginationButtons from "../../../../../components/ui/PaginationButtons";
import ViewGrade from "./ViewGrade";
import ViewSubmission from "./ViewSubmission";
import ViewInstructions from "./ViewInstructions";
import ModelOverlay from "../../../../../components/ui/ModelOverlay";
import { fetchAssignmentsByCourse, submitAssignment, fetchAssignmentStats } from "../../assignmentsApi";


const PAGE_SIZE = 2;

export default function CourseAssignments() {
    const { course } = useOutletContext();
    const [submitModal, setSubmitModal] = useState(null);
    const [showAllUpcoming, setShowAllUpcoming] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [gradeModal, setGradeModal] = useState(null);
    const [submissionModal, setSubmissionModal] = useState(null);
    const [instructionsModal, setInstructionsModal] = useState(null);
    const queryClient = useQueryClient();

    const normalizeAssignments = (assignmentsData) => {
        const raw = Array.isArray(assignmentsData) ? assignmentsData : (assignmentsData?.data ?? []);
        return raw.map((a) => {
            const due = a.dueDate ? new Date(a.dueDate) : null;
            const now = new Date();
            const daysLeft = due ? Math.max(0, Math.ceil((due - now) / (1000 * 60 * 60 * 24))) : null;

            const isSubmitted = Boolean(
                a.isSubmitted || a.submitted || a.submittedDate || a.submissionDate ||
                (a.status && String(a.status).toLowerCase().includes("submit")) ||
                a.submission || a.Submission || a.SubmissionDto
            );

            let status = "pending";
            if (a.status) {
                const s = String(a.status).toLowerCase();
                if (s.includes("graded")) status = "graded";
                else if (s.includes("submit")) status = "submitted";
                else status = s;
            } else {
                if (isSubmitted && (typeof a.score === "number" || a.score)) status = "graded";
                else if (isSubmitted) status = "submitted";
            }

            return {
                ...a,
                isSubmitted,
                status,
                daysLeft,
                submissions: (a.submission && Array.isArray(a.submission.files) ? a.submission.files :
                              a.Submission && Array.isArray(a.Submission.files) ? a.Submission.files :
                              a.Submission && Array.isArray(a.Submission.Files) ? a.Submission.Files :
                              a.submission && Array.isArray(a.submission.Files) ? a.submission.Files :
                              a.submissions) || [],
                submittedDate: a.submission?.submittedAt || a.Submission?.submittedAt || a.submission?.SubmittedAt || a.Submission?.SubmittedAt || a.submittedDate || a.SubmittedDate || null,
                submissionNote: a.submission?.note || a.Submission?.note || a.submission?.Note || a.Submission?.Note || a.submissionNote || null,
                feedback: a.grade?.feedback || a.Grade?.feedback || a.grade?.Feedback || a.Grade?.Feedback || a.feedback || null,
                gradedBy: a.grade?.gradedBy || a.Grade?.gradedBy || a.grade?.GradedBy || a.Grade?.GradedBy || a.gradedBy || null,
                gradedDate: a.grade?.gradedAt || a.Grade?.gradedAt || a.grade?.GradedAt || a.Grade?.GradedAt || a.gradedDate || null,
                score: (a.grade?.score ?? a.Grade?.score ?? a.grade?.Score ?? a.Grade?.Score ?? a.score) ?? undefined,
            };
        });
    };

    const { data: assignments = [], isLoading } = useQuery({
        queryKey: ["courseAssignments", course?.id],
        queryFn: () => fetchAssignmentsByCourse(course.id).then(normalizeAssignments),
        staleTime: 2 * 60 * 1000,
        enabled: !!course?.id,
    });

    const { data: stats = { pending: 0, submitted: 0, graded: 0, averageGrade: null } } = useQuery({
        queryKey: ["assignmentStats", course?.id],
        queryFn: () => fetchAssignmentStats(course.id),
        staleTime: 2 * 60 * 1000,
        enabled: !!course?.id,
        select: (data) => ({
            pending: data.pending || 0,
            submitted: data.submitted || 0,
            graded: data.graded || 0,
            averageGrade: data.averageGrade ?? null,
        }),
    });

    const upcomingAssignments = assignments.filter((a) => !a.isSubmitted && new Date(a.dueDate) > new Date()) || [];

        const pastAssignments = assignments.filter((a) => a.isSubmitted || (a.dueDate && new Date(a.dueDate) <= new Date())) || [];

    if (isLoading) {
        return (
            <div className="text-center py-10">
                <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading assignments...</p>
            </div>
        );
    }

    const totalPages = Math.max(1, Math.ceil(pastAssignments.length / PAGE_SIZE));    
    const validCurrentPage = Math.min(currentPage, totalPages);
    const start = (validCurrentPage - 1) * PAGE_SIZE;
    const pagedAssignments = pastAssignments.slice(start, start + PAGE_SIZE);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {/* Upcoming Assignments */}
                <Section>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                            Upcoming Assignments
                        </h2>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                            {upcomingAssignments.length} Pending
                        </span>
                    </div>

                    <div className="space-y-3">
                        {upcomingAssignments.length > 0 ? (
                            <>
                                {(showAllUpcoming ? upcomingAssignments : upcomingAssignments.slice(0, 1)).map((assignment) => (
                                    <AssignmentCard
                                        key={assignment.id}
                                        id={assignment.id}
                                        title={assignment.title}
                                        description={assignment.description}
                                        dueDate={assignment.dueDate}
                                        daysLeft={assignment.daysLeft}
                                        status={assignment.status}
                                        totalPoints={assignment.totalPoints}
                                        onSubmitAssignment={(data) => setSubmitModal(data)}
                                        onViewInstructions={(data) => setInstructionsModal(data)}
                                        attachments={assignment.attachments}
                                    />
                                ))}
                                {upcomingAssignments.length > 1 && (
                                    <button onClick={() => setShowAllUpcoming(!showAllUpcoming)} className="w-full py-2 text-center text-sm font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark rounded-lg transition-colors">
                                        {showAllUpcoming ? "Show Less" : `View More Upcoming Assignments (${upcomingAssignments.length - 1} more)`}
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="rounded-xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark p-6 text-center">
                                <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">No upcoming assignments right now.</p>
                            </div>
                        )}
                    </div>
                </Section>

                {/* Past Submissions */}
                <Section>
                    <div className="mb-5">
                        <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">Past Submissions</h3>
                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">All submitted and graded assignments for this course</p>
                    </div>

                    {pagedAssignments.length ? (
                        <div className="space-y-3">
                            {pagedAssignments.map((assignment) => (
                                <AssignmentCard
                                    key={assignment.id}
                                    id={assignment.id}
                                    title={assignment.title}
                                    description={assignment.description}
                                    dueDate={assignment.dueDate}
                                    daysLeft={assignment.daysLeft}
                                    status={assignment.status}
                                    score={assignment.score}
                                    totalPoints={assignment.totalPoints}
                                    attachments={assignment.attachments}
                                    onSubmitAssignment={(data) => setSubmitModal(data)}
                                    onViewSubmission={(data) => {
                                        const payload = { ...data, submissions: assignment.submissions, submittedDate: assignment.submittedDate, submissionNote: assignment.submissionNote };
                                        setSubmissionModal(payload);
                                    }}
                                    onViewGrade={(data) => {
                                        const payload = { ...data, feedback: assignment.feedback, gradedBy: assignment.gradedBy, gradedDate: assignment.gradedDate, totalPoints: assignment.totalPoints };
                                        setGradeModal(payload);
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark p-6 text-center">
                            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">No past submissions yet.</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
                        <p className="hidden sm:block text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            showing {pagedAssignments.length} of {pastAssignments.length} assignments
                        </p>

                        <PaginationButtons totalPages={totalPages} currentPage={validCurrentPage} setCurrentPage={setCurrentPage} />
                    </div>
                </Section>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
                <BaseComponent
                    title="Assignment Stats"
                    description="Overview of your assignment activity for this course"
                    contentClassName="space-y-4"
                >
                    <div className="flex items-center justify-between p-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-lg">
                        <span className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            Pending
                        </span>
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{stats.pending}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-lg">
                        <span className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            Submitted
                        </span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.submitted}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-lg">
                        <span className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            Average Grade
                        </span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {stats.averageGrade !== null ? Math.round(stats.averageGrade) : 0}%
                        </span>
                    </div>
                </BaseComponent>
            </div>

            {submitModal && (
                <ModelOverlay onClose={() => setSubmitModal(null)} maxWidth="max-w-lg">
                    <QuickUpload
                        assignment={submitModal}
                        onClose={() => setSubmitModal(null)}
                        onSubmit={async ({ files, note }) => {
                            const formData = new FormData();
                            formData.append("Note", note);
                            files.forEach((fileEntry) => {
                                formData.append("Files", fileEntry.file);
                            });

                            await submitAssignment(submitModal.id, formData);
                            queryClient.invalidateQueries({ queryKey: ["courseAssignments", course?.id] });
                            queryClient.invalidateQueries({ queryKey: ["assignmentStats", course?.id] });
                            setSubmitModal(null);
                        }}
                    />
                </ModelOverlay>
            )}

            {gradeModal && (
                <ViewGrade
                    assignment={gradeModal}
                    onClose={() => setGradeModal(null)}
                />
            )}

            {submissionModal && (
                <ViewSubmission
                    assignment={submissionModal}
                    onClose={() => setSubmissionModal(null)}
                />
            )}

            {instructionsModal && (
                <ViewInstructions
                    assignment={instructionsModal}
                    onClose={() => setInstructionsModal(null)}
                />
            )}
        </div>
    );
}