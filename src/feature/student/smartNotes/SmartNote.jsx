import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import SelectBox from "../../../components/ui/SelectBox";
import { ClockIcon, CalendarIcon, TrashIcon, FahimIcon, BookIcon, LinkIcon } from "../../../components/ui/icons";
import { updateNoteLinkedLecture, deleteNote, fromBackendLinkedLecture, enhanceNote } from "./notesApi";
import Dialog from "../../../components/ui/Dialog";
import { getLocalizedField } from '../../../utils/getLocalizedField';
import useArabicDigits from '../../../hooks/useArabicDigits';

function renderMarkdownToHtml(md = "") {
    let html = md
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.+?)__/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    html = html.replace(/<li>(.*?)<\/li>/g, (m) => m.replace(/<br>/g, ''));
    return '<p>' + html + '</p>';
}

function openSummaryWindow(summary, title) {
    const content = renderMarkdownToHtml(summary);
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:780px;margin:0 auto;padding:2rem;line-height:1.7;color:#1a1a2e}h1,h2,h3{margin-top:1.5em;color:#111827}code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:0.875em}pre{background:#f8fafc;border:1px solid #e2e8f0;padding:1rem;border-radius:8px;overflow-x:auto}pre code{background:none;padding:0}ul,ol{padding-left:1.5em}blockquote{border-left:4px solid #cbd5e1;margin:0;padding-left:1em;color:#64748b}p{margin:0.5em 0}@media(prefers-color-scheme:dark){body{background:#0f172a;color:#e2e8f0}h1,h2,h3{color:#f1f5f9}code{background:#1e293b}pre{background:#1e293b;border-color:#334155}blockquote{border-color:#475569;color:#94a3b8}}</style></head><body>${content}</body></html>`);
    win.document.close();
}

const defaultWeeklyLectureOptions = [
    {
        id: 1,
        value: "week-2",
        title: "Data Structures",
        shortTitle: "Week 2",
        weekLabel: "Week 2 Lecture",
        course: "CS301",
        materialFolderId: "week-2",
    },
    {
        id: 3,
        value: "week-4",
        title: "Web Development",
        shortTitle: "Week 4",
        weekLabel: "Week 4 Lecture",
        course: "CS310",
        materialFolderId: "week-4",
    },
]

export default function SmartNote({ note, courseFolders = [], courseId = null, studentId = null, onSaveNote, onDeleteNote }) {
    const { t, i18n } = useTranslation('student');
    const { convert: ar, isRTL } = useArabicDigits();

    function formatNoteDate(value) {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value);
        const locale = isRTL ? 'ar-SA' : 'en-US';
        return date.toLocaleString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    const buildLectureOptions = (courseFolders = [], fallbackCourseId = null) => {
        if (courseFolders.length > 0) {
            return courseFolders.map((folder, idx) => {
                const folderValue = folder.materialFolderId ?? folder.id ?? idx + 1
                const folderLabel = getLocalizedField(folder, 'name', i18n.language) || `Week ${idx + 1}`

                return {
                    id: folderValue,
                    value: folderValue,
                    title: folderLabel,
                    shortTitle: folderLabel,
                    weekLabel: `${folderLabel} Lecture`,
                    description: getLocalizedField(folder, 'description', i18n.language) || "",
                    course: folder.courseId ?? fallbackCourseId,
                    materialFolderId: folderValue,
                }
            })
        }

        return defaultWeeklyLectureOptions
    };
    const cardRef = useRef(null);
    const [cardWidth, setCardWidth] = useState(0);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [isLinkLoading, setIsLinkLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [aiSummary, setAiSummary] = useState(note?.aiSummary || null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(false);
    const [aiErrorMessage, setAiErrorMessage] = useState("");
    const navigate = useNavigate();
    const normalizedLinkedLecture = fromBackendLinkedLecture(note.linkedLecture) ?? note.linkedLecture ?? null
    const lectureOptions = buildLectureOptions(courseFolders, courseId);
    const linkedLecture = normalizedLinkedLecture
        ? lectureOptions.find((option) => String(option.materialFolderId) === String(normalizedLinkedLecture.materialFolderId ?? normalizedLinkedLecture.id ?? "")) || normalizedLinkedLecture
        : null;
    const selectedLectureOption = linkedLecture
        ? lectureOptions.find((option) => String(option.materialFolderId) === String(linkedLecture.materialFolderId ?? linkedLecture.id ?? "")) || null
        : null;

    useEffect(() => {
        const updateWidth = () => {
            if (cardRef.current) setCardWidth(cardRef.current.offsetWidth);
        };
        updateWidth();
        const ro = new ResizeObserver(updateWidth);
        if (cardRef.current) ro.observe(cardRef.current);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        setAiSummary(note?.aiSummary || null);
        setAiError(false);
        setAiErrorMessage("");
    }, [note?.id, note?.aiSummary]);

    async function handleLectureSelect(option) {
        const nextLecture = option
            ? {
                id: option.id,
                title: option.title,
                shortTitle: option.shortTitle,
                weekLabel: option.weekLabel,
                description: option.description,
                courseId: courseId || option.course || normalizedLinkedLecture?.courseId || null,
                materialFolderId: option.materialFolderId,
            }
            : null;

        setIsLinkLoading(true);
        try {
            const savedNote = await updateNoteLinkedLecture(note.id, {
                lecture: nextLecture,
                courseFolders,
            });
            onSaveNote?.({
                ...note,
                ...savedNote,
                linkedLecture: savedNote.linkedLecture ?? nextLecture,
            });
        } catch {
            // apiClient already emits errors via ErrorContext
        } finally {
            setIsLinkLoading(false);
            setIsPickerOpen(false);
        }
    }

    return (
        <Fragment>
            <Dialog
                isOpen={showDeleteConfirm}
                variant="warning"
                title={t('smartNotes.delete')}
                confirmText={t('smartNotes.delete')}
                cancelText={t('smartNotes.cancel')}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={() => {
                    setShowDeleteConfirm(false);
                    setIsDeleting(true);
                    deleteNote(note.id).then(() => {
                        onDeleteNote?.(note.id);
                    }).catch(() => {
                        // apiClient already emits errors via ErrorContext
                    }).finally(() => {
                        setIsDeleting(false);
                    });
                }}
            >
                {t('smartNotes.deleteConfirm')}
            </Dialog>

            <div
                ref={cardRef}
                onClick={() => navigate(`/smart-notes/${note.id}`, { state: { note, courseFolders, courseId, studentId } })}
                className="group relative flex min-w-70 flex-col gap-3 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-4 md:p-5 shadow-sm shadow-shadow-light dark:shadow-shadow-dark transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >

            {/* Delete action, tucked into the corner so it never competes with the title */}
            <button
                disabled={isDeleting}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                }}
                className="absolute end-3.5 top-3.5 shrink-0 rounded-lg border border-transparent p-1.5 opacity-0 transition-all duration-150 group-hover:opacity-100 hover:border-red-300 hover:bg-red-50 dark:hover:border-red-800 dark:hover:bg-red-950 disabled:opacity-50"
            >
                <TrashIcon className="w-3.5 h-3.5 text-icon-secondary-default-light dark:text-icon-primary-default-dark" />
            </button>

            <div className="flex flex-col gap-3 flex-1 min-h-0">
                {/* Title + preview */}
                <div className="flex flex-col gap-1.5 min-w-0 pe-7 flex-1">
                    <h3 className="font-semibold text-base leading-snug text-text-primary-active-light dark:text-text-primary-active-dark truncate">
                        {note.title}
                    </h3>
                    <div className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark line-clamp-2 leading-relaxed [&_*]:m-0" dangerouslySetInnerHTML={{ __html: note.content }} />
                </div>

                {aiError && (
                    <div className="flex flex-col gap-1.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/30 p-2.5">
                        <span className="text-xs text-red-600 dark:text-red-400 leading-relaxed">{aiErrorMessage || t('smartNotes.aiError')}</span>
                        <button
                            type="button"
                            disabled={aiLoading}
                            className="self-end text-xs font-semibold px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                            onClick={async (e) => {
                                e.stopPropagation();
                                setAiLoading(true);
                                setAiError(false);
                                try {
                                    const result = await enhanceNote(note.id);
                                    setAiSummary(result.generatedText || result.aiSummary);
                                    setAiError(false);
                                    openSummaryWindow(result.generatedText || result.aiSummary, note.title);
                                } catch (err) {
                                    setAiError(true);
                                    setAiErrorMessage(err?.detail || err?.message || '');
                                } finally {
                                    setAiLoading(false);
                                }
                            }}
                        >
                            {t('smartNotes.aiRetry')}
                        </button>
                    </div>
                )}

                {/* Lecture link */}
                {!isPickerOpen ? (
                    linkedLecture ? (
                        <div className="flex items-center gap-2 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/60 dark:bg-indigo-950/30 p-2.5">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const targetCourseId = courseId || linkedLecture.courseId;
                                    const folderId = linkedLecture.id ?? linkedLecture.materialFolderId;
                                    if (targetCourseId && folderId != null) {
                                        navigate(`/courses/${targetCourseId}/materials?folderId=${folderId}`);
                                    }
                                }}
                                className="flex flex-1 items-center gap-3 text-start min-w-0"
                            >
                                <div className="shrink-0 w-9 h-9 rounded-[10px] bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                                    <BookIcon className="w-4 h-4 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-[9.5px] font-bold tracking-wide uppercase mb-0.5 bg-linear-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                                        {t('smartNotes.linkedLectureLabel')}
                                    </p>
                                    <p className="text-[12.5px] font-medium text-text-primary-active-light dark:text-text-primary-active-dark truncate leading-snug">
                                        {linkedLecture.title}
                                    </p>
                                    <p className="flex items-center gap-1 text-[11px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark mt-0.5">
                                        <CalendarIcon className="w-2.5 h-2.5 shrink-0" />
                                        {linkedLecture.weekLabel}
                                    </p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsPickerOpen(true);
                                }}
                                className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 bg-bg-surface-primary-default-light dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                            >
                                {t('smartNotes.change')}
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsPickerOpen(true);
                            }}
                            className="flex items-center gap-2.5 w-full text-start rounded-xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors p-2.5 opacity-75 hover:opacity-100"
                        >
                            <div className="shrink-0 w-8 h-8 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark flex items-center justify-center">
                                <LinkIcon className="w-4 h-4 text-icon-secondary-default-light dark:text-icon-secondary-default-dark" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-semibold text-text-tertiary-default-light dark:text-text-tertiary-default-dark uppercase tracking-wide mb-0.5">
                                    {t('smartNotes.noLecture')}
                                </p>
                                <p className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                                    {t('smartNotes.clickToSelect')}
                                </p>
                            </div>
                        </button>
                    )
                ) : (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark p-3 space-y-3"
                    >
                        <SelectBox
                            label={t('smartNotes.chooseLecture')}
                            showLabel={true}
                            compact={false}
                            disabled={isLinkLoading}
                            className="w-full"
                            options={lectureOptions.map((lecture) => ({
                                value: lecture.materialFolderId,
                                label: `${lecture.weekLabel} - ${lecture.title}`,
                            }))}
                            selectedOption={selectedLectureOption
                                ? {
                                    value: selectedLectureOption.materialFolderId,
                                    label: `${selectedLectureOption.weekLabel} - ${selectedLectureOption.title}`,
                                }
                                : null}
                            onChange={(option) => {
                                const selected = lectureOptions.find((lecture) => String(lecture.materialFolderId) === String(option.value));
                                handleLectureSelect(selected ?? null);
                            }}
                        />

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsPickerOpen(false);
                                }}
                                className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                            >
                                {t('smartNotes.done')}
                            </button>
                            {linkedLecture && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLectureSelect(null);
                                    }}
                                    className="flex-1 px-3 py-1.5 text-xs font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-red-500 transition-colors rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark"
                                >
                                    {t('smartNotes.clear')}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark pt-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-xs font-medium text-text-tertiary-default-light dark:text-text-tertiary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-full px-2.5 py-0.5">
                        <ClockIcon className="w-3 h-3" />
                        {formatNoteDate(note.modified)}
                    </span>
                </div>
                <button
                    disabled={aiLoading}
                    onClick={async (e) => {
                        e.stopPropagation();
                        if (aiSummary) {
                            openSummaryWindow(aiSummary, note.title);
                            return;
                        }
                        setAiLoading(true);
                        setAiError(false);
                        try {
                            const result = await enhanceNote(note.id);
                            setAiSummary(result.generatedText || result.aiSummary);
                            openSummaryWindow(result.generatedText || result.aiSummary, note.title);
                        } catch (err) {
                            setAiError(true);
                            setAiErrorMessage(err?.detail || err?.message || '');
                        } finally {
                            setAiLoading(false);
                        }
                    }}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-white bg-linear-to-r from-indigo-500 to-cyan-500 hover:opacity-90 transition-opacity rounded-lg px-3 py-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {aiLoading ? (
                        <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <FahimIcon className="w-3.5 h-3.5" />
                    )}
                    {cardWidth >= 320 && (
                        <span>{aiLoading ? t('smartNotes.aiEnhancing') : aiSummary ? t('smartNotes.enhanced') : t('smartNotes.aiEnhance')}</span>
                    )}
                </button>
            </div>
            </div>
        </Fragment>
    );
}