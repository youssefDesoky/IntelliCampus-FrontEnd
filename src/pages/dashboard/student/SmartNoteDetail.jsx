import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FahimIcon } from '../../../components/ui/icons';
import SmartNoteEditor from "../../../feature/student/smartNotes/SmartNoteEditor.jsx";
import { fetchNote, enhanceNote } from "../../../feature/student/smartNotes/notesApi";

export default function SmartNoteDetail() {
    const { t } = useTranslation('student');
    const { noteId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const courseCtx = useOutletContext();
    const courseFolders = location.state?.courseFolders || courseCtx?.course?.folders || [];
    const courseId = location.state?.courseId ?? courseCtx?.courseId ?? null;
    const studentId = location.state?.studentId ?? null;

    const [note, setNote] = useState(location.state?.note || null);
    const [loading, setLoading] = useState(!note);
    const [aiSummary, setAiSummary] = useState(location.state?.note?.aiSummary || null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(false);
    const [aiErrorMessage, setAiErrorMessage] = useState("");

    useEffect(() => {
        if (note) return;
        setLoading(true);
        fetchNote(noteId)
            .then((data) => {
                setNote(data);
                setAiSummary(data.aiSummary || null);
            })
            .catch(() => navigate(-1))
            .finally(() => setLoading(false));
    }, [noteId, note, navigate]);

    useEffect(() => {
        if (note) setAiSummary(note.aiSummary || null);
    }, [note?.aiSummary]);

    const handleBack = () => navigate(-1);

    const handleEnhance = async () => {
        setAiLoading(true);
        setAiError(false);
        try {
            const result = await enhanceNote(note.id);
            const summary = result.generatedText || result.aiSummary;
            setAiSummary(summary);
        } catch (err) {
            setAiError(true);
            setAiErrorMessage(err?.detail || err?.message || '');
        } finally {
            setAiLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <svg className="w-6 h-6 animate-spin text-indigo-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    if (!note) return null;

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border-primary-default-light dark:border-border-primary-default-dark shrink-0">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 text-sm font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-text-primary-active-light dark:hover:text-text-primary-active-dark transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 12L6 8l4-4" />
                    </svg>
                    {t('smartNotes.backToNotes')}
                </button>
            </div>

            <div className="flex-[0_0_50%] min-h-0">
                <SmartNoteEditor
                    note={note}
                    onClose={handleBack}
                    courseFolders={courseFolders}
                    courseId={courseId}
                    studentId={studentId}
                    onSaveNote={(saved) => {
                        setNote(saved);
                        if (saved?.aiSummary) setAiSummary(saved.aiSummary);
                    }}
                    isModal={false}
                />
            </div>

            {aiSummary && (
                <div className="flex-[0_0_50%] min-h-0 border-t border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/60 dark:bg-indigo-950/30 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border-primary-default-light/40 dark:[&::-webkit-scrollbar-thumb]:bg-border-primary-default-dark/40">
                    <div className="px-4 sm:px-8 py-3">
                        <div className="flex items-center gap-1.5 mb-2">
                            <div className="w-5 h-5 rounded bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                                <FahimIcon className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-[10px] font-bold tracking-wide uppercase text-indigo-600 dark:text-indigo-400">
                                {t('smartNotes.aiSummary')}
                            </span>
                        </div>
                        <div className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark leading-relaxed">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ children, ...props }) => <h1 className="text-sm font-bold my-1" {...props}>{children}</h1>,
                                    h2: ({ children, ...props }) => <h2 className="text-sm font-bold my-1" {...props}>{children}</h2>,
                                    h3: ({ children, ...props }) => <h3 className="text-sm font-semibold my-1" {...props}>{children}</h3>,
                                    p: ({ children, ...props }) => <p className="my-1" {...props}>{children}</p>,
                                    ul: ({ children, ...props }) => <ul className="list-disc list-inside my-1 space-y-0.5" {...props}>{children}</ul>,
                                    ol: ({ children, ...props }) => <ol className="list-decimal list-inside my-1 space-y-0.5" {...props}>{children}</ol>,
                                    li: ({ children, ...props }) => <li className="my-0.5" {...props}>{children}</li>,
                                    strong: ({ children, ...props }) => <strong className="font-semibold" {...props}>{children}</strong>,
                                    code: ({ children, ...props }) => <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-[11px]" {...props}>{children}</code>,
                                    pre: ({ children, ...props }) => <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded my-1 overflow-x-auto text-[11px]" {...props}>{children}</pre>,
                                }}
                            >{aiSummary}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}

            {aiError && (
                <div className="flex-[0_0_50%] min-h-0 border-t border-red-200 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/30 px-4 sm:px-8 py-2.5">
                    <p className="text-xs text-red-600 dark:text-red-400">{aiErrorMessage || t('smartNotes.aiError')}</p>
                    <button
                        disabled={aiLoading}
                        onClick={handleEnhance}
                        className="mt-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                    >
                        {t('smartNotes.aiRetry')}
                    </button>
                </div>
            )}

            {!aiSummary && !aiError && (
                <div className="flex-[0_0_50%] min-h-0 border-t border-border-primary-default-light dark:border-border-primary-default-dark flex items-center justify-center">
                    <button
                        disabled={aiLoading}
                        onClick={handleEnhance}
                        className="flex items-center gap-1.5 text-xs font-semibold text-white bg-linear-to-r from-indigo-500 to-cyan-500 hover:opacity-90 transition-opacity rounded-lg px-3 py-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {aiLoading ? (
                            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <FahimIcon className="w-3.5 h-3.5" />
                        )}
                        <span>{aiLoading ? t('smartNotes.aiEnhancing') : t('smartNotes.aiEnhance')}</span>
                    </button>
                </div>
            )}
        </div>
    );
}
