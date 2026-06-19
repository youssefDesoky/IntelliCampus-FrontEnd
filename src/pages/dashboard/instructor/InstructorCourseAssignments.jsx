import { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import Button from "../../../components/ui/Button";
import TextArea from "../../../components/ui/TextArea";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import MaterialPreview from "../../../components/ui/MaterialPreview";
import DateTimeInput from "../../../components/form/DateTimeInput";
import NumberInput from "../../../components/form/NumberInput";
import { PlusIcon, TrashIcon, EyeIcon, DownloadIcon, XIcon } from "../../../components/ui/icons";

import {
    fetchInstructorAssignmentsByCourse,
    createInstructorAssignment,
    deleteInstructorAssignment,
    updateInstructorAssignment,
    fetchAssignmentSubmissions,
} from "../../../feature/instructor/components/assignments/instructorAssignmentsApi";
import { useError } from '../../../contexts/ErrorContext.jsx';

function formatDueDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Invalid date";
    
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export default function InstructorCourseAssignments() {
    const { courseId } = useOutletContext();
    
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showError } = useError();
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
    
    const loadPageData = useCallback(async () => {
        if (!courseId) return;
        setIsLoading(true);
        
        try {
            const data = await fetchInstructorAssignmentsByCourse(courseId);
            const mapped = (Array.isArray(data) ? data : []).map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                fullInstructions: item.fullInstructions,
                dueDate: item.dueDate,
                totalPoints: item.totalPoints,
                attachments: item.attachments || [],
            }));
            setAssignments(mapped);
        } catch (err) {
            showError(err.message || "Failed to load assignments.");
            setAssignments([]);
        } finally {
            setIsLoading(false);
        }
    }, [courseId]);
    
    useEffect(() => {
        loadPageData();
    }, [loadPageData]);
    
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
            
            setAssignments((prev) => [
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
            
            setAssignments((prev) => prev.map((a) => (String(a.id) === String(editingAssignmentId) ? {
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
        try {
            const data = await fetchAssignmentSubmissions(assignment.id);
            const normalized = (Array.isArray(data) ? data : []).map((s) => ({
                id: s.id,
                status: s.status,
                submittedAt: s.submittedAt || s.SubmittedAt || s.SubmittedDate || null,
                note: s.note || s.Note || null,
                files: s.files || s.Files || [],
                student: s.studentName || s.studentFullName || (typeof s.student === 'object' ? (s.student.fullName || s.student.name) : s.student) || null,
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
    
    const handleDeleteAssignment = async (assignmentId) => {
        const confirmed = window.confirm("Delete this assignment?");
        if (!confirmed) return;
        
        try {
            await deleteInstructorAssignment(assignmentId);
            setAssignments((prev) => prev.filter((a) => String(a.id) !== String(assignmentId)));
        } catch (err) {
            showError(err.message || "Failed to delete assignment.");
        }
    };
    
    if (isLoading) {
        return <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading assignments...</p>;
    }
    
    return (
        <div className="space-y-4">
        <Button
        type="button"
        variant="primary"
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-5 right-5 z-50 group"
        >
        <PlusIcon size={24} />
        <span className="max-w-0 -ml-2 group-hover:ml-0 overflow-hidden group-hover:max-w-40 transition-all! duration-300! whitespace-nowrap">
        Add New Assignment
        </span>
        </Button>
        
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
            <div className="rounded-2xl border border-dashed border-border-primary-default-light bg-bg-surface-primary-default-light p-6 text-center dark:border-border-primary-default-dark dark:bg-bg-surface-primary-default-dark">
            <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">No assignments yet</h3>
            <p className="mt-2 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
            Create your first assignment for this course.
            </p>
            </div>
        ) : (
            <div className="space-y-3">
            {sortedAssignments.map((assignment) => (
                <div
                key={assignment.id}
                className="rounded-2xl border border-border-primary-default-light bg-bg-fill-secondary-default-light p-4 dark:border-border-primary-default-dark dark:bg-bg-fill-secondary-default-dark"
                >
                <div className="flex items-start justify-between gap-3">
                <div>
                <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{assignment.title}</h3>
                <p className="mt-1 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                Due: {formatDueDate(assignment.dueDate)}
                </p>
                <p className="mt-1 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                Total Points: {assignment.totalPoints}
                </p>
                </div>
                
                <div className="flex items-center">
                <Button
                type="button"
                variant="text"
                className="mr-2"
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
                Edit
                </Button>
                
                <Button
                type="button"
                variant="text"
                className="mr-2"
                onClick={() => openSubmissions(assignment)}
                >
                View Submissions
                </Button>
                
                <Button
                type="button"
                variant="text"
                className="text-text-danger-default-light dark:text-text-danger-default-dark"
                startIcon={<TrashIcon size={16} />}
                onClick={() => handleDeleteAssignment(assignment.id)}
                >
                Delete
                </Button>
                </div>
                </div>
                
                {assignment.description ? (
                    <p className="mt-3 text-sm text-text-primary-default-light dark:text-text-primary-default-dark whitespace-pre-line">
                    {assignment.description}
                    </p>
                ) : null}
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
        </div>
    );
}
