import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";

import Button from "../../../components/ui/Button";
import TextArea from "../../../components/ui/TextArea";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import Dialog from "../../../components/ui/Dialog";
import MaterialPreview from "../../../components/ui/MaterialPreview";
import DateTimeInput from "../../../components/form/DateTimeInput";
import NumberInput from "../../../components/form/NumberInput";
import { PlusIcon, TrashIcon, EyeIcon, DownloadIcon, XIcon, FilePenIcon, CalendarDaysIcon, ChartBarIcon, UsersIcon, ClockIcon, ClipboardCheckIcon } from "../../../components/ui/icons";

import {
    fetchInstructorAssignmentsByCourse,
    createInstructorAssignment,
    deleteInstructorAssignment,
    updateInstructorAssignment,
    fetchAssignmentSubmissions,
    gradeAssignmentSubmission,
} from "../../../feature/instructor/components/assignments/instructorAssignmentsApi";
import { CourseAssignmentsSkeleton } from "../../../feature/instructor/SkeletonLoader";
import { useError } from '../../../contexts/ErrorContext.jsx';

function formatDueDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Invalid date";
    
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(date);
}

function formatDueTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    
    return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export default function InstructorCourseAssignments() {
    const { courseId } = useOutletContext();
    
    const { showError } = useError();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [instructions, setInstructions] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [totalPoints, setTotalPoints] = useState(100);
    const [editingAssignmentId, setEditingAssignmentId] = useState(null);
    
    const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
    const [selectedAssignmentTotalPoints, setSelectedAssignmentTotalPoints] = useState(null);
    const [gradeModal, setGradeModal] = useState(null);
    const [gradeScore, setGradeScore] = useState("");
    const [deletingAssignment, setDeletingAssignment] = useState(null);
    const [gradeFeedback, setGradeFeedback] = useState("");
    const [isGrading, setIsGrading] = useState(false);
    
    const {
        data: assignments = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["instructorCourseAssignments", courseId],
        queryFn: async () => {
            const data = await fetchInstructorAssignmentsByCourse(courseId);
            return (Array.isArray(data) ? data : []).map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                fullInstructions: item.fullInstructions,
                dueDate: item.dueDate,
                totalPoints: item.totalPoints,
                attachments: item.attachments || [],
            }));
        },
        staleTime: 2 * 60 * 1000,
        enabled: !!courseId,
    });

    useEffect(() => {
        if (error) showError(error.message || "Failed to load assignments.");
    }, [error, showError]);
    
    const sortedAssignments = useMemo(() => [...assignments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)), [assignments]);
    
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setTitle("");
        setDescription("");
        setInstructions("");
        setDueDate("");
        setTotalPoints(100);
        setEditingAssignmentId(null);
    };
    
    const handleCreateAssignment = async () => {
        if (!courseId) {
            showError("No course context found.");
            return;
        }
        
        if (!title.trim() || !dueDate) {
            showError("Title and due date are required.");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const payload = {
                title: title.trim(),
                description: description.trim() || null,
                fullInstructions: instructions.trim() || null,
                dueDate: new Date(dueDate).toISOString(),
                totalPoints: Number(totalPoints),
                courseId: Number(courseId),
                attachments: [],
            };
            
            const created = await createInstructorAssignment(payload);
            
            queryClient.setQueryData(["instructorCourseAssignments", courseId], (prev = []) => [
                {
                    id: created.id,
                    title: created.title,
                    description: created.description,
                    fullInstructions: created.fullInstructions,
                    dueDate: created.dueDate,
                    totalPoints: created.totalPoints,
                    attachments: created.attachments || [],
                },
                ...prev,
            ]);
            
            handleCloseForm();
        } catch (err) {
            showError(err.message || "Failed to create assignment.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleUpdateAssignment = async () => {
        if (!editingAssignmentId) return;
        
        if (!courseId) {
            showError("No course context found.");
            return;
        }
        
        if (!title.trim() || !dueDate) {
            showError("Title and due date are required.");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const payload = {
                title: title.trim(),
                description: description.trim() || null,
                fullInstructions: instructions.trim() || null,
                dueDate: new Date(dueDate).toISOString(),
                totalPoints: Number(totalPoints),
                courseId: Number(courseId),
                attachments: [],
            };
            
            const updated = await updateInstructorAssignment(editingAssignmentId, payload);
            
            queryClient.setQueryData(["instructorCourseAssignments", courseId], (prev = []) => prev.map((a) => (String(a.id) === String(editingAssignmentId) ? {
                id: updated.id,
                title: updated.title,
                description: updated.description,
                fullInstructions: updated.fullInstructions,
                dueDate: updated.dueDate,
                totalPoints: updated.totalPoints,
                attachments: updated.attachments || [],
            } : a)));
            
            handleCloseForm();
        } catch (err) {
            showError(err.message || "Failed to update assignment.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const openSubmissions = async (assignment) => {
        setSelectedSubmission(null);
        setSubmissions([]);
        setIsSubmissionsOpen(true);
        setIsLoadingSubmissions(true);
        setSelectedAssignmentId(assignment.id);
        setSelectedAssignmentTotalPoints(assignment.totalPoints || 100);
        try {
            const data = await fetchAssignmentSubmissions(assignment.id);
            const normalized = (Array.isArray(data) ? data : []).map((s) => ({
                id: s.id,
                status: s.status,
                submittedAt: s.submittedAt || s.SubmittedAt || s.SubmittedDate || null,
                note: s.note || s.Note || null,
                files: s.files || s.Files || [],
                student: s.studentName || s.studentFullName || (typeof s.student === 'object' ? (s.student.fullName || s.student.name) : s.student) || null,
                score: s.score ?? s.Score ?? null,
                feedback: s.feedback ?? s.Feedback ?? null,
            }));
            setSubmissions(normalized);
        } catch (err) {
            showError(err.message || "Failed to load submissions.");
        } finally {
            setIsLoadingSubmissions(false);
        }
    };
    
    const closeSubmissions = () => {
        setIsSubmissionsOpen(false);
        setSubmissions([]);
        setSelectedSubmission(null);
    };
    
    const getPrimarySubmissionFile = (submission) => submission?.files?.[0] || null;
    
    const openFilePreview = (file, submission) => {
        if (!file) return;
        setPreviewFile(file);
        setSelectedSubmission(submission || null);
    };
    
    const closeFilePreview = () => {
        setPreviewFile(null);
        setSelectedSubmission(null);
    };

    const handleGradeSubmit = async () => {
        if (!gradeModal || !selectedAssignmentId) return;

        const score = Number(gradeScore);
        if (!gradeScore || isNaN(score) || score < 0) {
            showError("Please enter a valid score.");
            return;
        }

        setIsGrading(true);
        try {
            await gradeAssignmentSubmission(selectedAssignmentId, {
                submissionId: gradeModal.id,
                score,
                feedback: gradeFeedback.trim() || null,
            });
            queryClient.invalidateQueries({ queryKey: ["instructorCourseAssignments", courseId] });
            setGradeModal(null);
            setGradeScore("");
            setGradeFeedback("");
        } catch (err) {
            showError(err.message || "Failed to grade submission.");
        } finally {
            setIsGrading(false);
        }
    };
    
    const handleDeleteClick = (assignment) => {
        setDeletingAssignment(assignment);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingAssignment) return;
        try {
            await deleteInstructorAssignment(deletingAssignment.id);
            queryClient.setQueryData(["instructorCourseAssignments", courseId], (prev = []) => prev.filter((a) => String(a.id) !== String(deletingAssignment.id)));
        } catch (err) {
            showError(err.message || "Failed to delete assignment.");
        } finally {
            setDeletingAssignment(null);
        }
    };
    
    if (isLoading) {
        return <CourseAssignmentsSkeleton />;
    }
    
    return (
        <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                Assignments
            </h2>
            <Button
                type="button"
                variant="primary"
                onClick={() => setIsFormOpen(true)}
                startIcon={<PlusIcon size={18} />}
            >
                <span className="hidden sm:inline">Create Assignment</span>
            </Button>
        </div>

        <BaseFormComponent
        isOpen={isFormOpen}
        title={editingAssignmentId ? "Edit Assignment" : "Create Assignment"}
        description="Add assignment details and publish it to your students."
        onClose={handleCloseForm}
        onSubmit={editingAssignmentId ? handleUpdateAssignment : handleCreateAssignment}
        submitText={editingAssignmentId ? "Update Assignment" : "Create Assignment"}
        submitDisabled={isSubmitting || !title.trim() || !dueDate || !courseId}
        submitLoading={isSubmitting}
        maxWidth="max-w-2xl"
        contentClassName="space-y-4"
        >
        <div className="space-y-2">
        <label className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Title</label>
        <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Assignment title"
        className="w-full rounded-2xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 text-sm text-text-primary-light outline-none transition-colors focus:border-border-accent-default-light focus:ring-4 focus:ring-accent-500/10 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-text-primary-dark"
        />
        </div>
        
        <div className="space-y-2">
        <label className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Description</label>
        <TextArea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Short summary..."
        className="w-full rounded-2xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 text-sm text-text-primary-light outline-none transition-colors focus:border-border-accent-default-light focus:ring-4 focus:ring-accent-500/10 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-text-primary-dark"
        />
        </div>
        
        <div className="space-y-2">
        <label className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Full Instructions</label>
        <TextArea
        value={instructions}
        onChange={(event) => setInstructions(event.target.value)}
        placeholder="Detailed instructions for students..."
        className="w-full rounded-2xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 text-sm text-text-primary-light outline-none transition-colors focus:border-border-accent-default-light focus:ring-4 focus:ring-accent-500/10 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-text-primary-dark"
        />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateTimeInput label="Due Date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        
        <NumberInput label="Total Points" min={1} value={totalPoints} onChange={(event) => setTotalPoints(event.target.value)} />
        </div>
        </BaseFormComponent>
        
        {sortedAssignments.length === 0 ? (
            <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] text-center">
                <h3 className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">No assignments yet</h3>
                <p className="mt-2 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    Create your first assignment for this course.
                </p>
            </div>
        ) : (
            <div className="space-y-4">
            {sortedAssignments.map((assignment) => (
                <div
                key={assignment.id}
                className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl p-5 hover:shadow-lg transition-shadow duration-200"
                >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 justify-between">
                        <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                        {assignment.title}
                        </h3>
                        {assignment.totalPoints && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark whitespace-nowrap shrink-0">
                            <ChartBarIcon size={14} />
                            {assignment.totalPoints} pts
                        </span>
                        )}
                    </div>
                    {assignment.description && (
                        <p className="mt-1 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark line-clamp-2">
                        {assignment.description}
                        </p>
                    )}
                    </div>
                </div>

                <div className="flex flex-col gap-1 mt-3 text-sm">
                    <div className="flex items-center gap-1.5 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    <CalendarDaysIcon size={16} />
                    <span>{formatDueDate(assignment.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    <ClockIcon size={16} />
                    <span>{formatDueTime(assignment.dueDate)}</span>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-2 mt-4 pt-4 border-t border-border-tertiary-default-light dark:border-border-tertiary-default-dark">
                    <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    startIcon={<EyeIcon size={16} />}
                    className="flex-1 sm:flex-none sm:w-auto justify-center"
                    onClick={() => openSubmissions(assignment)}
                    >
                    <span className="hidden sm:inline">Submissions</span>
                    </Button>
                    <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    startIcon={<FilePenIcon size={16} />}
                    className="flex-1 sm:flex-none sm:w-auto justify-center"
                    onClick={() => {
                        setEditingAssignmentId(assignment.id);
                        setTitle(assignment.title || "");
                        setDescription(assignment.description || "");
                        setInstructions(assignment.fullInstructions || "");
                        try {
                            const dt = new Date(assignment.dueDate);
                            const tzOffset = dt.getTimezoneOffset() * 60000;
                            const localISO = new Date(dt - tzOffset).toISOString().slice(0, 16);
                            setDueDate(localISO);
                        } catch {
                            setDueDate(assignment.dueDate || "");
                        }
                        setTotalPoints(assignment.totalPoints || 100);
                        setIsFormOpen(true);
                    }}
                    >
                    <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    startIcon={<TrashIcon size={16} />}
                    className="flex-1 sm:flex-none sm:w-auto justify-center text-text-danger-default-light dark:text-text-danger-default-dark"
                    onClick={() => handleDeleteClick(assignment)}
                    >
                    <span className="hidden sm:inline">Delete</span>
                    </Button>
                </div>
                </div>
            ))}
            </div>
        )}
        
        {isSubmissionsOpen && (
            <ModelOverlay onClose={closeSubmissions} maxWidth="max-w-3xl">
            <div className="w-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
            <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <EyeIcon size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
            <h2 className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
            Submissions
            </h2>
            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
            View student submissions for this assignment
            </p>
            </div>
            </div>
            <button
            onClick={closeSubmissions}
            className="p-2 rounded-lg hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark transition-colors text-text-secondary-default-light dark:text-text-secondary-default-dark"
            >
            <XIcon size={18} />
            </button>
            </div>
            
            <div className="p-5 space-y-4">
            {isLoadingSubmissions ? (
                <p>Loading submissions...</p>
            ) : submissions.length === 0 ? (
                <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">No submissions yet.</p>
            ) : (
                <div className="space-y-3">
                {submissions.map((s) => {
                    const primaryFile = getPrimarySubmissionFile(s);
                    const hasFile = Boolean(primaryFile);
                    
                    return (
                        <div key={s.id} className="p-3 border rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-border-primary-default-light dark:border-border-primary-default-dark">
                        <div className="flex items-center justify-between gap-3">
                        <div>
                        <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{typeof s.student === 'string' ? s.student : `Student ${s.id}`}</p>
                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{s.submittedAt}</p>
                        </div>
                        <div className="flex items-center gap-2">
                        <button
                        type="button"
                        className={`p-2 rounded-lg transition-colors ${hasFile ? "hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark text-text-primary-default-light dark:text-text-primary-default-dark" : "opacity-40 text-text-secondary-default-light dark:text-text-secondary-default-dark"}`}
                        onClick={() => openFilePreview(primaryFile, s)}
                        disabled={!hasFile}
                        title={hasFile ? "Preview submission" : "No file available"}
                        >
                        <EyeIcon size={16} />
                        </button>
                        {hasFile ? (
                            <a
                            href={primaryFile.url}
                            download={primaryFile.name}
                            className="p-2 rounded-lg hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark text-text-primary-default-light dark:text-text-primary-default-dark transition-colors"
                            title="Download submission"
                            >
                            <DownloadIcon size={16} />
                            </a>
                        ) : (
                            <span
                            className="p-2 rounded-lg opacity-40 text-text-secondary-default-light dark:text-text-secondary-default-dark"
                            title="No file available"
                            >
                            <DownloadIcon size={16} />
                            </span>
                        )}
                        <button
                        type="button"
                        className="p-2 rounded-lg hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark text-green-600 dark:text-green-400 transition-colors"
                        onClick={() => {
                            setGradeScore(s.score ?? "");
                            setGradeFeedback(s.feedback ?? "");
                            setGradeModal(s);
                        }}
                        title="Grade submission"
                        >
                        <ClipboardCheckIcon size={16} />
                        </button>
                        </div>
                        </div>
                        
                        {s.note && (
                            <p className="mt-2 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">{s.note}</p>
                        )}
                        </div>
                    );
                })}
                </div>
            )}
            </div>
            </div>
            </ModelOverlay>
        )}
        
        {gradeModal && (
            <ModelOverlay onClose={() => { setGradeModal(null); setGradeScore(""); setGradeFeedback(""); }} maxWidth="max-w-lg">
            <div className="w-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
            <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <ClipboardCheckIcon size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
            <h2 className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
            Grade Submission
            </h2>
            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
            {typeof gradeModal.student === 'string' ? gradeModal.student : `Student ${gradeModal.id}`}
            </p>
            </div>
            </div>
            <button
            onClick={() => { setGradeModal(null); setGradeScore(""); setGradeFeedback(""); }}
            className="p-2 rounded-lg hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark transition-colors text-text-secondary-default-light dark:text-text-secondary-default-dark"
            >
            <XIcon size={18} />
            </button>
            </div>

            <div className="p-5 space-y-4">
            <NumberInput
            label={`Score (out of ${selectedAssignmentTotalPoints})`}
            value={gradeScore}
            onChange={(e) => setGradeScore(e.target.value)}
            placeholder={`0 - ${selectedAssignmentTotalPoints}`}
            min={0}
            max={selectedAssignmentTotalPoints}
            required
            />

            <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
            Feedback
            </label>
            <TextArea
            value={gradeFeedback}
            onChange={(e) => setGradeFeedback(e.target.value)}
            placeholder="Optional feedback for the student..."
            className="w-full rounded-2xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 text-sm text-text-primary-light outline-none transition-colors focus:border-border-accent-default-light focus:ring-4 focus:ring-accent-500/10 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-text-primary-dark"
            />
            </div>

            <div className="flex gap-3 pt-2">
            <Button
            variant="secondary"
            className="flex-1"
            onClick={() => { setGradeModal(null); setGradeScore(""); setGradeFeedback(""); }}
            >
            Cancel
            </Button>
            <Button
            variant="primary"
            className="flex-1"
            onClick={handleGradeSubmit}
            loading={isGrading}
            disabled={!gradeScore}
            >
            Submit Grade
            </Button>
            </div>
            </div>
            </div>
            </ModelOverlay>
        )}

        {previewFile && (
            <ModelOverlay onClose={closeFilePreview} maxWidth="max-w-4xl">
            <div className="w-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
            <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <EyeIcon size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
            <h2 className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
            Preview
            </h2>
            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
            {previewFile.name}
            </p>
            <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
            {typeof selectedSubmission?.student === 'string' ? selectedSubmission.student : "Selected submission"}
            </p>
            </div>
            </div>
            <div className="flex items-center gap-2">
            <button
            type="button"
            className="p-2 rounded-lg hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark text-green-600 dark:text-green-400 transition-colors"
            onClick={() => {
                const sub = selectedSubmission;
                if (sub) {
                    setGradeScore(sub.score ?? "");
                    setGradeFeedback(sub.feedback ?? "");
                    setGradeModal(sub);
                    closeFilePreview();
                }
            }}
            title="Grade submission"
            >
            <ClipboardCheckIcon size={20} />
            </button>
            <a href={previewFile.url} download={previewFile.name} className="p-2 hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark rounded-lg">
            <DownloadIcon size={20} />
            </a>
            <button onClick={closeFilePreview} className="p-2 hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark rounded-lg">
            <XIcon size={20} />
            </button>
            </div>
            </div>
            <div className="p-5 space-y-5">
            <MaterialPreview title={previewFile.name} viewUrl={previewFile.url} downloadUrl={previewFile.url} />
            
            {selectedSubmission?.note && (
                <div className="border-t border-border-primary-default-light dark:border-border-primary-default-dark pt-4">
                <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-2">Student's Note:</h3>
                <p className="text-sm text-text-primary-default-light dark:text-text-primary-default-dark whitespace-pre-wrap bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark p-3 rounded-lg">
                {selectedSubmission.note}
                </p>
                </div>
            )}
            </div>
            </div>
            </ModelOverlay>
        )}
            <Dialog
                isOpen={deletingAssignment !== null}
                variant="warning"
                title="Delete Assignment"
                onClose={() => setDeletingAssignment(null)}
                onConfirm={handleDeleteConfirm}
                confirmText="Delete"
                cancelText="Cancel"
            >
                Are you sure you want to delete &ldquo;{deletingAssignment?.title}&rdquo;? This action cannot be undone.
            </Dialog>
        </div>
    );
}
