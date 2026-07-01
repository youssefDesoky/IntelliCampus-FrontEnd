import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import Section from "../../../../../components/ui/Section";
import Button from "../../../../../components/ui/Button";
import TextArea from "../../../../../components/ui/TextArea";
import BaseFormComponent from "../../../../../components/ui/BaseFormComponent";
import { CheckIcon, DownloadIcon, XIcon, CloudUploadIcon, FileLinesIcon, FileIcon, TrashIcon, PaperclipIcon, CalendarDaysIcon } from "../../../../../components/ui/icons";
import Table from "../../../../../components/ui/Table";
import AttendanceOverall from "./AttendanceOverall";
import AttendanceBreakdown from "./AttendanceBreakdown";
import AttendanceExcuseCard from "./AttendanceExcuseCard";
import { useError } from "../../../../../contexts/ErrorContext.jsx";
import { useToast } from "../../../../../contexts/ToastContext.jsx";
import { fetchMyAttendance, submitExcuse } from "../../../services/profileApi";
import { CourseAttendanceSkeleton } from "./SkeletonLoader";

export default function CourseAttendance() {
    const fileInputRef = useRef(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [reason, setReason] = useState("");
    const [selectedSessionId, setSelectedSessionId] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { course, courseId } = useOutletContext();
    const { showError } = useError();
    const { showToast } = useToast();

    const { data: attendanceData = null, isLoading: loading } = useQuery({
        queryKey: ["courseAttendance", courseId],
        queryFn: () => fetchMyAttendance(courseId),
        staleTime: 0,
        enabled: !!courseId,
        select: (raw) => {
            const sessions = raw?.data ?? [];
            const totalSessions = sessions.length;
            const presentSessions = sessions.filter((s) => s.presentCount > 0).length;
            const missedSessions = totalSessions - presentSessions;
            const percentage = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0;
            return {
                summary: { percentage, attendedSessions: presentSessions, missedSessions },
                breakdown: {
                    totalSessions, presentSessions, missedSessions, percentage,
                    onTimePercentage: percentage,
                    needsImprovementPercentage: 100 - percentage,
                },
                history: sessions.map((s) => ({
                    sessionId: s.sessionId,
                    date: s.date ? String(s.date).substring(0, 10) : "",
                    time: [s.startTime, s.endTime].filter(Boolean).join(" — "),
                    type: s.sessionType === 0 ? "Lecture" : "Section",
                    status: s.presentCount > 0 ? "Present" : "Absent",
                    topic: s.topic || "",
                })),
            };
        },
    });

    const openForm = () => setIsFormOpen(true);

    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedFile(null);
        setReason("");
        setSelectedSessionId("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files?.[0] || null);
    };

    const handleSubmit = async () => {
        if (!reason.trim() || !selectedSessionId) return;

        setSubmitting(true);
        try {
            await submitExcuse(courseId, {
                sessionId: selectedSessionId,
                reason,
                file: selectedFile,
            });
            showToast({ type: "success", title: "Excuse submitted", message: "Your excuse request has been submitted for review." });
            closeForm();
        } catch (err) {
            showError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleExport = () => {
        if (!attendanceData?.history || attendanceData.history.length === 0) {
            showError("No attendance data to export.");
            return;
        }

        const headers = ["Date", "Time", "Type", "Status"];
        const rows = attendanceData.history.map((session) => [
            session.date || "",
            session.time || "",
            session.type || "",
            session.status || "",
        ]);

        let csv = headers.join(",") + "\n";
        rows.forEach((row) => {
            csv += row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",") + "\n";
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Attendance_${course?.title || courseId}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return <CourseAttendanceSkeleton />;
    }

    if (!attendanceData) {
        return (
            <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] text-center">
                <h3 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
                    No attendance data available
                </h3>
                <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-md">
                    Attendance records for this course are not available yet.
                </p>
            </div>
        );
    }

    const { summary, breakdown, history } = attendanceData;

    return (
        <>
            <Section className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <AttendanceOverall attendance={summary} onRequestExcuse={openForm} />
                    <AttendanceBreakdown breakdown={breakdown} />
                    <AttendanceExcuseCard onRequestExcuse={openForm} />
                </div>
            </Section>

            <Section>
                <Table
                    title="Attendance History"
                    description="Complete record of your class attendance"
                    componentButton={<Button variant="secondary" onClick={handleExport} startIcon={<DownloadIcon size={18} />}>Export</Button>}
                    headers={["Date", "Time", "Type", "Status"]}
                    data={(history || []).map((session) => ({
                        date: <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{session.date}</span>,
                        time: <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{session.time}</span>,
                        type: (
                            <span className="inline-flex items-center rounded bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark px-2 py-0.5 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                                {session.type}
                            </span>
                        ),
                        status: session.status === "Present" ? (
                            <span className="inline-flex items-center justify-center rounded-full bg-bg-surface-success-default-light dark:bg-bg-surface-success-default-dark p-1.5">
                                <CheckIcon size={14} className="text-text-success-active-light dark:text-text-success-active-dark" />
                            </span>
                        ) : (
                            <span className="inline-flex items-center justify-center rounded-full bg-bg-surface-danger-default-light dark:bg-bg-surface-danger-default-dark p-1.5">
                                <XIcon size={14} className="text-text-danger-active-light dark:text-text-danger-active-dark" />
                            </span>
                        ),
                    }))}
                    wrapInSection={false}
                    showHeaderActions={false}
                    showPagination={true}
                    displayRowLimit={10}
                    itemsLabel="sessions"
                    showSelectionColumn={false}
                    showActionsColumn={false}
                    grouped={true}
                />
            </Section>

            <BaseFormComponent
                isOpen={isFormOpen}
                title="Request an excuse"
                description="Add a supporting file and explain the reason for your absence or delay."
                onClose={closeForm}
                onSubmit={handleSubmit}
                submitText={submitting ? "Submitting..." : "Submit Request"}
                cancelText="Cancel"
                submitDisabled={submitting}
                maxWidth="max-w-xl"
                contentClassName="space-y-6"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block">
                            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                                <CalendarDaysIcon size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                                Select session
                            </span>
                            <select
                                value={selectedSessionId}
                                onChange={(e) => setSelectedSessionId(e.target.value)}
                                className="w-full rounded-2xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 text-sm text-text-primary-light outline-none transition-colors focus:border-border-accent-default-light focus:ring-4 focus:ring-accent-500/10 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-text-primary-dark"
                            >
                                <option value="">Choose a session...</option>
                                {(attendanceData?.history || []).map((session) => (
                                    <option key={session.sessionId || session.id} value={session.sessionId || session.id}>
                                        {session.date} — {session.time} ({session.type}){session.topic ? ` — ${session.topic}` : ""}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <label className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                            <FileLinesIcon size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                            Reason for excuse
                        </span>
                        <TextArea
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            placeholder="Explain why you missed the session and any relevant details..."
                            className="w-full rounded-2xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 text-sm text-text-primary-light outline-none transition-all placeholder:text-text-secondary-light focus:border-border-accent-default-light focus:ring-4 focus:ring-accent-500/10 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-text-primary-dark dark:placeholder:text-text-secondary-dark"
                        />
                    </label>

                    <div className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                            <PaperclipIcon size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                            Supporting document
                        </span>

                        {!selectedFile ? (
                            <label className="group flex flex-col items-center justify-center w-full min-h-36 rounded-2xl border-2 border-dashed border-border-primary-default-light bg-bg-surface-secondary-default-light hover:bg-bg-surface-primary-hover-light hover:border-border-accent-default-light transition-all dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:hover:bg-bg-surface-primary-hover-dark">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-fill-secondary-default-light group-hover:scale-110 transition-transform duration-200 dark:bg-bg-fill-secondary-default-dark mb-3">
                                    <CloudUploadIcon size={24} className="text-text-secondary-light dark:text-text-secondary-dark" />
                                </div>
                                <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                                    Click to upload or drag and drop
                                </p>
                                <p className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark text-center">
                                    PDF, PNG, JPG, or DOC (max. 10MB)
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                    onChange={handleFileChange}
                                />
                            </label>
                        ) : (
                            <div className="flex items-center justify-between p-4 rounded-2xl border border-border-primary-default-light bg-bg-surface-primary-default-light shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all dark:border-border-primary-default-dark dark:bg-bg-surface-primary-default-dark">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg-surface-accent-default-light text-text-accent-active-light dark:bg-bg-surface-accent-default-dark dark:text-text-accent-active-dark">
                                        <FileIcon size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate text-text-primary-light dark:text-text-primary-dark">{selectedFile.name}</p>
                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                                            {selectedFile.size ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={() => setSelectedFile(null)}
                                    className="shrink-0 text-text-danger-default-light hover:bg-bg-surface-danger-default-light dark:text-text-danger-default-dark dark:hover:bg-bg-surface-danger-default-dark"
                                >
                                    <TrashIcon size={18} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </BaseFormComponent>
        </>
    );
}
