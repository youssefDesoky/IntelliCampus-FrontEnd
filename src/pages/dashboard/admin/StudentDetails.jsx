import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import {
    ArrowRightIcon,
    FilePenIcon,
    UserIcon,
    XIcon,
    PaperPlaneIcon,
} from "../../../components/ui/icons";
import {
    fetchStudentById,
    fetchStudentRegisteredCourses,
    fetchStudentCompletedCourses,
    fetchAvailableCoursesForStudent,
    sendEmail,
} from "../../../feature/admin/services/adminApi";
import StudentForm from "../../../feature/admin/components/StudentForm";
import StudentInfoTab from "./StudentInfoTab";
import StudentCompletedTab from "./StudentCompletedTab";
import StudentRegisteredTab from "./StudentRegisteredTab";

const ITEMS_PER_PAGE = 10;

const tabs = [
    { key: "info", label: "Information" },
    { key: "completed", label: "Completed Courses" },
    { key: "registered", label: "Registered Courses" },
];

export default function StudentDetails() {
    const { studentId } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("info");

    const [registeredCourses, setRegisteredCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(false);

    const [page, setPage] = useState(1);

    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [sendingEmail, setSendingEmail] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleSendEmail = async () => {
        if (!emailSubject.trim() || !emailBody.trim()) return;
        setSendingEmail(true);
        try {
            await sendEmail({ to: student.email, subject: emailSubject, body: emailBody });
            setIsEmailOpen(false);
            setEmailSubject("");
            setEmailBody("");
        } catch (err) {
            console.error("Failed to send email:", err);
        } finally {
            setSendingEmail(false);
        }
    };

    const loadStudent = useCallback(async () => {
        try {
            setError(null);
            const data = await fetchStudentById(studentId);
            setStudent(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    const loadCourses = useCallback(async () => {
        setCoursesLoading(true);
        try {
            const [registered, completed, available] = await Promise.all([
                fetchStudentRegisteredCourses(studentId),
                fetchStudentCompletedCourses(studentId),
                fetchAvailableCoursesForStudent(studentId),
            ]);
            setRegisteredCourses(registered);
            setCompletedCourses(completed);
            setAvailableCourses(available);
        } catch (err) {
            console.error("Failed to load courses:", err);
        } finally {
            setCoursesLoading(false);
        }
    }, [studentId]);

    useEffect(() => { loadStudent(); }, [loadStudent]);
    useEffect(() => { loadCourses(); }, [loadCourses]);
    useEffect(() => { setPage(1); }, [activeTab]);

    const totalPages = Math.max(1, Math.ceil(
        (activeTab === "completed" ? completedCourses : registeredCourses).length / ITEMS_PER_PAGE
    ));

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading student details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="sm" onClick={() => navigate("/admin/students")}>
                        <ArrowRightIcon className="w-4 h-4 rotate-180" /> Back
                    </Button>
                </div>
                <p className="text-center py-10 text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="sm" onClick={() => navigate("/admin/students")}>
                        <ArrowRightIcon className="w-4 h-4 rotate-180" /> Back
                    </Button>
                </div>
                <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">Student not found.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-4 min-w-0">
                    <button
                        onClick={() => navigate("/admin/students")}
                        className="shrink-0 w-10 h-10 rounded-xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark flex items-center justify-center hover:bg-bg-surface-accent-default-light dark:hover:bg-bg-surface-accent-default-dark transition-colors"
                    >
                        <ArrowRightIcon className="w-5 h-5 rotate-180 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                    </button>
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark ring-2 ring-bg-surface-primary-default-light dark:ring-bg-surface-primary-default-dark shrink-0">
                            {student.profileImage ? (
                                <img src={student.profileImage} alt={student.fullName || student.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <UserIcon className="w-6 h-6 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                                {student.fullName || student.name}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-mono tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                    {student.studentId}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => { setEmailSubject(""); setEmailBody(""); setIsEmailOpen(true); }}>
                        Send Email
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setIsEditOpen(true)}>
                        <FilePenIcon className="w-4 h-4" /> Edit
                    </Button>
                </div>
            </div>

            {isEmailOpen && (
                <ModelOverlay onClose={() => { setIsEmailOpen(false); setEmailSubject(""); setEmailBody(""); }} maxWidth="max-w-xl">
                    <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl shadow-2xl w-full overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary-default-light dark:text-text-primary-default-dark">Send Email</h3>
                            <button onClick={() => { setIsEmailOpen(false); setEmailSubject(""); setEmailBody(""); }} className="p-1.5 rounded-lg text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-accent-default-light dark:hover:bg-bg-surface-accent-default-dark transition-colors">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">To</label>
                                <div className="w-full px-4 py-2.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark text-sm">
                                    {student?.email}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Subject</label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    disabled={sendingEmail}
                                    placeholder="Enter email subject"
                                    className="w-full px-4 py-2.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark focus:ring-2 focus:ring-border-accent-active-light dark:focus:ring-border-accent-active-dark focus:border-border-accent-active-light outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-secondary-default-light dark:placeholder:text-text-secondary-default-dark"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Message</label>
                                <textarea
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    disabled={sendingEmail}
                                    rows={6}
                                    placeholder="Write your message here..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark focus:ring-2 focus:ring-border-accent-active-light dark:focus:ring-border-accent-active-dark focus:border-border-accent-active-light outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-secondary-default-light dark:placeholder:text-text-secondary-default-dark resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
                                <Button variant="outline" size="sm" onClick={() => { setIsEmailOpen(false); setEmailSubject(""); setEmailBody(""); }}>Cancel</Button>
                                <Button variant="primary" size="sm" onClick={handleSendEmail} disabled={sendingEmail || !emailSubject.trim() || !emailBody.trim()}>
                                    {sendingEmail ? "Sending..." : <><PaperPlaneIcon className="w-4 h-4" /> Send</>}
                                </Button>
                            </div>
                        </div>
                    </div>
                </ModelOverlay>
            )}

            {/* ── Tabs ── */}
            <div className="flex gap-1 mb-6 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                            activeTab === tab.key
                                ? "border-border-accent-active-light dark:border-border-accent-active-dark text-text-primary-default-light dark:text-text-primary-default-dark"
                                : "border-transparent text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ─── Tab Content ─── */}
            {activeTab === "info" && (
                <StudentInfoTab
                    student={student}
                    completedCount={completedCourses.length}
                    registeredCount={registeredCourses.length}
                />
            )}
            {activeTab === "completed" && (
                <StudentCompletedTab
                    courses={completedCourses}
                    loading={coursesLoading}
                    page={page}
                    totalPages={Math.max(1, Math.ceil(completedCourses.length / ITEMS_PER_PAGE))}
                    setPage={setPage}
                />
            )}
            {activeTab === "registered" && (
                <StudentRegisteredTab
                    student={student}
                    studentId={studentId}
                    courses={registeredCourses}
                    availableCourses={availableCourses}
                    loading={coursesLoading}
                    onRefresh={loadCourses}
                />
            )}
            {isEditOpen && (
                <StudentForm method="put" initialData={student} onClose={() => setIsEditOpen(false)} />
            )}
        </div>
    );
}
