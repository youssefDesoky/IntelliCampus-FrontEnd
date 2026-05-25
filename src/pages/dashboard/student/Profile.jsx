import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import MaterialPreview from "../../../components/ui/MaterialPreview";
import {
    UserIcon,
    BookIcon,
    CalendarDaysIcon,
    CalendarCheckIcon,
    MailIconDark,
    HashIcon,
    EyeIcon,
    DownloadIcon,
    XIcon,
    QRCodeIcon,
    StarIcon,
    KeyIcon,
    SignOutIcon,
    BellIconDark,
    BellSlashIconLight,
} from "../../../components/ui/icons";
import Button from "../../../components/ui/Button";
import { API_URL } from "../../../config/api";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const userData = {
    name: "Youssef Desoky",
    specialization: "Information Systems",
    faculty: "Faculty of Computers and Information",
    avatar: "/images/students/youssefDesoky/profile.png",
    qrCode: "/images/students/youssefDesoky/attendance-qr.png",
    gpa: "3.8",
    attendance: "95%",
    rank: "Top 5%",
    year: "Senior",
};

const academicInfo = [
    { name: "studentId",      label: "Student ID",     value: "S12345678",                      icon: HashIcon },
    { name: "specialization", label: "Specialization", value: "Information Systems",             icon: BookIcon },
    { name: "year",           label: "Academic Year",  value: "Senior – 4th Year",               icon: CalendarDaysIcon },
    { name: "semester",       label: "Semester",       value: "Spring 2026",                    icon: CalendarDaysIcon },
    { name: "email",          label: "Email",          value: "youssef.desoky@intelicampus.edu", icon: MailIconDark },
    { name: "phone",          label: "Phone",          value: "+20 10 2345 6789",               icon: UserIcon },
    { name: "bylaw",          label: "Bylaw",          value: "Student Bylaw 2026",              icon: BookIcon },
];

const performanceStats = [
    { label: "Cumulative GPA",   value: "3.8 / 4.0", trend: "+0.2 this term", positive: true },
    { label: "Attendance Rate",  value: "95%",        trend: "Above average",  positive: true },
    { label: "Class Rank",       value: "Top 5%",     trend: "12 / 240",       positive: true },
    { label: "Credits Earned",   value: "118 / 130",  trend: "12 remaining",   positive: null },
];

const profilePreferences = [
    { id: "email", label: "Email", enabled: true },
    { id: "notifications", label: "Notifications", enabled: false },
    { id: "push", label: "Push notifications", enabled: false },
];

const bylawDocumentUrl = "/documents/san3aa_documentation.pdf";

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

/** Left card — photo, identity, QR */
function IdentityCard({ user, className = "" }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [qrImageSrc, setQrImageSrc] = useState(user.qrCode || "");
    const [isGeneratingQr, setIsGeneratingQr] = useState(false);
    const [qrError, setQrError] = useState("");
    const [qrIteration, setQrIteration] = useState(0);
    const [isQrFinalIteration, setIsQrFinalIteration] = useState(false);

    useEffect(() => {
        if (!isFlipped || countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => Math.max(prev - 1, 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [isFlipped, countdown]);

    const generateAttendanceQr = useCallback(async ({ force = false } = {}) => {
        if (isGeneratingQr) return;
        if (isQrFinalIteration && !force) return;

        setIsGeneratingQr(true);
        setQrError("");
        if (force) {
            setIsQrFinalIteration(false);
        }

        try {
            const response = await fetch(`${API_URL}/api/attendance/qr`, {
                credentials: "include",
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || `Failed to generate attendance QR (${response.status})`);
            }

            const data = await response.json();
            const qrPayload = data.qrPayload ?? data.QrPayload;
            const expiresInSeconds = data.expiresInSeconds ?? data.ExpiresInSeconds ?? 15;
            const iteration = data.iteration ?? data.Iteration ?? 1;
            const isFinal = data.isFinal ?? data.IsFinal ?? iteration >= 4;

            if (!qrPayload) {
                throw new Error("QR payload was not returned by server.");
            }

            const qrDataUrl = await QRCode.toDataURL(qrPayload, {
                width: 320,
                margin: 1,
            });

            setQrImageSrc(qrDataUrl);
            setCountdown(expiresInSeconds);
            setQrIteration(iteration);
            setIsQrFinalIteration(Boolean(isFinal));
            setIsFlipped(true);
        } catch (error) {
            const errorMessage = error.message || "Failed to generate QR code.";
            setQrError(errorMessage);
            if (errorMessage.toLowerCase().includes("refresh limit")) {
                setIsQrFinalIteration(true);
            }
        } finally {
            setIsGeneratingQr(false);
        }
    }, [isGeneratingQr, isQrFinalIteration]);

    useEffect(() => {
        if (!isFlipped || countdown !== 0 || isGeneratingQr || isQrFinalIteration) return;
        generateAttendanceQr();
    }, [countdown, generateAttendanceQr, isFlipped, isGeneratingQr, isQrFinalIteration]);

    const stats = [
        { label: "GPA", value: user.gpa, icon: StarIcon },
        { label: "Attendance", value: user.attendance, icon: CalendarCheckIcon },
        { label: "Year", value: user.year || "Senior", icon: BookIcon },
    ];

    return (
        <div className={`group perspective-distant h-full ${className}`}>
            <div
                className={`relative w-full h-full transition-all duration-700 ease-in-out preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
                style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
                {/* FRONT: Profile Overview */}
                <div
                    className="relative w-full h-full backface-hidden rounded-3xl border border-border-primary-default-light/80 dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light/95 dark:bg-bg-surface-secondary-default-dark/95 overflow-hidden shadow-xl flex flex-col"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {/* Profile Content */}
                    <div className="px-6 pb-6 pt-6 flex-1 flex flex-col">
                        <button
                            onClick={() => generateAttendanceQr({ force: true })}
                            disabled={isGeneratingQr}
                            className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark hover:bg-bg-surface-primary-hover-light dark:hover:bg-bg-surface-primary-hover-dark border border-border-primary-default-light dark:border-border-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark text-xs font-semibold transition-all shadow-sm"
                        >
                            <QRCodeIcon size={15} />
                            <span>{isGeneratingQr ? "Generating..." : "Show QR"}</span>
                        </button>

                        <div className="relative mb-4 flex items-end gap-4 pr-24">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl ring-4 ring-bg-surface-secondary-default-light dark:ring-bg-surface-secondary-default-dark overflow-hidden shadow-lg bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-[3px] border-bg-surface-secondary-default-light dark:border-bg-surface-secondary-default-dark" />
                            </div>
                            <div className="pb-1 min-w-0">
                                <h2 className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark truncate">{user.name}</h2>
                                <p className="text-sm font-medium text-text-accent-default-light dark:text-text-accent-default-dark truncate">{user.specialization}</p>
                            </div>
                        </div>

                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-4">{user.faculty}</p>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {stats.map((stat) => (
                                <div key={stat.label} className="flex flex-col items-center p-3 rounded-2xl bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:border-border-accent-default-light dark:hover:border-border-accent-default-dark transition-colors">
                                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-accent-active-light dark:text-text-accent-active-dark mb-2 shadow-sm">
                                        <stat.icon size={16} />
                                    </div>
                                    <div className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark leading-none">{stat.value}</div>
                                    <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <Button variant="primary" width="w-full" className="rounded-xl h-11 shadow-sm">
                            Edit Profile Details
                        </Button>

                    </div>
                </div>

                {/* BACK: QR Code */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark overflow-hidden shadow-xl rotate-y-180 flex flex-col"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="relative flex-1 flex flex-col items-center justify-center p-8 bg-linear-to-b from-bg-surface-primary-default-light dark:from-bg-surface-primary-default-dark to-bg-surface-secondary-default-light dark:to-bg-surface-secondary-default-dark">
                        <button
                            onClick={() => setIsFlipped(false)}
                            className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark hover:bg-bg-surface-primary-hover-light dark:hover:bg-bg-surface-primary-hover-dark border border-border-primary-default-light dark:border-border-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark text-xs font-semibold transition-all"
                        >
                            <UserIcon size={16} />
                            <span>Show Profile</span>
                        </button>

                        <div className="w-52 h-52 rounded-3xl bg-white p-4 shadow-lg mb-6 border border-zinc-100">
                            <img src={qrImageSrc || user.qrCode} alt="Attendance QR Code" className="w-full h-full object-contain" />
                        </div>

                        <h3 className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark mb-1">Attendance Check-in</h3>
                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark text-center mb-4">
                            Present this code at the lecture hall entrance
                        </p>

                        {qrIteration > 0 && (
                            <p className="text-[11px] text-text-secondary-default-light dark:text-text-secondary-default-dark mb-3">
                                Iteration {qrIteration}/4
                            </p>
                        )}

                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark">
                            <QRCodeIcon size={14} className="text-text-accent-active-light dark:text-text-accent-active-dark animate-spin" style={{ animationDuration: "3s" }} />
                            <span className="text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                Refreshes in <span className="text-text-accent-active-light dark:text-text-accent-active-dark font-bold">{countdown}s</span>
                            </span>
                        </div>

                        {qrError && (
                            <p className="mt-3 text-xs text-red-500 text-center">{qrError}</p>
                        )}

                        {countdown === 0 && isQrFinalIteration && (
                            <button
                                type="button"
                                onClick={() => generateAttendanceQr({ force: true })}
                                disabled={isGeneratingQr}
                                className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark text-xs font-semibold hover:bg-bg-surface-primary-hover-light dark:hover:bg-bg-surface-primary-hover-dark transition-colors"
                            >
                                <QRCodeIcon size={14} />
                                {isGeneratingQr ? "Refreshing..." : "Refresh QR"}
                            </button>
                        )}

                        {countdown === 0 && !isQrFinalIteration && (
                            <p className="mt-3 text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                Generating next QR...
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AccountControlsCard({ className = "" }) {
    const [preferences, setPreferences] = useState(
        profilePreferences.reduce((accumulator, item) => {
            accumulator[item.id] = item.enabled;
            return accumulator;
        }, {})
    );

    const togglePreference = (preferenceId) => {
        setPreferences((current) => ({
            ...current,
            [preferenceId]: !current[preferenceId],
        }));
    };

    return (
        <div className={`rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark overflow-hidden shadow-xl ${className}`}>
            <div className="px-6 py-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-linear-to-r from-bg-surface-secondary-default-light to-bg-surface-primary-default-light dark:from-bg-surface-secondary-default-dark dark:to-bg-surface-primary-default-dark">
                <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                    Account Controls
                </p>
                <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1">
                    Manage contact and security preferences.
                </p>
            </div>

            <div className="p-5">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {profilePreferences.map(({ id, label }) => (
                    <div key={id} className="flex items-center justify-between rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light px-3.5 py-2.5 dark:bg-bg-surface-primary-default-dark">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-semibold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                                {label}
                            </span>
                        </div>

                        <label htmlFor={id} className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                id={id}
                                className="peer sr-only"
                                checked={preferences[id]}
                                onChange={() => togglePreference(id)}
                            />
                            <div className="h-5 w-9 rounded-full bg-bg-fill-secondary-default-light transition-colors peer-checked:bg-bg-fill-accent-default-light peer-focus:outline-none dark:bg-bg-fill-secondary-default-dark dark:peer-checked:bg-bg-fill-accent-default-dark after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-bg-fill-primary-default-light after:transition-transform after:content-[''] peer-checked:after:translate-x-4 dark:after:bg-bg-fill-primary-default-dark" />
                        </label>
                    </div>
                    ))}
                </div>
            </div>

            <div className="px-5 pb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-primary-default-light px-4 py-2.5 text-xs font-semibold text-text-primary-default-light transition-colors hover:bg-bg-surface-secondary-default-light dark:border-border-primary-default-dark dark:text-text-primary-default-dark dark:hover:bg-bg-surface-secondary-default-dark">
                    <KeyIcon size={14} />
                    Reset Password
                </button>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/40 dark:bg-red-950/10 px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20">
                    <SignOutIcon size={14} />
                    Logout
                </button>
            </div>
        </div>
    );
}

/** Academic info grid — right-top */
function AcademicInfoCard({ fields }) {
    const [isBylawOpen, setIsBylawOpen] = useState(false);

    return (
        <>
            <div className="rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-linear-to-r from-bg-surface-secondary-default-light to-bg-surface-primary-default-light dark:from-bg-surface-secondary-default-dark dark:to-bg-surface-primary-default-dark">
                    <div>
                        <h3 className="text-sm font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                            Academic Registration
                        </h3>
                        <p className="text-[11px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark mt-0.5">
                            Verified enrollment data · Spring 2026
                        </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-400/10 text-green-500 border border-green-400/20">
                        Active
                    </span>
                </div>

                {/* Fields */}
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {fields.map((field) => {
                        const Icon = field.icon;
                        const isBylaw = field.name === "bylaw";

                        return (
                            <div
                                key={field.name}
                                className={`flex items-center gap-3.5 p-3.5 rounded-2xl bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:border-border-accent-default-light dark:hover:border-border-accent-default-dark transition-all group ${isBylaw ? "sm:col-span-2" : ""}`}
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-accent-active-light dark:text-text-accent-active-dark group-hover:scale-105 transition-transform">
                                    <Icon size={15} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                                        {field.label}
                                    </p>
                                    <p className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mt-0.5 truncate">
                                        {field.value}
                                    </p>
                                </div>

                                {isBylaw && (
                                    <button
                                        type="button"
                                        onClick={() => setIsBylawOpen(true)}
                                        className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-text-accent-active-light dark:hover:text-text-accent-active-dark transition-colors"
                                        aria-label="Open bylaw"
                                    >
                                        <EyeIcon size={16} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {isBylawOpen && (
                <ModelOverlay onClose={() => setIsBylawOpen(false)} maxWidth="max-w-5xl">
                    <div className="w-full overflow-hidden rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-xl">
                        <div className="flex items-center justify-between border-b border-border-primary-default-light dark:border-border-primary-default-dark px-5 py-4">
                            <div>
                                <h4 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Student Bylaw</h4>
                                <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-0.5">Policy document preview</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={bylawDocumentUrl}
                                    download
                                    className="inline-flex items-center gap-2 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark px-3.5 py-2 text-xs font-semibold text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark transition-colors"
                                >
                                    <DownloadIcon size={14} />
                                    Download
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setIsBylawOpen(false)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark transition-colors"
                                    aria-label="Close bylaw preview"
                                >
                                    <XIcon size={14} />
                                </button>
                            </div>
                        </div>

                        <MaterialPreview
                            type={0}
                            title="student-bylaw.pdf"
                            viewUrl={bylawDocumentUrl}
                            downloadUrl={bylawDocumentUrl}
                        />
                    </div>
                </ModelOverlay>
            )}
        </>
    );
}

/** Performance stats list — right-bottom (like the "bills" section in the image) */
function PerformanceCard({ stats }) {
    return (
        <div className="rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-linear-to-r from-bg-surface-secondary-default-light to-bg-surface-primary-default-light dark:from-bg-surface-secondary-default-dark dark:to-bg-surface-primary-default-dark">
                <div>
                    <h3 className="text-sm font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                        Academic Performance
                    </h3>
                    <p className="text-[11px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark mt-0.5">
                        Current standing · cumulative
                    </p>
                </div>
                <button className="text-[11px] font-semibold text-text-accent-active-light dark:text-text-accent-active-dark hover:underline">
                    Full transcript
                </button>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-4 hover:border-border-accent-default-light dark:hover:border-border-accent-default-dark transition-colors group"
                    >
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <span
                                    className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1 ${
                                        stat.positive === true
                                            ? "bg-green-400"
                                            : stat.positive === false
                                            ? "bg-red-400"
                                            : "bg-text-tertiary-default-light dark:bg-text-tertiary-default-dark opacity-40"
                                    }`}
                                />
                                <div className="min-w-0">
                                    <span className="block text-[11px] font-bold uppercase tracking-wider text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                                        {stat.label}
                                    </span>
                                    <span className="block text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark leading-tight">
                                        {stat.value}
                                    </span>
                                </div>
                            </div>

                            <span
                                className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                    stat.positive === true
                                        ? "bg-green-400/10 text-green-500 border border-green-400/20"
                                        : stat.positive === false
                                        ? "bg-red-400/10 text-red-400 border border-red-400/20"
                                        : "bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark"
                                }`}
                            >
                                {stat.trend}
                            </span>
                        </div>

                        <div className="h-1.5 rounded-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark overflow-hidden">
                            <div
                                className={`h-full rounded-full ${
                                    stat.positive === true
                                        ? "bg-linear-to-r from-emerald-400 to-emerald-600"
                                        : stat.positive === false
                                        ? "bg-linear-to-r from-red-400 to-red-600"
                                        : "bg-linear-to-r from-bg-fill-accent-default-light to-bg-surface-info-active-light dark:from-bg-fill-accent-default-dark dark:to-bg-surface-info-active-dark"
                                }`}
                                style={{ width: stat.positive === null ? "52%" : stat.positive === true ? "84%" : "38%" }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function Profile() {
    return (
        <div className="px-4 lg:px-8 py-6 space-y-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Two-column layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-stretch">
                    {/* LEFT — identity, stretches to full height of right column */}
                    <div className="flex h-full flex-col gap-6 lg:sticky lg:top-6 self-start">
                        <IdentityCard user={userData} className="flex-1 min-h-0" />
                        <AccountControlsCard className="shrink-0" />
                    </div>

                    {/* RIGHT — info + performance */}
                    <div className="flex h-full flex-col gap-6">
                        <AcademicInfoCard fields={academicInfo} />
                        <PerformanceCard stats={performanceStats} />
                    </div>
                </div>
            </div>
        </div>
    );
}