import { useState } from "react";
import Button from "../../../../components/ui/Button";
import TextArea from "../../../../components/ui/TextArea";
import NumberInput from "../../../../components/form/NumberInput";
import ModelOverlay from "../../../../components/ui/ModelOverlay";
import { PlusIcon, TrashIcon, XIcon, EyeIcon, PenSquareIcon } from "../../../../components/ui/icons";
import { addQuestions } from "./instructorQuizApi";
import { useError } from '../../../../contexts/ErrorContext.jsx';

const QUESTION_TYPES = [
    { value: "TF", label: "True/False", desc: "True or false statement" },
    { value: "MCQ", label: "Multiple Choice", desc: "Select from options" },
    { value: "Written", label: "Written", desc: "Free-text response" },
];

const TYPE_COLORS = {
    TF: { bg: "bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark", text: "text-text-blue-default-light dark:text-text-blue-default-dark", border: "border-border-blue-default-light dark:border-border-blue-default-dark" },
    MCQ: { bg: "bg-bg-surface-purple-default-light dark:bg-bg-surface-purple-default-dark", text: "text-text-purple-default-light dark:text-text-purple-default-dark", border: "border-border-purple-default-light dark:border-border-purple-default-dark" },
    Written: { bg: "bg-bg-surface-green-default-light dark:bg-bg-surface-green-default-dark", text: "text-text-green-default-light dark:text-text-green-default-dark", border: "border-border-green-default-light dark:border-border-green-default-dark" },
};

export default function ManageQuizQuestions({ isOpen, onClose, courseId, quiz }) {
    const [newQuestions, setNewQuestions] = useState([]);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [type, setType] = useState("TF");
    const [prompt, setPrompt] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [points, setPoints] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const { showError } = useError();

    const resetForm = () => {
        setType("TF");
        setPrompt("");
        setOptions(["", ""]);
        setPoints("");
        setCorrectAnswer("");
    };

    const handleAdd = () => {
        if (!prompt.trim()) { showError("Enter a question prompt."); return; }
        if (!points.trim()) { showError("Enter points for this question."); return; }

        if (type === "MCQ") {
            const filledOptions = options.filter(o => o.trim());
            if (filledOptions.length < 2) { showError("Add at least 2 options for MCQ."); return; }
            if (!correctAnswer.trim()) { showError("Select the correct answer."); return; }
        }

        if (type === "TF" && !correctAnswer) {
            showError("Select the correct answer (True/False).");
            return;
        }

        const newPoints = Number(points);
        const currentTotal = totalPoints;
        if (currentTotal + newPoints > quiz.maxScore) {
            showError(`Question points must equal the quiz max grade of ${quiz.maxScore}. Current total: ${currentTotal}, new total would be: ${currentTotal + newPoints}.`);
            return;
        }

        const question = {
            type,
            prompt: prompt.trim(),
            options: type === "MCQ" ? options.filter(o => o.trim()) : null,
            points: newPoints,
            correctAnswer: correctAnswer || null,
        };

        setNewQuestions(prev => [...prev, question]);
        resetForm();
    };

    const handleSave = async () => {
        if (newQuestions.length === 0) { showError("Add at least one question first."); return; }
        setSaving(true);
        try {
            await addQuestions(courseId, quiz.id, newQuestions);
            setNewQuestions([]);
            onClose();
        } catch (err) {
            showError(err.message || "Failed to save questions.");
        } finally {
            setSaving(false);
        }
    };

    const removeQuestion = (index) => {
        setNewQuestions(prev => prev.filter((_, i) => i !== index));
    };

    const handleEditQuestion = (index) => {
        const q = newQuestions[index];
        setType(q.type);
        setPrompt(q.prompt);
        setPoints(String(q.points));
        setCorrectAnswer(q.correctAnswer || "");
        if (q.type === "MCQ" && q.options) {
            setOptions([...q.options]);
        } else {
            setOptions(["", ""]);
        }
        setNewQuestions(prev => prev.filter((_, i) => i !== index));
        setShowPreview(false);
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

    const inputClass = "w-full rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark px-4 py-3 text-sm text-text-primary-default-light dark:text-text-primary-default-dark outline-none transition-colors focus:border-border-accent-default-light focus:ring-4 focus:ring-accent-500/10 dark:focus:border-border-accent-default-dark";

    const totalPoints = newQuestions.reduce((sum, q) => sum + q.points, 0);

    return (
        <ModelOverlay onClose={onClose}>
            <div className="relative z-50 w-full max-w-2xl rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-[0_32px_80px_-12px_rgba(0,0,0,0.28)] animate-fade-in max-h-[90vh] flex flex-col">
                <div className="shrink-0 flex items-center justify-between gap-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark px-6 py-4">
                    <div className="min-w-0 truncate">
                        <h3 className="text-xl font-semibold truncate text-text-primary-default-light dark:text-text-primary-default-dark">Manage Questions</h3>
                        <p className="mt-1 text-sm truncate text-text-secondary-default-light dark:text-text-secondary-default-dark">{quiz?.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {newQuestions.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setShowPreview(true)}
                                className="relative rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark p-2 text-icon-primary-default-light dark:text-icon-primary-default-dark transition-colors hover:bg-bg-surface-secondary-hover-light dark:hover:bg-bg-surface-secondary-hover-dark"
                                title="View added questions"
                            >
                                <EyeIcon size={20} />
                                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark">
                                    {newQuestions.length}
                                </span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark p-2 text-icon-secondary-default-light dark:text-icon-secondary-default-dark transition-colors hover:bg-bg-surface-secondary-hover-light dark:hover:bg-bg-surface-secondary-hover-dark"
                        >
                            <XIcon size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-6">

                    <div className="space-y-5 p-5 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                        <div className="flex items-center gap-2">
                            <PlusIcon size={18} className="text-text-accent-default-light dark:text-text-accent-default-dark" />
                            <h4 className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Add Question</h4>
                        </div>

                        {newQuestions.length > 0 && (
                            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-bg-surface-accent-default-light/10 dark:bg-bg-surface-accent-default-dark/10 border border-border-accent-default-light/20 dark:border-border-accent-default-dark/20">
                                <span className="text-sm font-medium text-text-accent-default-light dark:text-text-accent-default-dark">
                                    {newQuestions.length} question{newQuestions.length > 1 ? "s" : ""} added
                                </span>
                                <span className="text-text-accent-default-light/30 dark:text-text-accent-default-dark/30">|</span>
                                <span className="text-sm font-semibold text-text-accent-default-light dark:text-text-accent-default-dark">
                                    {totalPoints} total pts
                                </span>
                            </div>
                        )}

                        <div>
                            <div className="flex gap-2">
                                {QUESTION_TYPES.map(t => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() => { setType(t.value); setCorrectAnswer(""); }}
                                        className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                                            type === t.value
                                                ? "border-border-accent-default-light dark:border-border-accent-default-dark bg-bg-surface-accent-default-light/10 dark:bg-bg-surface-accent-default-dark/10 text-text-accent-default-light dark:text-text-accent-default-dark"
                                                : "border-border-primary-default-light dark:border-border-primary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark hover:border-border-primary-hover-light dark:hover:border-border-primary-hover-dark hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark"
                                        }`}
                                    >
                                        <div className="font-semibold">{t.label}</div>
                                        <div className="text-xs opacity-70 mt-0.5 hidden sm:block">{t.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark mb-1.5">Question Prompt</label>
                            <div className="relative">
                                <TextArea
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                    placeholder="Enter the question text..."
                                    className={`${inputClass} min-h-[80px]`}
                                />
                                <span className="absolute bottom-3 right-3 text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                    {prompt.length}/500
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark mb-1.5">Points</label>
                            <NumberInput
                                value={points}
                                onChange={e => setPoints(e.target.value)}
                                min="1"
                                placeholder="e.g., 10"
                                className="w-full"
                            />
                        </div>

                        {type === "MCQ" && (
                            <div>
                                <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark mb-1.5">Options</label>
                                <div className="space-y-2">
                                    {options.map((opt, i) => {
                                        const label = String.fromCharCode(65 + i);
                                        return (
                                            <div key={i} className={`flex items-center gap-2 p-2 rounded-xl border transition-colors ${correctAnswer === label ? "border-border-success-default-light dark:border-border-success-default-dark bg-bg-surface-green-default-light dark:bg-bg-surface-green-default-dark" : "border-transparent"}`}>
                                                <button
                                                    type="button"
                                                    onClick={() => setCorrectAnswer(correctAnswer === label ? "" : label)}
                                                    className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                        correctAnswer === label
                                                            ? "border-border-success-default-light dark:border-border-success-default-dark"
                                                            : "border-border-primary-default-light dark:border-border-primary-default-dark"
                                                    }`}
                                                    title="Mark as correct answer"
                                                >
                                                    {correctAnswer === label && (
                                                        <span className="w-2.5 h-2.5 rounded-full bg-bg-fill-success-default-light dark:bg-bg-fill-success-default-dark" />
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setCorrectAnswer(correctAnswer === label ? "" : label)}
                                                    className={`text-sm font-bold w-6 text-center shrink-0 cursor-pointer ${correctAnswer === label ? "text-text-green-default-light dark:text-text-green-default-dark" : "text-text-secondary-default-light dark:text-text-secondary-default-dark"}`}
                                                >
                                                    {label}
                                                </button>
                                                <input
                                                    value={opt}
                                                    onChange={e => updateOption(i, e.target.value)}
                                                    placeholder={`Option ${i + 1}`}
                                                    className={`${inputClass} flex-1`}
                                                />
                                                {options.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeOption(i)}
                                                        className="shrink-0 p-2 rounded-lg text-icon-danger-default-light dark:text-icon-danger-default-dark hover:bg-bg-surface-danger-default-light dark:hover:bg-bg-surface-danger-default-dark transition-colors"
                                                    >
                                                        <TrashIcon size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                    <button
                                        type="button"
                                        onClick={addOption}
                                        className="flex items-center gap-1.5 text-sm font-medium text-text-accent-default-light dark:text-text-accent-default-dark hover:text-text-accent-hover-light dark:hover:text-text-accent-hover-dark transition-colors"
                                    >
                                        <PlusIcon size={14} />
                                        Add option
                                    </button>
                                </div>
                            </div>
                        )}

                        {type !== "MCQ" && (
                            <div>
                                <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark mb-1.5">
                                    Correct Answer
                                    {type === "Written" && <span className="ml-1 text-text-secondary-default-light dark:text-text-secondary-default-dark font-normal">(optional — graded manually)</span>}
                                </label>
                                {type === "TF" ? (
                                    <div className="flex gap-3">
                                        {["true", "false"].map(val => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setCorrectAnswer(val)}
                                                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                                                    correctAnswer === val
                                                        ? "border-border-success-default-light dark:border-border-success-default-dark bg-bg-surface-green-default-light dark:bg-bg-surface-green-default-dark text-text-green-default-light dark:text-text-green-default-dark"
                                                        : "border-border-primary-default-light dark:border-border-primary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark hover:border-border-primary-hover-light dark:hover:border-border-primary-hover-dark"
                                                }`}
                                            >
                                                {val === "true" ? "True" : "False"}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <input
                                        value={correctAnswer}
                                        onChange={e => setCorrectAnswer(e.target.value)}
                                        placeholder="Model answer (optional)"
                                        className={inputClass}
                                    />
                                )}
                            </div>
                        )}

                        <Button type="button" variant="primary" onClick={handleAdd} width="w-full">
                            <PlusIcon size={18} />
                            Add Question
                        </Button>
                    </div>
                </div>

                <div className="shrink-0 flex flex-col gap-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    {newQuestions.length > 0 ? (
                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark text-center sm:text-left">
                            {newQuestions.length} question{newQuestions.length > 1 ? "s" : ""} &middot; {totalPoints} total pts
                        </p>
                    ) : (
                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark text-center sm:text-left">
                            No questions added yet
                        </p>
                    )}
                    <div className="flex gap-3">
                        <Button variant="secondary" type="button" onClick={onClose} width="flex-1 sm:w-auto">Cancel</Button>
                        <Button variant="primary" type="button" onClick={handleSave} width="flex-1 sm:w-auto" disabled={saving || newQuestions.length === 0} loading={saving}>
                            Save {newQuestions.length > 0 ? `(${newQuestions.length})` : ""}
                        </Button>
                    </div>
                </div>
            </div>

            {showPreview && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative w-full max-w-lg max-h-[70vh] overflow-y-auto no-scrollbar rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-xl animate-fade-in p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                                Added Questions ({newQuestions.length})
                            </h4>
                            <button
                                type="button"
                                onClick={() => setShowPreview(false)}
                                className="rounded-lg p-1.5 text-icon-secondary-default-light dark:text-icon-secondary-default-dark hover:bg-bg-surface-secondary-hover-light dark:hover:bg-bg-surface-secondary-hover-dark transition-colors"
                            >
                                <XIcon size={18} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {newQuestions.map((q, i) => {
                                const colors = TYPE_COLORS[q.type] || TYPE_COLORS.TF;
                                return (
                                    <div key={i} className="flex items-start justify-between gap-3 p-4 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>{q.type}</span>
                                                <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{q.points} pts</span>
                                            </div>
                                            <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{q.prompt}</p>
                                            {q.options && q.options.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {q.options.map((opt, oi) => {
                                                        const label = String.fromCharCode(65 + oi);
                                                        return (
                                                            <span key={oi} className={`text-xs px-2 py-0.5 rounded-md border ${q.correctAnswer && q.type === "MCQ" ? (label === q.correctAnswer ? "border-border-success-default-light dark:border-border-success-default-dark bg-bg-surface-green-default-light dark:bg-bg-surface-green-default-dark text-text-green-default-light dark:text-text-green-default-dark" : "border-border-primary-default-light dark:border-border-primary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark") : "border-border-primary-default-light dark:border-border-primary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark"}`}>
                                                                {label}. {opt}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            {q.type === "TF" && q.correctAnswer && (
                                                <span className="text-xs px-2 py-0.5 rounded-md border border-border-success-default-light dark:border-border-success-default-dark bg-bg-surface-green-default-light dark:bg-bg-surface-green-default-dark text-text-green-default-light dark:text-text-green-default-dark">
                                                    Answer: {q.correctAnswer === "true" ? "True" : "False"}
                                                </span>
                                            )}
                                            {q.type === "Written" && q.correctAnswer && (
                                                <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                                    Model answer: {q.correctAnswer}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleEditQuestion(i)}
                                                className="shrink-0 p-1.5 rounded-lg text-icon-primary-default-light dark:text-icon-primary-default-dark hover:bg-bg-surface-secondary-hover-light dark:hover:bg-bg-surface-secondary-hover-dark transition-colors"
                                                title="Edit question"
                                            >
                                                <PenSquareIcon size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { removeQuestion(i); if (newQuestions.length === 1) setShowPreview(false); }}
                                                className="shrink-0 p-1.5 rounded-lg text-icon-danger-default-light dark:text-icon-danger-default-dark hover:bg-bg-surface-danger-default-light dark:hover:bg-bg-surface-danger-default-dark transition-colors"
                                                title="Remove question"
                                            >
                                                <TrashIcon size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 pt-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark text-center">
                            {newQuestions.length} question{newQuestions.length > 1 ? "s" : ""} &middot; {totalPoints} total pts
                        </div>
                    </div>
                </div>
            )}
        </ModelOverlay>
    );
}
