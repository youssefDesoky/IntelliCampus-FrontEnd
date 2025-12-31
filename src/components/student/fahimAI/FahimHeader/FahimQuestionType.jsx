export default function FahimQuestionType({questionTypeStyle, questionIcon, children}) {
    return (
        <button type="button" className={questionTypeStyle}>
            <span className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center text-gray-600">
                    {questionIcon}
                </span>
                <span className="whitespace-nowrap">{children}</span>
            </span>
        </button>
    );
}