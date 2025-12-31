import { useState } from 'react';
import Section from '../../../../ui/Section';

const Message = ({ senderIcon, messageText, isFahim = true }) => {
    return (
        <div className={`flex items-start w-full mb-4 ${isFahim ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className={`${isFahim ? 'mr-4' : 'ml-4'} flex-shrink-0`}>
                {isFahim ? (
                    <div className="bg-blue-50 rounded-full w-10 h-10 flex items-center justify-center text-blue-600">
                        {senderIcon}
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        {senderIcon}
                    </div>
                )}
            </div>

            <div className={`${isFahim ? 'bg-white border border-gray-200 text-gray-800' : 'bg-blue-500 text-white'} rounded-lg p-4 max-w-xl`}>
                {typeof messageText === 'string' ? (
                    <p className="whitespace-pre-line">{messageText}</p>
                ) : (
                    messageText
                )}
            </div>
        </div>
    );
};

export default function FahimAIBody({ fahimIcon, user }) {
    const fahimMessages = [
        "How can I assist you today?",
        "Feel free to ask me anything!",
        "What can I help you learn today?",
        "I'm ready to answer your questions!",
        "Let's dive into your studies together!",
        "How can I support your academic journey?",
        "What topic shall we explore?",
        "Ready for some study tips?",
        "Tell me how I can assist you!",
        "I can summarize lectures, create quizzes, and explain difficult concepts.",
        "Want study plans or exam strategies?",
        "I can generate practice problems and step-by-step solutions.",
    ];

    const [randomIndex] = useState(() => Math.floor(Math.random() * fahimMessages.length));

    const defaultMessage = (
        <>
            <h3 className="flex items-center gap-2"><span>👋</span> Hi {user.Name.split(' ')[0]}! I'm Fahim, your AI academic assistant. I'm here to help you with:</h3>
            <ul className="list-disc list-inside mt-2 mb-3 text-sm">
                <li>Answering course-related questions</li>
                <li>Creating study materials and flashcards</li>
                <li>Explaining complex concepts</li>
                <li>Course recommendations and registration guidance</li>
            </ul>
            <h3 className="font-medium">{fahimMessages[randomIndex]}</h3>
        </>
    );

    return (
        <Section>
            <div>
                
            </div>

            <div>

            </div>
        </Section>
    );
}