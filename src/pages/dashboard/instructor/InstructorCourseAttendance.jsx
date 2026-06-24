import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useOutletContext, useParams, useRouteLoaderData } from "react-router-dom";

import Button from "../../../components/ui/Button";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import { ArrowRightIcon, CalendarIcon, ClockIcon, DownloadIcon, LocationDotIcon, PlusIcon, QRCodeIcon, UsersIcon, XIcon } from "../../../components/ui/icons";

import {
    fetchAttendanceReport,
    fetchClassesByCourse,
    getSessionsByClass,
    createClass,
    createSession,
    recordManualAttendance,
    scanAttendanceQr,
} from "../../../feature/instructor/components/attendance/instructorAttendanceApi";
import { useError } from '../../../contexts/ErrorContext.jsx';

function formatTime(value) {
    if (!value) return null;

    const normalized = typeof value === "string" ? value.trim() : String(value);
    if (!normalized) return null;

    const parsed = new Date(`1970-01-01T${normalized}`);
    if (Number.isNaN(parsed.getTime())) return normalized;

    return parsed.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function getClassTypeStyles(classType) {
    const type = String(classType || "").toLowerCase();

    if (type.includes("lecture")) {
        return {
            badge: "bg-bg-surface-blue-default-light text-text-accent-default-light dark:bg-bg-surface-blue-default-dark dark:text-text-accent-default-dark",
            accent: "from-blue-500/15 via-sky-400/10 to-transparent",
            pill: "border-border-accent-default-light/30 bg-bg-fill-primary-default-light text-text-accent-default-light dark:border-border-accent-default-dark/30 dark:bg-bg-fill-primary-default-dark dark:text-text-accent-default-dark",
        };
    }

    if (type.includes("lab")) {
        return {
            badge: "bg-bg-surface-green-default-light text-text-success-default-light dark:bg-bg-surface-green-default-dark dark:text-text-success-default-dark",
            accent: "from-emerald-500/15 via-green-400/10 to-transparent",
            pill: "border-border-success-default-light/30 bg-bg-fill-success-default-light text-text-success-default-light dark:border-border-success-default-dark/30 dark:bg-bg-fill-success-default-dark dark:text-text-success-default-dark",
        };
    }

    return {
        badge: "bg-bg-surface-amber-default-light text-text-warning-default-light dark:bg-bg-surface-amber-default-dark dark:text-text-warning-default-dark",
        accent: "from-amber-500/15 via-orange-400/10 to-transparent",
        pill: "border-border-warning-default-light/30 bg-bg-fill-warning-default-light text-text-warning-default-light dark:border-border-warning-default-dark/30 dark:bg-bg-fill-warning-default-dark dark:text-text-warning-default-dark",
    };
}

function getClassCardMeta(classItem) {
    const classId = classItem.classId || classItem.id;
    const className = classItem.name || classItem.className || `Class ${classId}`;
    const classDescription = classItem.description || classItem.Description || null;
    const classType = classItem.classTypeName || classItem.classType || classItem.type || null;
    const groupCode = classItem.groupCode || classItem.GroupCode || null;
    const day = classItem.dayName || classItem.day || null;
    const startTime = formatTime(classItem.startTime);
    const endTime = formatTime(classItem.endTime);
    const room = classItem.room || classItem.Room || null;
    const instructor = classItem.instructorName || classItem.InstructorName || null;
    const scheduleText = day && startTime ? `${day}${endTime ? `, ${startTime} - ${endTime}` : `, ${startTime}`}` : null;

    return {
        classId,
        className,
        classDescription,
        classType,
        groupCode,
        day,
        startTime,
        endTime,
        room,
        instructor,
        scheduleText,
    };
}

export default function InstructorCourseAttendance() {
    const outlet = useOutletContext() || {};
    const params = useParams();
    const authUser = useRouteLoaderData("root");
    const courseId = outlet.courseId || outlet.course?.id || params.courseId;
    const course = outlet.course || null;
    const courseName = course?.courseName || course?.name || "Selected course";
    const currentInstructorId = authUser?.userId || authUser?.id;

    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [report, setReport] = useState(null);
    const [isLoadingClasses, setIsLoadingClasses] = useState(true);
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);
    const { showError } = useError();
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [creatingSession, setCreatingSession] = useState(false);

    // Create class state
    const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
    const [creatingClass, setCreatingClass] = useState(false);
    const [newClass, setNewClass] = useState({ className: "", description: "" });

    // Attendance UI state
    const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [manualId, setManualId] = useState("");
    const [recentScans, setRecentScans] = useState([]);
    const [scanTab, setScanTab] = useState("qr"); // "qr" or "manual"
    const videoRef = useRef(null);
    const detectorTimerRef = useRef(null);

    const loadClasses = useCallback(async () => {
        if (!courseId || !currentInstructorId) {
            showError("No course context or instructor ID found.");
            setIsLoadingClasses(false);
            return;
        }

        setIsLoadingClasses(true);
        try {
            const data = await fetchClassesByCourse(courseId);
            const allClasses = Array.isArray(data) ? data : [];
            // Filter to only show classes taught by current instructor
            const filteredClasses = allClasses.filter(cls => {
                const clsInstructorId = cls.instructorId || cls.InstructorId;
                return clsInstructorId === currentInstructorId;
            });
            setClasses(filteredClasses);
            setSelectedClassId(filteredClasses.length > 0 ? (filteredClasses[0].classId || filteredClasses[0].id) : null);
        } catch (err) {
            showError(err.message || "Failed to load classes.");
            setClasses([]);
        } finally {
            setIsLoadingClasses(false);
        }
    }, [courseId, currentInstructorId]);

    const handleCreateClass = async () => {
        if (!newClass.className.trim()) {
            showError("Class name is required.");
            return;
        }
        setCreatingClass(true);
        try {
            await createClass({
                courseId: Number(courseId),
                instructorId: currentInstructorId,
                className: newClass.className.trim(),
                description: newClass.description.trim(),
            });
            setIsCreateClassOpen(false);
            setNewClass({ className: "", description: "" });
            await loadClasses();
        } catch (err) {
            showError(err.message || "Failed to create class.");
        } finally {
            setCreatingClass(false);
        }
    };

    useEffect(() => {
        loadClasses();
    }, [loadClasses]);

    const loadSessions = useCallback(async () => {
        if (!selectedClassId) {
            setSessions([]);
            setSelectedSessionId(null);
            return;
        }

        setIsLoadingSessions(true);
        try {
            const data = await getSessionsByClass(selectedClassId);
            const normalized = Array.isArray(data) ? data : [];
            setSessions(normalized);
            if (normalized.length === 0) {
                setSelectedSessionId(null);
                return;
            }

            setSelectedSessionId((current) => {
                if (current && normalized.some((s) => s.sessionId === current)) {
                    return current;
                }

                const sorted = [...normalized].sort((a, b) => {
                    const aDate = new Date(a.date || 0).getTime();
                    const bDate = new Date(b.date || 0).getTime();
                    return bDate - aDate;
                });
                return sorted[0]?.sessionId ?? normalized[0].sessionId;
            });
        } catch (err) {
            setSessions([]);
            setSelectedSessionId(null);
            showError(err.message || "Failed to load sessions.");
        } finally {
            setIsLoadingSessions(false);
        }
    }, [selectedClassId]);

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    const ensureSelectedSession = useCallback(async () => {
        if (selectedSessionId) return selectedSessionId;
        if (sessions.length > 0) {
            setSelectedSessionId(sessions[0].sessionId || sessions[0].SessionId || sessions[0].id);
            return selectedSessionId;
        }

        if (!selectedClassId) throw new Error("No class selected");

        setCreatingSession(true);
        try {
            const payload = {
                classId: Number(selectedClassId),
                date: new Date().toISOString(),
                topic: "Auto session",
            };
            const created = await createSession(payload);
            const sid = created.sessionId ?? created.SessionId ?? created.sessionId;
            const newSessions = [...(sessions || []), created];
            setSessions(newSessions);
            setSelectedSessionId(sid);
            return sid;
        } finally {
            setCreatingSession(false);
        }
    }, [selectedSessionId, sessions, selectedClassId]);



    const startScanner = async () => {
        if (!selectedSessionId) {
            showError("Select a session first to scan attendance.");
            return;
        }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showError("Camera API not available in this browser.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Ensure video will autoplay in secure contexts
                videoRef.current.muted = true;
                videoRef.current.playsInline = true;
                try {
                    await videoRef.current.play();
                } catch (playErr) {
                    // some browsers block autoplay; user can press Start in the modal to begin playback
                }
            }
            setScanning(true);

            if (window.BarcodeDetector) {
                const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
                detectorTimerRef.current = setInterval(async () => {
                    try {
                        const barcodes = await detector.detect(videoRef.current);
                        if (barcodes && barcodes.length > 0) {
                            const value = barcodes[0].rawValue || barcodes[0].rawText || null;
                            if (value) handleScanned(value);
                        }
                    } catch { /* ignore */ }
                }, 500);
            }
        } catch (err) {
            showError(err.message || 'Failed to access camera.');
        }
    };

    const stopScanner = () => {
        setScanning(false);
        if (detectorTimerRef.current) {
            clearInterval(detectorTimerRef.current);
            detectorTimerRef.current = null;
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((t) => t.stop());
            videoRef.current.srcObject = null;
        }
    };

    const handleScanned = async (value) => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        try {
            await scanAttendanceQr({
                sessionId: Number(selectedSessionId),
                qrPayload: String(value),
                status: 0,
            });
            setRecentScans(prev => [{ id: value, timestamp, status: 'success' }, ...prev.slice(0, 9)]);
            await loadAttendanceReport();
            // Auto-start scanner again after short delay
            setTimeout(() => startScanner(), 800);
        } catch (err) {
            setRecentScans(prev => [{ id: value, timestamp, status: 'error' }, ...prev.slice(0, 9)]);
            setTimeout(() => startScanner(), 1000);
        }
    };

    const submitManualAttendance = async () => {
        if (!selectedSessionId) { showError('Select a session first.'); return; }
        if (!manualId.trim()) { showError('Enter a student ID.'); return; }
        const parsedStudentId = Number(manualId.trim());
        if (!Number.isFinite(parsedStudentId)) {
            showError('Student ID must be a valid number.');
            return;
        }
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        try {
            await recordManualAttendance({
                sessionId: Number(selectedSessionId),
                studentId: parsedStudentId,
                status: 0,
            });
            setRecentScans(prev => [{ id: manualId.trim(), timestamp, status: 'success' }, ...prev.slice(0, 9)]);
            setManualId('');
            await loadAttendanceReport();
            showError('Attendance recorded for ' + manualId.trim());
        } catch (err) {
            showError(err.message || 'Failed to record attendance.');
        }
    };

    useEffect(() => {
        return () => { stopScanner(); };
    }, []);

    const loadAttendanceReport = useCallback(async () => {
        if (!selectedClassId) return;
        setIsLoadingReport(true);
        try {
            const data = await fetchAttendanceReport(selectedClassId);
            setReport(data);
        } catch (err) {
            showError(err.message || "Failed to load attendance report.");
            setReport(null);
        } finally {
            setIsLoadingReport(false);
        }
    }, [selectedClassId]);

    useEffect(() => { if (selectedClassId) loadAttendanceReport(); }, [selectedClassId, loadAttendanceReport]);

    const belowThresholdCount = useMemo(() => { if (!report?.students) return 0; return report.students.filter((s) => s.belowThreshold).length; }, [report]);

    const downloadReport = () => {
        if (!report) return;
        const csvContent = [
            ["Attendance Report"],
            [`Class: ${report.className || "N/A"}`],
            [`Total Sessions: ${report.totalSessions}`],
            [`On-Time %: ${report.onTimePercentage?.toFixed(2)}%`],
            [`Needs Improvement %: ${report.needsImprovementPercentage?.toFixed(2)}%`],
            [],
            ["Student Name", "Student ID", "Present", "Late", "Absent", "Attendance %", "Status"],
            ...report.students.map((s) => [ s.studentName || "N/A", s.studentId, s.present, s.late, s.absent, `${s.attendancePercentage?.toFixed(2)}%`, s.belowThreshold ? "Below Threshold" : "Good", ]),
        ].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `attendance_${report.className?.replace(/\s+/g, "_") || "report"}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoadingClasses) return <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading classes...</p>;
    if (!selectedClassId) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary-default-light dark:text-text-secondary-default-dark">Attendance classes</p>
                        <h1 className="mt-1 text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">Choose a class to inspect attendance</h1>
                        <p className="mt-2 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">{courseName} • Open a class to review its attendance report, scan QR codes, or record manual entries.</p>
                    </div>
                    <Button type="button" variant="primary" onClick={() => setIsCreateClassOpen(true)} startIcon={<PlusIcon size={18} />}>
                        Create Class
                    </Button>
                </div>

                {classes.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-border-primary-default-light bg-bg-surface-primary-default-light p-8 text-center dark:border-border-primary-default-dark dark:bg-bg-surface-primary-default-dark">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-surface-secondary-default-light text-text-accent-default-light dark:bg-bg-surface-secondary-default-dark dark:text-text-accent-default-dark">
                            <UsersIcon className="h-7 w-7" />
                        </div>
                        <h2 className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">No classes found for this course</h2>
                        <p className="mt-2 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Add at least one class before attendance can be tracked here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {classes.map((c) => {
                            const meta = getClassCardMeta(c);
                            const typeStyles = getClassTypeStyles(meta.classType);

                            return (
                                <button
                                    key={meta.classId}
                                    type="button"
                                    onClick={() => setSelectedClassId(meta.classId)}
                                    className="group relative overflow-hidden rounded-3xl border border-border-primary-default-light bg-bg-surface-primary-default-light text-left shadow-sm shadow-shadow-light transition-all duration-300 hover:-translate-y-1 hover:border-border-accent-default-light hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-accent-500/10 dark:border-border-primary-default-dark dark:bg-bg-surface-primary-default-dark dark:shadow-shadow-dark dark:hover:border-border-accent-default-dark"
                                >
                                    <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${typeStyles.accent}`} />
                                    <div className="flex h-full flex-col p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {meta.groupCode ? (
                                                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${typeStyles.pill}`}>
                                                            {meta.groupCode}
                                                        </span>
                                                    ) : null}
                                                    {meta.classType ? (
                                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${typeStyles.badge}`}>
                                                            {meta.classType}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold tracking-tight text-text-primary-default-light dark:text-text-primary-default-dark">{meta.className}</h3>
                                                    <p className="mt-2 text-sm leading-6 text-text-secondary-default-light dark:text-text-secondary-default-dark line-clamp-3">{meta.classDescription || "No description available for this class."}</p>
                                                </div>
                                            </div>

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-bg-surface-secondary-default-light text-text-accent-default-light transition-transform duration-300 group-hover:translate-x-1 dark:bg-bg-surface-secondary-default-dark dark:text-text-accent-default-dark">
                                                <ArrowRightIcon className="h-5 w-5" />
                                            </div>
                                        </div>

                                        <div className="mt-5 grid gap-3">
                                            <div className="flex items-center gap-3 rounded-2xl border border-border-primary-default-light bg-bg-fill-secondary-default-light px-4 py-3 dark:border-border-primary-default-dark dark:bg-bg-fill-secondary-default-dark">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-surface-primary-default-light text-text-accent-default-light dark:bg-bg-surface-primary-default-dark dark:text-text-accent-default-dark">
                                                    <CalendarIcon className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-secondary-default-light dark:text-text-secondary-default-dark">Schedule</p>
                                                    <p className="mt-1 truncate text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                                                        {meta.scheduleText || "Schedule not set"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div className="flex items-center gap-3 rounded-2xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-surface-primary-default-light text-text-success-default-light dark:bg-bg-surface-primary-default-dark dark:text-text-success-default-dark">
                                                        <LocationDotIcon className="h-5 w-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-secondary-default-light dark:text-text-secondary-default-dark">Room</p>
                                                        <p className="mt-1 truncate text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{meta.room || "TBA"}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 rounded-2xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-surface-primary-default-light text-text-warning-default-light dark:bg-bg-surface-primary-default-dark dark:text-text-warning-default-dark">
                                                        <ClockIcon className="h-5 w-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-secondary-default-light dark:text-text-secondary-default-dark">Time</p>
                                                        <p className="mt-1 truncate text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                                                            {meta.startTime && meta.endTime ? `${meta.startTime} - ${meta.endTime}` : meta.startTime || "Not set"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between rounded-2xl border border-border-primary-default-light bg-bg-fill-secondary-default-light px-4 py-3 dark:border-border-primary-default-dark dark:bg-bg-fill-secondary-default-dark">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-surface-primary-default-light text-text-primary-default-light dark:bg-bg-surface-primary-default-dark dark:text-text-primary-default-dark">
                                                        <UsersIcon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-secondary-default-light dark:text-text-secondary-default-dark">Instructor</p>
                                                        <p className="mt-1 text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{meta.instructor || "Unassigned"}</p>
                                                    </div>
                                                </div>

                                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-text-accent-default-light dark:text-text-accent-default-dark">
                                                    Open
                                                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

            {isCreateClassOpen && (
                <ModelOverlay onClose={() => setIsCreateClassOpen(false)} maxWidth="max-w-lg">
                    <div className="relative w-full overflow-hidden rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-[0_32px_80px_-12px_rgba(0,0,0,0.28)]">
                        <div className="flex items-center justify-between gap-4 border-b border-border-primary-default-light px-6 py-5 dark:border-border-primary-default-dark">
                            <h3 className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">Create Class</h3>
                            <button
                                type="button"
                                onClick={() => setIsCreateClassOpen(false)}
                                className="rounded-lg border border-border-primary-default-light bg-bg-surface-secondary-default-light p-2.5 text-icon-secondary-default-light transition-colors hover:bg-bg-surface-secondary-hover-light dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-icon-secondary-default-dark dark:hover:bg-bg-surface-secondary-hover-dark"
                                aria-label="Close"
                            >
                                <XIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="px-6 py-6 space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Class Name *</label>
                                <input
                                    type="text"
                                    value={newClass.className}
                                    onChange={(e) => setNewClass((prev) => ({ ...prev, className: e.target.value }))}
                                    placeholder="e.g. Lecture 1"
                                    className="w-full rounded-xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 text-sm text-text-primary-default-light focus:border-border-accent-default-light focus:outline-none focus:ring-4 focus:ring-accent-500/10 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-text-primary-default-dark dark:focus:border-border-accent-default-dark"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Description</label>
                                <textarea
                                    value={newClass.description}
                                    onChange={(e) => setNewClass((prev) => ({ ...prev, description: e.target.value }))}
                                    placeholder="Optional description"
                                    rows={2}
                                    className="w-full rounded-xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 text-sm text-text-primary-default-light focus:border-border-accent-default-light focus:outline-none focus:ring-4 focus:ring-accent-500/10 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-text-primary-default-dark dark:focus:border-border-accent-default-dark"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="secondary" onClick={() => setIsCreateClassOpen(false)}>Cancel</Button>
                                <Button type="button" variant="primary" onClick={handleCreateClass} disabled={creatingClass}>
                                    {creatingClass ? "Creating..." : "Create Class"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </ModelOverlay>
            )}
            </div>
        );
    }

    if (isLoadingReport) return <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading attendance report...</p>;
    if (!report) return <p className="text-sm text-text-danger-default-light dark:text-text-danger-default-dark">No attendance data available for this class.</p>;

    return (        
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button type="button" variant="secondary" onClick={() => setSelectedClassId(null)}>← Back to Classes</Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={async () => {
                        try {
                            await ensureSelectedSession();
                            setIsAttendanceOpen(true);
                        } catch (err) {
                            showError(err?.message || 'Failed to prepare session.');
                        }
                    }}
                    startIcon={<QRCodeIcon size={16} />}
                    disabled={creatingSession}
                >
                    {creatingSession ? 'Preparing...' : 'Take Attendance'}
                </Button>
            </div>

            {/* Header with class info and download button */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">Attendance Report</h1>
                    <p className="mt-1 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">{report.className || "Class Attendance"}</p>
                </div>
                <Button type="button" variant="secondary" onClick={downloadReport} startIcon={<DownloadIcon size={18} />}>Download Report</Button>
            </div>

            {isAttendanceOpen && (
                <ModelOverlay onClose={() => { setIsAttendanceOpen(false); stopScanner(); setManualId(''); setRecentScans([]); }} maxWidth="max-w-2xl">
                    <div className="relative w-full overflow-hidden rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-[0_32px_80px_-12px_rgba(0,0,0,0.28)]">
                        {/* Header */}
                        <div className="flex items-center justify-between gap-4 border-b border-border-primary-default-light px-6 py-5 dark:border-border-primary-default-dark">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark">
                                        <QRCodeIcon className="h-6 w-6 text-text-accent-default-light dark:text-text-accent-default-dark" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">Take Attendance</h3>
                                        <p className="mt-1 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Scan QR codes or enter student IDs manually</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setIsAttendanceOpen(false); stopScanner(); setManualId(''); setRecentScans([]); }}
                                className="rounded-lg border border-border-primary-default-light bg-bg-surface-secondary-default-light p-2.5 text-icon-secondary-default-light transition-colors hover:bg-bg-surface-secondary-hover-light dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-icon-secondary-default-dark dark:hover:bg-bg-surface-secondary-hover-dark"
                                aria-label="Close"
                            >
                                <XIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6">
                            <div className="mb-5">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                    Session
                                </label>
                                <select
                                    value={selectedSessionId || ""}
                                    onChange={(e) => setSelectedSessionId(Number(e.target.value))}
                                    disabled={isLoadingSessions || sessions.length === 0}
                                    className="w-full rounded-xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 text-sm text-text-primary-default-light focus:border-border-accent-default-light focus:outline-none focus:ring-4 focus:ring-accent-500/10 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-text-primary-default-dark dark:focus:border-border-accent-default-dark"
                                >
                                    {sessions.length === 0 ? (
                                        <option value="">{isLoadingSessions ? "Loading sessions..." : "No sessions available"}</option>
                                    ) : (
                                        sessions.map((session) => {
                                            const sessionDate = session.date
                                                ? new Date(session.date).toLocaleDateString()
                                                : "Unknown date";
                                            const start = session.startTime || "";
                                            const end = session.endTime || "";
                                            const timeLabel = start && end ? ` (${start} - ${end})` : "";

                                            return (
                                                <option key={session.sessionId} value={session.sessionId}>
                                                    {`#${session.sessionId} - ${sessionDate}${timeLabel}`}
                                                </option>
                                            );
                                        })
                                    )}
                                </select>
                            </div>

                            {/* Tabs */}
                            <div className="mb-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setScanTab("qr")}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
                                        scanTab === "qr"
                                            ? "bg-bg-fill-primary-default-light text-text-accent-default-light dark:bg-bg-fill-primary-default-dark dark:text-text-accent-default-dark"
                                            : "text-text-secondary-default-light hover:bg-bg-surface-secondary-default-light dark:text-text-secondary-default-dark dark:hover:bg-bg-surface-secondary-default-dark"
                                    }`}
                                >
                                    <QRCodeIcon className="h-5 w-5" />
                                    <span>QR Scanner</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setScanTab("manual")}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
                                        scanTab === "manual"
                                            ? "bg-bg-fill-primary-default-light text-text-accent-default-light dark:bg-bg-fill-primary-default-dark dark:text-text-accent-default-dark"
                                            : "text-text-secondary-default-light hover:bg-bg-surface-secondary-default-light dark:text-text-secondary-default-dark dark:hover:bg-bg-surface-secondary-default-dark"
                                    }`}
                                >
                                    <UsersIcon className="h-5 w-5" />
                                    <span>Manual Entry</span>
                                </button>
                            </div>

                            {/* QR Scanner Tab */}
                            {scanTab === "qr" && (
                                <div className="space-y-4">
                                    {/* Video Feed */}
                                    <div className="space-y-3">
                                        <div className="relative overflow-hidden rounded-2xl border border-border-primary-default-light bg-black dark:border-border-primary-default-dark" style={{ aspectRatio: "4/3" }}>
                                            <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
                                            {!scanning && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                                    <div className="text-center">
                                                        <div className="mb-4 text-5xl">📷</div>
                                                        <p className="text-sm font-medium text-white">Press Start Scanner to begin</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                type="button"
                                                variant={scanning ? "secondary" : "primary"}
                                                onClick={startScanner}
                                                disabled={scanning}
                                                className="flex-1"
                                            >
                                                {scanning ? "Scanner Running..." : "Start Scanner"}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={stopScanner}
                                                disabled={!scanning}
                                                className="flex-1"
                                            >
                                                Stop Scanner
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Recent Scans */}
                                    {recentScans.length > 0 && (
                                        <div className="space-y-3 border-t pt-4">
                                            <h4 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Recent Scans</h4>
                                            <div className="max-h-48 space-y-2 overflow-y-auto">
                                                {recentScans.map((scan, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                                                            scan.status === "success"
                                                                ? "border-border-success-default-light bg-bg-surface-green-default-light/20 dark:border-border-success-default-dark dark:bg-bg-surface-green-default-dark/20"
                                                                : "border-border-danger-default-light bg-bg-surface-red-default-light/20 dark:border-border-danger-default-dark dark:bg-bg-surface-red-default-dark/20"
                                                        }`}
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-mono text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{scan.id}</p>
                                                            <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{scan.timestamp}</p>
                                                        </div>
                                                        <span
                                                            className={`text-xs font-semibold ${
                                                                scan.status === "success"
                                                                    ? "text-text-success-default-light dark:text-text-success-default-dark"
                                                                    : "text-text-danger-default-light dark:text-text-danger-default-dark"
                                                            }`}
                                                        >
                                                            {scan.status === "success" ? "✓ Done" : "✗ Error"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Manual Entry Tab */}
                            {scanTab === "manual" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-3">Student ID</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={manualId}
                                                onChange={(e) => setManualId(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && submitManualAttendance()}
                                                placeholder="Enter or paste student ID"
                                                className="flex-1 rounded-xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 text-sm placeholder-text-secondary-default-light transition-colors focus:border-border-accent-default-light focus:outline-none focus:ring-4 focus:ring-accent-500/10 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:placeholder-text-secondary-default-dark dark:focus:border-border-accent-default-dark"
                                                autoFocus
                                            />
                                            <Button
                                                type="button"
                                                variant="primary"
                                                onClick={submitManualAttendance}
                                                disabled={!manualId.trim()}
                                            >
                                                Record
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Recent Manual Entries */}
                                    {recentScans.length > 0 && (
                                        <div className="space-y-3 border-t pt-4">
                                            <h4 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Recent Entries</h4>
                                            <div className="max-h-48 space-y-2 overflow-y-auto">
                                                {recentScans.map((scan, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                                                            scan.status === "success"
                                                                ? "border-border-success-default-light bg-bg-surface-green-default-light/20 dark:border-border-success-default-dark dark:bg-bg-surface-green-default-dark/20"
                                                                : "border-border-danger-default-light bg-bg-surface-red-default-light/20 dark:border-border-danger-default-dark dark:bg-bg-surface-red-default-dark/20"
                                                        }`}
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-mono text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{scan.id}</p>
                                                            <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{scan.timestamp}</p>
                                                        </div>
                                                        <span
                                                            className={`text-xs font-semibold ${
                                                                scan.status === "success"
                                                                    ? "text-text-success-default-light dark:text-text-success-default-dark"
                                                                    : "text-text-danger-default-light dark:text-text-danger-default-dark"
                                                            }`}
                                                        >
                                                            {scan.status === "success" ? "✓ Done" : "✗ Error"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </ModelOverlay>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-border-primary-default-light bg-bg-fill-secondary-default-light p-4 dark:border-border-primary-default-dark dark:bg-bg-fill-secondary-default-dark">
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Total Sessions</p>
                    <p className="mt-1 text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">{report.totalSessions || 0}</p>
                </div>

                <div className="rounded-2xl border border-border-primary-default-light bg-bg-fill-secondary-default-light p-4 dark:border-border-primary-default-dark dark:bg-bg-fill-secondary-default-dark">
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">On-Time %</p>
                    <p className="mt-1 text-2xl font-bold text-text-success-default-light dark:text-text-success-default-dark">{report.onTimePercentage?.toFixed(1) || 0}%</p>
                </div>

                <div className="rounded-2xl border border-border-primary-default-light bg-bg-fill-secondary-default-light p-4 dark:border-border-primary-default-dark dark:bg-bg-fill-secondary-default-dark">
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Needs Improvement %</p>
                    <p className="mt-1 text-2xl font-bold text-text-warning-default-light dark:text-text-warning-default-dark">{report.needsImprovementPercentage?.toFixed(1) || 0}%</p>
                </div>

                <div className="rounded-2xl border border-border-primary-default-light bg-bg-fill-secondary-default-light p-4 dark:border-border-primary-default-dark dark:bg-bg-fill-secondary-default-dark">
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Below Threshold</p>
                    <p className="mt-1 text-2xl font-bold text-text-danger-default-light dark:text-text-danger-default-dark">{belowThresholdCount}</p>
                </div>
            </div>

            {/* Students Table */}
            <div className="rounded-2xl border border-border-primary-default-light bg-bg-surface-primary-default-light dark:border-border-primary-default-dark dark:bg-bg-surface-primary-default-dark overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Student ID</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Student Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Present</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Absent</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Attendance %</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.students.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">No students in this class.</td>
                                </tr>
                            ) : (
                                report.students.map((student, idx) => (
                                    <tr key={student.studentCode} className={`border-b border-border-primary-default-light dark:border-border-primary-default-dark ${idx % 2 === 0 ? "bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark" : "bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark"} hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark transition-colors`}>
                                        <td className="px-6 py-4 text-sm text-text-primary-default-light dark:text-text-primary-default-dark font-medium">{student.studentCode}</td>
                                        <td className="px-6 py-4 text-sm text-text-primary-default-light dark:text-text-primary-default-dark font-medium">{student.studentName || "Unknown"}</td>
                                        <td className="px-6 py-4 text-sm text-text-primary-default-light dark:text-text-primary-default-dark"><span className="px-3 py-1 rounded-full bg-bg-surface-green-default-light text-text-success-default-light dark:bg-bg-surface-green-default-dark dark:text-text-success-default-dark">{student.present}</span></td>
                                        <td className="px-6 py-4 text-sm text-text-primary-default-light dark:text-text-primary-default-dark"><span className="px-3 py-1 rounded-full bg-bg-surface-red-default-light text-text-danger-default-light dark:bg-bg-surface-red-default-dark dark:text-text-danger-default-dark">{student.absent}</span></td>
                                        <td className="px-6 py-4 text-sm text-text-primary-default-light dark:text-text-primary-default-dark font-semibold">{student.attendancePercentage?.toFixed(1)}%</td>
                                        <td className="px-6 py-4 text-sm"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${student.belowThreshold ? "bg-bg-surface-red-default-light text-text-danger-default-light dark:bg-bg-surface-red-default-dark dark:text-text-danger-default-dark" : "bg-bg-surface-green-default-light text-text-success-default-light dark:bg-bg-surface-green-default-dark dark:text-text-success-default-dark"}`}>{student.belowThreshold ? "Below Threshold" : "Good Standing"}</span></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
