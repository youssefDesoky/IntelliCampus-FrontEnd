import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import BrandedQRCode from "../../../components/ui/BrandedQRCode";
import {
    UserIcon,
    UserTieIcon,
    MailIconDark,
    PhoneIcon,
    LocationDotIcon,
    HouseIcon,
    QRCodeIcon,
    ArrowRotateRightIcon,
    PenSquareIcon,
} from "../../../components/ui/icons";
import Button from "../../../components/ui/Button";
import { API_URL } from "../../../config/api";

export default function IdentityCard({ user, className = "" }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [qrImageSrc, setQrImageSrc] = useState(user.qrCode || "");
    const [isGeneratingQr, setIsGeneratingQr] = useState(false);
    const [qrError, setQrError] = useState("");
    const [isExpired, setIsExpired] = useState(false);
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        if (!isFlipped || countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setIsExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isFlipped, countdown]);

    const generateAttendanceQr = useCallback(async () => {
        if (isGeneratingQr) return;

        setIsGeneratingQr(true);
        setQrError("");
        setIsExpired(false);

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

            if (!qrPayload) {
                throw new Error("QR payload was not returned by server.");
            }

            const qrDataUrl = await QRCode.toDataURL(qrPayload, {
                width: 320,
                margin: 1,
            });

            setQrImageSrc(qrDataUrl);
            setCountdown(expiresInSeconds);
            setIsFlipped(true);
        } catch (error) {
            const errorMessage = error.message || "Failed to generate QR code.";
            setQrError(errorMessage);
        } finally {
            setIsGeneratingQr(false);
        }
    }, [isGeneratingQr]);

    return (
        <div className={`group perspective-distant h-full ${className}`}>
            <div
                className={`relative w-full h-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
                style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
                {/* FRONT: Profile Overview */}
                <div
                    className="group relative w-full h-full rounded-3xl border border-border-primary-default-light/70 dark:border-border-primary-default-dark/70 bg-bg-surface-primary-default-light/80 dark:bg-bg-surface-primary-default-dark/80 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {/* Header Cover */}
                    <div className="relative h-32 shrink-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-bg-fill-accent-default-light via-bg-fill-accent-active-light to-blue-950 transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl group-hover:scale-120 transition-transform duration-700 ease-out" />
                        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-blue-400/20 blur-3xl" />
                        <button
                            onClick={generateAttendanceQr}
                            disabled={isGeneratingQr}
                            className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark hover:bg-bg-surface-primary-hover-light dark:hover:bg-bg-surface-primary-hover-dark border border-border-primary-default-light dark:border-border-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark text-xs font-semibold transition-all shadow-sm"
                        >
                            <QRCodeIcon size={14} className={isGeneratingQr ? "animate-spin" : ""} />
                            <span>{isGeneratingQr ? "Generating..." : "QR Check-In"}</span>
                        </button>
                    </div>

                    {/* Avatar + Identity */}
                    <div className="relative -mt-14 px-6 z-10">
                        <div className="flex items-end gap-4">
                            <div className="relative shrink-0">
                                <div className="w-24 h-24 rounded-2xl p-[2px] bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-xl">
                                    <div className="w-full h-full rounded-2xl overflow-hidden bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                                        <img src={user.avatar} alt={`${user.name}'s profile avatar`} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                            <div className="pb-2 min-w-0 flex-1">
                                <h2 className="text-xl font-extrabold tracking-tight truncate text-text-primary-default-light dark:text-text-primary-default-dark">
                                    {user.name}
                                </h2>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <UserTieIcon size={12} className="text-text-accent-default-light dark:text-text-accent-default-dark shrink-0" />
                                    <p className="text-xs font-semibold truncate text-text-accent-default-light dark:text-text-accent-default-dark">
                                        {user.specialization}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Data */}
                    <div className="px-6 mt-4 flex-1 flex flex-col justify-center space-y-3">
                        <div className="flex items-center gap-2.5 text-sm">
                            <HouseIcon size={14} className="text-text-accent-default-light dark:text-text-accent-default-dark shrink-0" />
                            <span className="text-text-primary-default-light dark:text-text-primary-default-dark font-medium">{user.faculty}</span>
                            <span className="w-1 h-1 rounded-full bg-text-tertiary-default-light dark:bg-text-tertiary-default-dark" />
                            <span className="text-text-tertiary-default-light dark:text-text-tertiary-default-dark">Since {user.studentSince}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm">
                            <MailIconDark size={14} className="text-text-accent-default-light dark:text-text-accent-default-dark shrink-0" />
                            <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm">
                            <PhoneIcon size={14} className="text-text-accent-default-light dark:text-text-accent-default-dark shrink-0" />
                            <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark">{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm">
                            <LocationDotIcon size={14} className="text-text-accent-default-light dark:text-text-accent-default-dark shrink-0" />
                            <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark">{user.address}</span>
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="pt-4 pb-5 px-6 mt-2">
                        <Button
                            variant="primary"
                            width="w-full"
                            className="rounded-xl h-10 text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <PenSquareIcon size={13} />
                            Edit Profile Details
                        </Button>
                    </div>
                </div>

                {/* BACK: QR Code */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark overflow-hidden shadow-xl rotate-y-180 flex flex-col"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="relative flex-1 flex flex-col p-8 bg-linear-to-b from-bg-surface-primary-default-light dark:from-bg-surface-primary-default-dark to-bg-surface-secondary-default-light dark:to-bg-surface-secondary-default-dark">
                        <button
                            onClick={() => setIsFlipped(false)}
                            className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark hover:bg-bg-surface-primary-hover-light dark:hover:bg-bg-surface-primary-hover-dark border border-border-primary-default-light dark:border-border-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark text-xs font-semibold transition-all"
                        >
                            <UserIcon size={14} />
                            <span>Show Profile</span>
                        </button>

                        <div className="text-left">
                            <h3 className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">Attendance QR Code</h3>
                            <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1">Scan this code at the attendance gate to check in</p>
                        </div>

                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-72 h-72 rounded-3xl bg-white shadow-lg border border-zinc-100 flex items-center justify-center relative overflow-hidden">
                                <BrandedQRCode token={qrImageSrc || user.qrCode} />
                                {isExpired && (
                                    <button
                                        type="button"
                                        onClick={generateAttendanceQr}
                                        disabled={isGeneratingQr}
                                        className="absolute inset-0 rounded-3xl bg-white/40 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-colors hover:bg-white/30 dark:hover:bg-black/30"
                                    >
                                        <ArrowRotateRightIcon size={50} className="text-white text-sm scale-x-[-1]" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {qrError && (
                            <p className="mt-3 text-xs text-red-500 text-center">{qrError}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
