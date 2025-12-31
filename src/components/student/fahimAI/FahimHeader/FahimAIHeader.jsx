import FahimQuestionType from "./FahimQuestionType";
import QuestionTypes from "./QuestionTypes";

export default function FahimAIHeader() {
    const pillStyle = "inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-sm rounded-lg px-3 py-1.5 text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors duration-150";

    return (
        <>
            <div aria-label="Question Type" className="fahim-ai-input-area p-4">
                <div className="flex flex-wrap items-center gap-3">
                    {QuestionTypes.map((type, index) => (
                        <FahimQuestionType
                            key={index}
                            questionTypeStyle={pillStyle}
                            questionIcon={type.questionIcon}
                        >
                            {type.questionType}
                        </FahimQuestionType>
                    ))}
                </div>
            </div>
        </>
    )
}