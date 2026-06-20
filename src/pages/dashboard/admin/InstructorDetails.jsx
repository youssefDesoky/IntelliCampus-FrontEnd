import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import TextArea from "../../../components/ui/TextArea";
import {
    ArrowRightIcon,
    FilePenIcon,
    UserIcon,
    BookIcon,
    StarIcon,
    CheckIcon,
    XIcon,
    PaperPlaneIcon,
    EnvelopIcon,
} from "../../../components/ui/icons";
import {
    fetchInstructorById,
    fetchInstructorCourses,
    fetchInstructorTASections,
    fetchInstructorAvailableSections,
    changeInstructorSection,
    sendEmail,
} from "../../../feature/admin/services/adminApi";
import { useError } from '../../../contexts/ErrorContext.jsx';
import InstructorForm from "../../../feature/admin/components/InstructorForm";

const tabs = [
    { key: "info", label: "Information" },
    { key: "courses", label: "Courses" },
];

function InfoField({ label, value }) {
    return (
        <div className="space-y-0.5">
            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">{label}</span>
            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{value ?? "—"}</span>
        </div>
    );
}

export default function InstructorDetails() {
    const { instructorId } = useParams();
    const navigate = useNavigate();

    const { showError } = useError();

    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("info");

    const [courses, setCourses] = useState([]);
    const [taSections, setTaSections] = useState([]);

    const [sectionChangeTarget, setSectionChangeTarget] = useState(null);
    const [availableSections, setAvailableSections] = useState([]);
    const [newSection, setNewSection] = useState("");

    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [sendingEmail, setSendingEmail] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleSendEmail = async () => {
        if (!emailSubject.trim() || !emailBody.trim()) return;
        setSendingEmail(true);
        try {
            await sendEmail({ to: instructor.email, subject: emailSubject, body: emailBody });
            setIsEmailOpen(false);
            setEmailSubject("");
            setEmailBody("");
        } catch (err) {
            showError(err.message);
        } finally {
            setSendingEmail(false);
        }
    };

    const loadInstructor = useCallback(async () => {
        try {
            const data = await fetchInstructorById(instructorId);
            setInstructor(data);
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    }, [instructorId]);

    const loadCourses = useCallback(async () => {
        try {
            const [instrCourses, tas] = await Promise.all([
                fetchInstructorCourses(instructorId),
                fetchInstructorTASections(instructorId),
            ]);
            setCourses(instrCourses);
            setTaSections(tas);
        } catch (err) {
            showError(err.message);
        }
    }, [instructorId]);

    useEffect(() => { loadInstructor(); }, [loadInstructor]);
    useEffect(() => { loadCourses(); }, [loadCourses]);

    const isTA = (instructor?.instructorRole || "").toLowerCase().includes("teaching assistant") || (instructor?.instructorRole || "").toLowerCase().includes("ta");

    const handleOpenSectionChange = async (item) => {
        setSectionChangeTarget(item);
        setNewSection(item.section || "");
        try {
            const sections = await fetchInstructorAvailableSections(instructorId, item._id || item.courseId);
            setAvailableSections(sections);
        } catch { setAvailableSections(["A", "B", "C", "D"]); }
    };

    const handleConfirmSection = async () => {
        if (!newSection || !sectionChangeTarget) return;
        try {
            await changeInstructorSection(instructorId, sectionChangeTarget._id || sectionChangeTarget.courseId, newSection);
            await loadCourses();
        } catch (err) {
            showError(err.message);
        }
        setSectionChangeTarget(null);
    };

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading instructor details...</p>
            </div>
        );
    }

    if (!instructor) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="sm" onClick={() => navigate("/admin/instructors")}>
                        <ArrowRightIcon className="w-4 h-4 rotate-180" /> Back
                    </Button>
                </div>
                <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">Instructor not found.</p>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-4 min-w-0">
                    <button
                        onClick={() => navigate("/admin/instructors")}
                        className="shrink-0 w-10 h-10 rounded-xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark flex items-center justify-center hover:bg-bg-surface-accent-default-light dark:hover:bg-bg-surface-accent-default-dark transition-colors"
                    >
                        <ArrowRightIcon className="w-5 h-5 rotate-180 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                    </button>
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="hidden sm:block w-14 h-14 rounded-2xl overflow-hidden bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark ring-2 ring-bg-surface-primary-default-light dark:ring-bg-surface-primary-default-dark shrink-0">
                            {instructor.profileImage ? (
                                <img src={instructor.profileImage} alt={instructor.fullName || instructor.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <UserIcon className="w-6 h-6 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                                {instructor.fullName || instructor.name}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-mono tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                    {instructor.instructorId}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => { setEmailSubject(""); setEmailBody(""); setIsEmailOpen(true); }}>
                        <EnvelopIcon className="w-4 h-4" />
                        <span className="hidden sm:inline"> Send Email</span>
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setIsEditOpen(true)}>
                        <FilePenIcon className="w-4 h-4" />
                        <span className="hidden sm:inline"> Edit</span>
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
                                    {instructor?.email}
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
                                    className="w-full px-4 py-2.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark focus:ring-2 focus:ring-border-accent-active-light dark:focus:ring-border-accent-active-dark focus:border-border-accent-active-light outline-none transition-all disabled:opacity-50 placeholder:text-text-secondary-default-light dark:placeholder:text-text-secondary-default-dark"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Message</label>
                                <TextArea
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    disabled={sendingEmail}
                                    placeholder="Write your message here..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark focus:ring-2 focus:ring-border-accent-active-light dark:focus:ring-border-accent-active-dark focus:border-border-accent-active-light outline-none transition-all disabled:opacity-50 placeholder:text-text-secondary-default-light dark:placeholder:text-text-secondary-default-dark"
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

            {activeTab === "info" && (
                <div className="space-y-6">
                    <div className="hidden sm:grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: "Department", value: instructor.departmentName || instructor.department || "—", color: "text-blue-500", icon: BookIcon },
                            { label: "Role", value: instructor.role || "—", color: "text-purple-500", icon: StarIcon },
                            { label: "Courses", value: courses.length, color: "text-amber-500", icon: CheckIcon },
                            { label: isTA ? "TA Sections" : "Status", value: isTA ? taSections.length : (instructor.status || "—"), color: "text-emerald-500", icon: CheckIcon },
                        ].map((stat) => (
                            <div key={stat.label} className="flex items-center gap-3 p-4 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{stat.label}</p>
                                    <p className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-2 flex flex-col items-center text-center p-6 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-gradient-to-b from-bg-surface-secondary-default-light to-bg-surface-primary-default-light dark:from-bg-surface-secondary-default-dark dark:to-bg-surface-primary-default-dark h-full">
                            <div className="relative mb-5">
                                <div className="w-36 h-36 rounded-2xl overflow-hidden bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark ring-4 ring-bg-surface-primary-default-light dark:ring-bg-surface-primary-default-dark shadow-xl shrink-0">
                                    {instructor.profileImage ? (
                                        <img src={instructor.profileImage} alt={instructor.fullName || instructor.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bg-surface-accent-default-light to-bg-surface-secondary-default-light dark:from-bg-surface-accent-default-dark dark:to-bg-surface-secondary-default-dark">
                                            <UserIcon className="w-14 h-14 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-[11px] font-bold text-text-accent-active-light dark:text-text-accent-active-dark shadow-sm">
                                    {instructor.instructorRole || "—"}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight text-text-primary-default-light dark:text-text-primary-default-dark line-clamp-2 px-2">
                                {instructor.fullName || instructor.name}
                            </h2>
                            <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark font-mono tracking-wider mt-2">
                                {instructor.instructorId}
                            </p>
                            <div className="w-full mt-auto pt-6">
                                <div className="grid grid-cols-2 gap-3 w-full">
                                    <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-3 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark">
                                        <span className="block text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Department</span>
                                        <span className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">{instructor.departmentName || instructor.department || "—"}</span>
                                    </div>
                                    <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-3 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark">
                                        <span className="block text-[10px] uppercase font-bold tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Specialization</span>
                                        <span className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">{instructor.specialization || instructor.specializationName || "—"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3 flex flex-col gap-4">
                            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden">
                                <div className="px-5 py-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark flex items-center gap-2">
                                    <StarIcon className="w-4 h-4 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Professional Information</h3>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                        <InfoField label="Department" value={instructor.departmentName || instructor.department} />
                                        <InfoField label="Role" value={instructor.instructorRole} />
                                        <InfoField label="Specialization" value={instructor.specialization || instructor.specializationName} />
                                        <InfoField label="Instructor Code" value={instructor.instructorCode} />
                                        <InfoField label="Nationality" value={instructor.nationality} />
                                        <InfoField label="Office" value={instructor.officeHoursRoomName} />
                                        <InfoField label="Status" value={instructor.status} />
                                        <InfoField label="Hire Date" value={instructor.hireDate ? new Date(instructor.hireDate).toLocaleDateString() : null} />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden">
                                <div className="px-5 py-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark flex items-center gap-2">
                                    <UserIcon className="w-4 h-4 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Contact Details</h3>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                        <InfoField label="Email" value={instructor.email} />
                                        <InfoField label="Phone" value={instructor.phoneNumber} />
                                        <InfoField label="National ID" value={instructor.nationalId} />
                                        <div className="space-y-0.5 sm:col-span-2">
                                            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">Address</span>
                                            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark break-words">{instructor.address || "—"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "courses" && (
                <div className="space-y-6">
                    {courses.length === 0 && taSections.length === 0 ? (
                        <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">No courses found.</p>
                    ) : (
                        <>
                                <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark overflow-hidden">
                                <div className="px-5 py-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark flex items-center gap-2">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark">Courses Taught</h3>
                                    <span className="ml-auto text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{courses.length} course{courses.length !== 1 ? "s" : ""}</span>
                                </div>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                                            <th className="text-left px-5 py-3 font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark">Course Name</th>
                                            <th className="text-left px-5 py-3 font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark">Section</th>
                                            <th className="text-left px-5 py-3 font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark">Semester</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-primary-default-light dark:divide-border-primary-default-dark">
                                        {courses.map((c) => (
                                            <tr key={c._id} className="hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark transition-colors">
                                                <td className="px-5 py-4 text-text-primary-default-light dark:text-text-primary-default-dark">{c.title}</td>
                                                <td className="px-5 py-4 text-text-primary-default-light dark:text-text-primary-default-dark">{c.section ?? "—"}</td>
                                                <td className="px-5 py-4 text-text-primary-default-light dark:text-text-primary-default-dark">{c.semester ?? "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {isTA && taSections.length > 0 && (
                                <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark overflow-hidden">
                                    <div className="px-5 py-3 bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark flex items-center gap-2">
                                        <StarIcon className="w-4 h-4 text-text-accent-active-light dark:text-text-accent-active-dark" />
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-text-accent-active-light dark:text-text-accent-active-dark">TA Section Assignments</h3>
                                        <span className="ml-auto text-xs text-text-accent-active-light dark:text-text-accent-active-dark">{taSections.length} section{taSections.length !== 1 ? "s" : ""}</span>
                                    </div>
                                    <div className="divide-y divide-border-primary-default-light dark:divide-border-primary-default-dark">
                                        {taSections.map((ta) => (
                                            <div key={ta._id} className="flex items-center justify-between px-5 py-4 hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark transition-colors">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="w-10 h-10 rounded-lg bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center shrink-0">
                                                        <StarIcon className="w-5 h-5 text-text-accent-active-light dark:text-text-accent-active-dark" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark truncate">{ta.courseTitle}</p>
                                                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{ta.courseCode}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0 ml-4">
                                                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark">
                                                        Section {ta.section}
                                                    </span>
                                                    <Button variant="secondary" size="sm" onClick={() => handleOpenSectionChange(ta)}>Change</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {isEditOpen && (
                <InstructorForm method="put" initialData={instructor} onClose={() => setIsEditOpen(false)} />
            )}

            {sectionChangeTarget && (
                <ModelOverlay onClose={() => setSectionChangeTarget(null)}>
                    <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-4">Change Section</h3>
                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2">
                            {sectionChangeTarget.courseTitle || sectionChangeTarget.title}
                        </p>
                        <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark mb-4">
                            Current: Section <strong>{sectionChangeTarget.section}</strong>
                        </p>
                        <select
                            value={newSection}
                            onChange={(e) => setNewSection(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-sm text-text-primary-default-light dark:text-text-primary-default-dark mb-4 outline-none focus:ring-2 focus:ring-border-accent-active-light dark:focus:ring-border-accent-active-dark"
                        >
                            <option value="">Select section...</option>
                            {availableSections.map((s) => (
                                <option key={s} value={s}>Section {s}</option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setSectionChangeTarget(null)}>Cancel</Button>
                            <Button variant="primary" onClick={handleConfirmSection} disabled={!newSection}>Confirm</Button>
                        </div>
                    </div>
                </ModelOverlay>
            )}
        </div>
    );
}
