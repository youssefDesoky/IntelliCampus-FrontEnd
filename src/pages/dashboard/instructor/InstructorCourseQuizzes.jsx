import { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import Button from "../../../components/ui/Button";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";

import { createQuiz } from "../../../feature/instructor/components/quiz/instructorQuizApi";

export default function InstructorCourseQuizzes() {
    const outlet = useOutletContext() || {};
    const params = useParams();
    const courseId = outlet.courseId || outlet.course?.id || params.courseId;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [maxGrade, setMaxGrade] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [durationMinutes, setDurationMinutes] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!title.trim()) { alert("Enter quiz title."); return; }
        if (!maxGrade.trim()) { alert("Enter max points for the quiz."); return; }
        if (!dueDate) { alert("Select a due date."); return; }
        if (!durationMinutes.trim()) { alert("Enter quiz duration in minutes."); return; }
        
        setIsCreating(true);
        try {
            const payload = { 
                courseId: Number(courseId), 
                title: title.trim(), 
                description: description.trim() || null,
                maxGrade: Number(maxGrade),
                dueDate: new Date(dueDate).toISOString(),
                durationMinutes: Number(durationMinutes)
            };
            await createQuiz(payload);
            setIsCreateOpen(false);
            setTitle(""); 
            setDescription("");
            setMaxGrade("");
            setDueDate("");
            setDurationMinutes("");
            alert("Quiz created successfully.");
        } catch (err) {
            alert(err.message || "Failed to create quiz.");
        } finally { setIsCreating(false); }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">Quizzes</h1>
                <Button type="button" variant="primary" onClick={() => setIsCreateOpen(true)}>Create Quiz</Button>
            </div>

            <div className="p-4 rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    Create quizzes for your course. Student quiz progress and submissions can be viewed after students take the quizzes.
                </p>
            </div>

            <BaseFormComponent isOpen={isCreateOpen} title="Create Quiz" description="Create a new quiz for this course." onClose={() => { setIsCreateOpen(false); setTitle(""); setDescription(""); setMaxGrade(""); setDueDate(""); setDurationMinutes(""); }} onSubmit={handleCreate} submitText="Create" submitDisabled={isCreating} submitLoading={isCreating}>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz title" className="mt-1 block w-full rounded-lg border px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Quiz description (optional)" rows={3} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">Max Points</label>
                            <input type="number" value={maxGrade} onChange={(e) => setMaxGrade(e.target.value)} placeholder="e.g., 100" min="1" className="mt-1 block w-full rounded-lg border px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">Duration (minutes)</label>
                            <input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} placeholder="e.g., 60" min="1" className="mt-1 block w-full rounded-lg border px-3 py-2" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">Due Date</label>
                        <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                    </div>
                </div>
            </BaseFormComponent>
        </div>
    );
}
