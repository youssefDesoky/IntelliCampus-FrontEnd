import Button from "../../../../ui/Button";

export default function FahimAIFooter({sendQuestionIcon, voiceInputIcon}) {
    const inputStyles = "w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500";
    const sendBtnStyles = "w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200";
    const micBtnStyles = "w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 transition-colors duration-200";
    const attachBtnStyles = "p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors duration-150 cursor-none";

    return (
        <div aria-label="Fahim AI Footer" className="fahim-ai-footer-container mt-6">
            <div className="fahim-ai-footer border-t border-gray-200 py-4 mt-6">
                <div className="max-w-4xl mx-auto flex items-center gap-3 px-4">
                    <button aria-label="Attachments" title="Attachments" className={attachBtnStyles}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21.44 11.05l-8.49 8.49a5 5 0 01-7.07-7.07l7.78-7.78a3.5 3.5 0 014.95 4.95L9.88 18.38a1.5 1.5 0 01-2.12-2.12l7.07-7.07" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    <div className="flex-1">
                        <div>
                            <input
                                type="text"
                                placeholder="Type your question here..."
                                className={inputStyles}
                            />
                        </div>

                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            role="Send Question"
                            styles={sendBtnStyles}
                            primaryIcon={sendQuestionIcon}
                        />
                        <Button
                            role="Voice Input"
                            styles={micBtnStyles}
                            primaryIcon={voiceInputIcon}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-3 px-4 flex items-center justify-between text-xs text-gray-500">
                <p>Fahim can make mistakes. Verify important information.</p>
                <p>Press Enter to send</p>
            </div>
        </div>
    );
}