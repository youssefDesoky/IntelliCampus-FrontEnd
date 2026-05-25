import { useEffect, useMemo, useState } from "react";
import { useOutletContext, useRouteLoaderData } from "react-router-dom";

import useDeviceType from "../../../hooks/useDeviceType";
import { API_URL } from "../../../config/api";

import SmartNotesBody from "../../../feature/student/smartNotes/SmartNotesBody";


export default function SmartNotes() {
    const {isPhone, isTablet} = useDeviceType();
    const authUser = useRouteLoaderData("root");
    const outletCtx = useOutletContext();
    const [viewMode, setViewMode] = useState(
        localStorage.getItem('notesViewMode') === 'grid-3' ? 'grid-3' : 'grid-2'
    );

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const studentId = authUser?.role === "student" ? authUser?.userId : null;
    const currentCourseId = outletCtx?.courseId || null;

    useEffect(() => {
        let cancelled = false;

        async function loadNotes() {
            if (!studentId) {
                if (!cancelled) {
                    setNotes([]);
                    setLoading(false);
                }
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`${API_URL}/api/students/${studentId}`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error(`Failed to load student notes (${res.status})`);
                }

                const student = await res.json();
                const courses = currentCourseId
                    ? (student?.courses || []).filter((course) => String(course?.id) === String(currentCourseId))
                    : (student?.courses || []);

                const mappedNotes = courses.flatMap((course) =>
                    (course?.notes || []).map((note) => ({
                        ...note,
                        course: course?.title || course?.courseName || "",
                        linkedLecture: note?.linkedLecture
                            ? {
                                ...note.linkedLecture,
                                courseId: note.linkedLecture.courseId || course?.id || null,
                            }
                            : null,
                    }))
                );

                if (!cancelled) {
                    setNotes(mappedNotes);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err?.message || "Failed to load notes");
                    setNotes([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadNotes();

        return () => {
            cancelled = true;
        };
    }, [studentId, currentCourseId]);

    const sortedNotes = useMemo(() => {
        return [...notes].sort((a, b) => {
            const firstDate = Date.parse(a?.modified || a?.creationDate || "") || 0;
            const secondDate = Date.parse(b?.modified || b?.creationDate || "") || 0;
            return secondDate - firstDate;
        });
    }, [notes]);

    function handleSaveNote(savedNote) {
        if (!savedNote) return;

        setNotes((prevNotes) => {
            const existingIndex = prevNotes.findIndex((item) => String(item.id) === String(savedNote.id));

            if (existingIndex !== -1) {
                return prevNotes.map((item, idx) => (idx === existingIndex ? savedNote : item));
            }

            return [savedNote, ...prevNotes];
        });
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading notes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center py-12">
                <p className="text-red-500">Failed to load notes: {error}</p>
            </div>
        );
    }

    return (
        <SmartNotesBody
            notes={sortedNotes}
            isPhone={isPhone}
            isTablet={isTablet}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onSaveNote={handleSaveNote}
        />
    );
}