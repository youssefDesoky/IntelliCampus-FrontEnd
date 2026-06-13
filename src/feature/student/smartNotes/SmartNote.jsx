import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SmartNoteEditor from "./SmartNoteEditor.jsx";
import SelectBox from "../../../components/ui/SelectBox";
import { ClockIcon, CalendarIcon, TrashIcon, FahimIcon, BookIcon, LinkIcon } from "../../../components/ui/icons";

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

function buildLectureOptions(courseFolders = []) {
    if (courseFolders.length > 0) {
        return courseFolders.map((folder, idx) => {
            const folderValue = folder.materialFolderId || folder.id || String(idx + 1)
            const folderLabel = folder.name || `Week ${idx + 1}`

            return {
                id: idx + 1,
                value: String(folderValue),
                title: folderLabel,
                shortTitle: folderLabel,
                weekLabel: folderLabel,
                description: folder.description || "",
                course: folder.courseId || null,
                materialFolderId: folder.materialFolderId || String(folderValue),
            }
        })
    }

    return defaultWeeklyLectureOptions
}

function formatDisplayDate(date = new Date()) {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function SmartNote({ note, courseFolders = [], courseId = null, onSaveNote }) {
    const cardRef = useRef(null);
    const [cardWidth, setCardWidth] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const navigate = useNavigate();
    const lectureOptions = buildLectureOptions(courseFolders);
    const linkedLecture = note.linkedLecture
        ? lectureOptions.find((option) => String(option.materialFolderId) === String(note.linkedLecture.materialFolderId ?? "")) || note.linkedLecture
        : null;
    const selectedLectureOption = linkedLecture
        ? lectureOptions.find((option) => String(option.materialFolderId) === String(linkedLecture.materialFolderId ?? "")) || null
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

    function handleLectureSelect(option) {
        const nextLecture = option
            ? {
                id: option.id,
                title: option.title,
                shortTitle: option.shortTitle,
                weekLabel: option.weekLabel,
                description: option.description,
                courseId: courseId || option.course || note.linkedLecture?.courseId || null,
                materialFolderId: option.materialFolderId,
            }
            : null;

        onSaveNote?.({
            ...note,
            linkedLecture: nextLecture,
            modified: formatDisplayDate(),
        });
        setIsPickerOpen(false);
    }

    return (
        <div
            ref={cardRef}
            onClick={() => setIsEditing(true)}
            className="group relative min-w-70 flex overflow-hidden rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark transition-shadow duration-200 hover:shadow-md shadow-sm shadow-shadow-light dark:shadow-shadow-dark"
        >
            {isEditing && (
                <SmartNoteEditor
                    note={note}
                    onClose={() => setIsEditing(false)}
                    courseFolders={courseFolders}
                    courseId={courseId}
                    onSaveNote={onSaveNote}
                />
            )}

            {/* Left accent bar */}
            <div className="w-1 shrink-0 bg-linear-to-b from-indigo-500 to-cyan-400" />

            {/* Card body */}
            <div className="flex flex-1 flex-col gap-3 min-w-0 p-4 md:p-5">

                {/* Title + preview + delete */}
                <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                        <h3 className="font-semibold text-base leading-snug text-text-primary-active-light dark:text-text-primary-active-dark truncate">
                            {note.title}
                        </h3>
                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark line-clamp-2 leading-relaxed">
                            {note.content}
                        </p>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); /* handle delete */ }}
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-300 dark:hover:border-red-800"
                    >
                        <TrashIcon className="w-3.5 h-3.5 text-icon-secondary-default-light dark:text-icon-primary-default-dark" />
                    </button>
                </div>

                {/* Lecture link */}
                <div className="space-y-2">
                    {!isPickerOpen ? (
                        <>
                            {linkedLecture ? (
                                <div className="flex items-center gap-2 rounded-[14px] border border-indigo-200/40 dark:border-indigo-800/30 bg-linear-to-r from-indigo-500/5.5 to-cyan-500/4.5 p-3 relative overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const targetCourseId = courseId || linkedLecture.courseId;
                                            if (targetCourseId && linkedLecture.materialFolderId) {
                                                navigate(`/courses/${targetCourseId}/materials?folderId=${linkedLecture.materialFolderId}`);
                                            }
                                        }}
                                        className="group flex items-center gap-3 flex-1 text-left hover:from-indigo-500/10 hover:to-cyan-500/8 transition-all duration-150"
                                    >
                                        <div className="relative shrink-0">
                                            <div className="w-9 h-9 rounded-[10px] bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                                                <BookIcon className="w-4 h-4 text-white" />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9.5px] font-bold tracking-wide uppercase mb-0.5 bg-linear-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                                                Linked Week Lecture
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
                                        className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                                    >
                                        Change
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsPickerOpen(true);
                                    }}
                                    className="flex items-center gap-2.5 w-full text-left rounded-xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors p-2.5 opacity-75 hover:opacity-100"
                                >
                                    <div className="shrink-0 w-8 h-8 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark flex items-center justify-center">
                                        <LinkIcon className="w-4 h-4 text-icon-secondary-default-light dark:text-icon-secondary-default-dark" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-semibold text-text-tertiary-default-light dark:text-text-tertiary-default-dark uppercase tracking-wide mb-0.5">
                                            No lecture linked
                                        </p>
                                        <p className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                                            Click to select a lecture
                                        </p>
                                    </div>
                                </button>
                            )}
                        </>
                    ) : (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-[14px] border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark p-3 space-y-3"
                        >
                            <SelectBox
                                label="Choose Lecture"
                                showLabel={true}
                                compact={false}
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
                                    Done
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
                                        Clear
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
                            <CalendarIcon className="w-3 h-3" />
                            {note.creationDate}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-text-tertiary-default-light dark:text-text-tertiary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-full px-2.5 py-0.5">
                            <ClockIcon className="w-3 h-3" />
                            {note.modified}
                        </span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); /* handle AI summarize */ }}
                        className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-white bg-linear-to-r from-indigo-500 to-cyan-500 hover:opacity-90 transition-opacity rounded-lg px-3 py-1.5"
                    >
                        <FahimIcon className="w-3.5 h-3.5" />
                        {cardWidth >= 320 && <span>AI Summarize</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}