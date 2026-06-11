import { useState } from "react";
import Button from "../../../../components/ui/Button";
import { addQuestions } from "./instructorQuizApi";

const QUESTION_TYPES = [
    { value: "TF", label: "True/False" },
    { value: "MCQ", label: "Multiple Choice" },
    { value: "Written", label: "Written Question" },
];

export default function ManageQuizQuestions({ isOpen, onClose, courseId, quiz }) {
    const [questions, setQuestions] = useState([]);
    const [saving, setSaving] = useState(false);

    const [type, setType] = useState("TF");
    const [prompt, setPrompt] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [points, setPoints] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");

    const resetForm = () => {
        setType("TF");
        setPrompt("");
        setOptions(["", ""]);
        setPoints("");
        setCorrectAnswer("");
    };

    const handleAdd = () => {
        if (!prompt.trim()) { alert("Enter a question prompt."); return; }
        if (!points.trim()) { alert("Enter points for this question."); return; }

        if (type === "MCQ") {
            const filledOptions = options.filter(o => o.trim());
            if (filledOptions.length < 2) { alert("Add at least 2 options for MCQ."); return; }
            if (!correctAnswer.trim()) { alert("Select the correct answer."); return; }
        }

        if (type === "TF" && !correctAnswer) {
            alert("Select the correct answer (True/False).");
            return;
        }

        const question = {
            type,
            prompt: prompt.trim(),
            options: type === "MCQ" ? options.filter(o => o.trim()) : null,
            points: Number(points),
            correctAnswer: correctAnswer || null,
        };

        setQuestions(prev => [...prev, question]);
        resetForm();
    };

    const handleSave = async () => {
        if (questions.length === 0) { alert("Add at least one question first."); return; }
        setSaving(true);
        try {
            await addQuestions(courseId, quiz.id, questions);
            setQuestions([]);
            onClose();
            alert("Questions saved successfully.");
        } catch (err) {
            alert(err.message || "Failed to save questions.");
        } finally {
            setSaving(false);
        }
    };

    const removeQuestion = (index) => {
        setQuestions(prev => prev.filter((_, i) => i !== index));
    };

    const updateOption = (index, value) => {
        setOptions(prev => prev.map((o, i) => i === index ? value : o));
    };

    const addOption = () => setOptions(prev => [...prev, ""]);
    const removeOption = (index) => {
        if (options.length <= 2) return;
        setOptions(prev => prev.filter((_, i) => i !== index));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="w-full max-w-2xl rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-border-primary-default-light dark:border-border-primary-default-dark px-6 py-4">
                    <div>
                        <h3 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Manage Questions</h3>
                        <p className="mt-1 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">{quiz?.title}</p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg border p-2 hover:bg-bg-surface-secondary-hover-light dark:hover:bg-bg-surface-secondary-hover-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M18.3 5.71 12 12.01l-6.29-6.3-1.42 1.42 6.3 6.29-6.3 6.29 1.42 1.42 6.29-6.3 6.29 6.3 1.42-1.42-6.3-6.29 6.3-6.29z"/></svg>
                    </button>
                </div>

                <div className="px-6 py-6 space-y-6">
                    {questions.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Questions to add ({questions.length})</h4>
                            {questions.map((q, i) => (
                                <div key={i} className="flex items-start justify-between p-3 rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">{q.type}</span>
                                            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{q.points} pts</span>
                                        </div>
                                        <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark truncate">{q.prompt}</p>
                                    </div>
                                    <button type="button" onClick={() => removeQuestion(i)} className="ml-2 text-red-500 hover:text-red-700 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-4 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl p-4">
                        <h4 className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Add Question</h4>

                        <div>
                            <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark mb-1">Type</label>
                            <select value={type} onChange={e => { setType(e.target.value); setCorrectAnswer(""); }} className="block w-full rounded-lg border px-3 py-2">
                                {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark mb-1">Prompt</label>
                            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} placeholder="Enter the question text..." className="block w-full rounded-lg border px-3 py-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark mb-1">Points</label>
                                <input type="number" value={points} onChange={e => setPoints(e.target.value)} min="1" placeholder="e.g., 10" className="block w-full rounded-lg border px-3 py-2" />
                            </div>
                        </div>

                        {type === "MCQ" && (
                            <div>
                                <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark mb-1">Options</label>
                                <div className="space-y-2">
                                    {options.map((opt, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-text-secondary-default-light dark:text-text-secondary-default-dark w-5">{String.fromCharCode(65 + i)}</span>
                                            <input value={opt} onChange={e => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} className="flex-1 rounded-lg border px-3 py-2" />
                                            {options.length > 2 && (
                                                <button type="button" onClick={() => removeOption(i)} className="text-red-500 hover:text-red-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={addOption} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">+ Add option</button>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark mb-1">
                                Correct Answer {type === "Written" && <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark">(optional — graded manually)</span>}
                            </label>
                            {type === "TF" ? (
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setCorrectAnswer("true")} className={`px-4 py-2 rounded-lg border font-medium ${correctAnswer === "true" ? "border-green-500 bg-green-50 text-green-700" : ""}`}>True</button>
                                    <button type="button" onClick={() => setCorrectAnswer("false")} className={`px-4 py-2 rounded-lg border font-medium ${correctAnswer === "false" ? "border-green-500 bg-green-50 text-green-700" : ""}`}>False</button>
                                </div>
                            ) : type === "MCQ" ? (
                                <select value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} className="block w-full rounded-lg border px-3 py-2">
                                    <option value="">Select correct option...</option>
                                    {options.filter(o => o.trim()).map((opt, i) => (
                                        <option key={i} value={opt}>{String.fromCharCode(65 + i)}. {opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <input value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} placeholder="Model answer (optional)" className="block w-full rounded-lg border px-3 py-2" />
                            )}
                        </div>

                        <Button type="button" variant="secondary" onClick={handleAdd} width="w-full">Add Question</Button>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark px-6 py-4 sm:flex-row sm:justify-end">
                    <Button variant="secondary" type="button" onClick={onClose} width="w-full sm:w-auto">Cancel</Button>
                    <Button variant="primary" type="button" onClick={handleSave} width="w-full sm:w-auto" disabled={saving || questions.length === 0} loading={saving}>
                        Save {questions.length > 0 ? `(${questions.length})` : ""}
                    </Button>
                </div>
            </div>
        </div>
    );
}