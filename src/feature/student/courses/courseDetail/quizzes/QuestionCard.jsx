import { ClipboardCheckIcon } from "../../../../../components/ui/icons";

export function TypeBadge({ type }) {
    const styles = {
        TF: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
        MCQ: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
        "Written Question": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    };

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[type]}`}>
            {type}
        </span>
    );
}

function QuestionControls({ question, questionType, answer, onAnswerChange, writtenWordCount, showCorrectAnswer, correctAnswer, feedback }) {
    const type = questionType || question.type;
    const disabled = !onAnswerChange;

    const getOptionStyle = (optionValue, isCorrectOption) => {
        if (!showCorrectAnswer) {
            return answer === optionValue
                ? "rounded-xl border border-green-500 bg-green-50 px-4 py-4 text-left text-green-700"
                : "rounded-xl border px-4 py-4 text-left";
        }
        if (isCorrectOption) {
            return "rounded-xl border border-green-500 bg-green-50 px-4 py-4 text-left text-green-700";
        }
        if (answer === optionValue && !isCorrectOption) {
            return "rounded-xl border border-red-500 bg-red-50 px-4 py-4 text-left text-red-700";
        }
        return "rounded-xl border px-4 py-4 text-left opacity-60";
    };

    if (type === "TF") {
        const correctIsTrue = correctAnswer === true || correctAnswer === "true";
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button type="button" disabled={disabled}
                    onClick={() => onAnswerChange(true)}
                    className={getOptionStyle(true, showCorrectAnswer && correctIsTrue)}
                >
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-bg-surface-secondary-default-light text-sm font-bold">T</span>
                        <div><p className="font-semibold">True</p></div>
                    </div>
                </button>
                <button type="button" disabled={disabled}
                    onClick={() => onAnswerChange(false)}
                    className={getOptionStyle(false, showCorrectAnswer && !correctIsTrue)}
                >
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-bg-surface-secondary-default-light text-sm font-bold">F</span>
                        <div><p className="font-semibold">False</p></div>
                    </div>
                </button>
            </div>
        );
    }

    if (type === "MCQ") {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options?.map((option, optionIndex) => (
                    <button key={option} type="button" disabled={disabled}
                        onClick={() => onAnswerChange(option)}
                        className={getOptionStyle(option, showCorrectAnswer && option === correctAnswer)}
                    >
                        <div className="flex items-center gap-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-bg-surface-secondary-default-light text-sm font-bold">
                                {String.fromCharCode(65 + optionIndex)}
                            </span>
                            <span className="font-medium">{option}</span>
                        </div>
                    </button>
                ))}
            </div>
        );
    }

    if (type === "Written Question") {
        return (
            <>
                <textarea
                    value={answer || ""}
                    onChange={(e) => onAnswerChange && onAnswerChange(e.target.value)}
                    placeholder={question.placeholder}
                    rows={8}
                    readOnly={disabled}
                    className={`w-full rounded-2xl border px-4 py-3 ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
                />
                <div className="mt-3 flex items-center justify-between text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    <span>Write at least {question.minWords} words for a strong response.</span>
                    <span>{writtenWordCount} words</span>
                </div>
            </>
        );
    }

    return null;
}

export default function QuestionCard({ question, questionType, answer, onAnswerChange, writtenWordCount, children, scoreState, showCorrectAnswer, correctAnswer, feedback }) {
    return (
        <div className="rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <TypeBadge type={question.type} />
                        <div className="inline-flex items-center gap-2 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            <ClipboardCheckIcon size={14} />
                            {question.points} points
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark leading-7 max-w-3xl">
                        {question.prompt}
                    </h3>
                </div>

                {scoreState}
            </div>

            {children ?? (
                <QuestionControls
                    question={question}
                    questionType={questionType}
                    answer={answer}
                    onAnswerChange={onAnswerChange}
                    writtenWordCount={writtenWordCount}
                    showCorrectAnswer={showCorrectAnswer}
                    correctAnswer={correctAnswer}
                    feedback={feedback}
                />
            )}
        </div>
    );
}
