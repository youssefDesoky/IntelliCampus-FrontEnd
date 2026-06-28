import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, useRouteLoaderData } from "react-router-dom";
import Section from "../../../../components/ui/Section";
import Button from "../../../../components/ui/Button";
import BaseComponent from "../../../../components/ui/BaseComponent";
import DateTimeInput from "../../../../components/form/DateTimeInput";
import { createMeeting, fetchCourseMeetings } from "../../../course/services/meetingsApi";
import MicIcon from "../../../../components/ui/icons/MicIcon";
import MicSlashIcon from "../../../../components/ui/icons/MicSlashIcon";
import VideoIcon from "../../../../components/ui/icons/VideoIcon";
import VideoSlashIcon from "../../../../components/ui/icons/VideoSlashIcon";
import CommentDotsIcon from "../../../../components/ui/icons/CommentDotsIcon";
import DesktopIcon from "../../../../components/ui/icons/DesktopIcon";
import VolumeIcon from "../../../../components/ui/icons/VolumeIcon";
import VolumeXIcon from "../../../../components/ui/icons/VolumeXIcon";
import PhoneSlashIcon from "../../../../components/ui/icons/PhoneSlashIcon";
import HandIcon from "../../../../components/ui/icons/HandIcon";
import RecordIcon from "../../../../components/ui/icons/RecordIcon";
import CalendarDaysIcon from "../../../../components/ui/icons/CalendarDaysIcon";
import CalendarCheckIcon from "../../../../components/ui/icons/CalendarCheckIcon";
import ClockIcon from "../../../../components/ui/icons/ClockIcon";
import CheckIcon from "../../../../components/ui/icons/CheckIcon";
import { useError } from '../../../../contexts/ErrorContext.jsx';


function ControlButton({ active, danger, onClick, label, children }) {
    const base = "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200";
    const state = danger
        ? "bg-red-600 hover:bg-red-700 text-white"
        : active
            ? "bg-white/20 text-white ring-2 ring-white/50"
            : "bg-white/10 hover:bg-white/20 text-white/80 hover:text-white";
    return (
        <button onClick={onClick} className={`${base} ${state} relative group`} title={label}>
            {children}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {label}
            </span>
        </button>
    );
}

function ControlDivider() {
    return <div className="w-px h-8 bg-white/10" />;
}

export default function MeetingRoom() {
    const user = useRouteLoaderData("root");
    const { course, courseId } = useOutletContext();
    const isInstructor = user?.roles?.some((r) => r === "Instructor");

    const [title, setTitle] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [creating, setCreating] = useState(false);
    const [activeMeeting, setActiveMeeting] = useState(null);
    const [isAudioMuted, setIsAudioMuted] = useState(true);
    const [isVideoMuted, setIsVideoMuted] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
    const [isHandRaised, setIsHandRaised] = useState(false);

    const { showError } = useError();
    const containerRef = useRef(null);
    const apiRef = useRef(null);

    const queryClient = useQueryClient();

    const { data: meetings = [], isLoading: loading } = useQuery({
        queryKey: ["courseMeetings", courseId],
        queryFn: () => fetchCourseMeetings(courseId),
        staleTime: 2 * 60 * 1000,
        enabled: !!courseId,
    });

    const initializeMeeting = () => {
        if (!activeMeeting) return;

        apiRef.current = new window.JitsiMeetExternalAPI("8x8.vc", {
            roomName: `vpaas-magic-cookie-10bb8c4440ce4318b582e5730279c2b6/${activeMeeting.roomName}`,
            parentNode: containerRef.current,
            configOverwrite: {
                startWithAudioMuted: true,
                startWithVideoMuted: true,
                prejoinPageEnabled: false,
                prejoinConfig: { enabled: false },
                disableDeepLinking: true,
                disableInviteFunctions: true,
                hideConferenceSubject: true,
                hideConferenceTimer: true
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [],
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                SHOW_BRAND_WATERMARK: false,
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
            },
            userInfo: {
                displayName: user?.fullName || (isInstructor ? "Instructor" : "Student")
            }
        });

        apiRef.current.addEventListener("audioMuteStatusChanged", (event) => {
            setIsAudioMuted(event.muted);
        });
        apiRef.current.addEventListener("videoMuteStatusChanged", (event) => {
            setIsVideoMuted(event.muted);
        });
        apiRef.current.addEventListener("readyToClose", () => {
            setActiveMeeting(null);
            setIsRecording(false);
            setIsChatOpen(false);
        });
        if (isInstructor) {
            apiRef.current.addEventListener("recordingStatusChanged", (event) => {
                setIsRecording(event.on);
            });
        }
    };

    useEffect(() => {
        if (!activeMeeting) return;

        if (!window.JitsiMeetExternalAPI) {
            const script = document.createElement("script");
            script.src = "https://8x8.vc/vpaas-magic-cookie-10bb8c4440ce4318b582e5730279c2b6/external_api.js";
            script.async = true;
            document.head.appendChild(script);
            script.onload = () => initializeMeeting();
        } else {
            initializeMeeting();
        }

        return () => {
            if (apiRef.current) {
                apiRef.current.dispose();
            }
        };
    }, [activeMeeting]);

    const handleCreate = async () => {
        if (!title || !dateTime) return;
        setCreating(true);
        try {
            const meeting = await createMeeting({
                title,
                dateTime: new Date(dateTime).toISOString(),
                courseId: parseInt(courseId),
            });
            setTitle("");
            setDateTime("");
            queryClient.invalidateQueries({ queryKey: ["courseMeetings", courseId] });
            setActiveMeeting(meeting);
        } catch (err) {
            showError("Failed to create meeting. Please try again.");
        } finally {
            setCreating(false);
        }
    };

    const handleJoin = (meeting) => {
        setActiveMeeting(meeting);
    };

    const handleEnd = () => {
        if (apiRef.current) {
            apiRef.current.executeCommand("hangup");
        }
    };

    const handleMute = () => apiRef.current?.executeCommand("toggleAudio");
    const handleVideo = () => apiRef.current?.executeCommand("toggleVideo");
    const handleScreenShare = () => apiRef.current?.executeCommand("toggleShareScreen");
    const handleChat = () => {
        apiRef.current?.executeCommand("toggleChat");
        setIsChatOpen((prev) => !prev);
    };
    const handleRecording = () => {
        if (isRecording) {
            apiRef.current?.executeCommand("stopRecording");
        } else {
            apiRef.current?.executeCommand("startRecording", { mode: "file" });
        }
    };
    const handleSpeaker = () => {
        setIsSpeakerMuted((prev) => !prev);
        apiRef.current?.executeCommand("toggleAudio");
    };
    const handleRaiseHand = () => {
        apiRef.current?.executeCommand("toggleRaiseHand");
        setIsHandRaised((prev) => !prev);
    };

    if (activeMeeting) {
        return (
            <div className="flex flex-col bg-gray-950 rounded-2xl overflow-hidden" style={{ minHeight: "500px", height: "calc(100vh - 280px)" }}>
                <div className="flex items-center justify-between px-6 py-3 bg-gray-900/80 backdrop-blur-sm border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-white font-medium text-sm">{activeMeeting.title}</span>
                        </div>
                        <span className="text-white/40 text-xs hidden sm:inline">|</span>
                        <span className="text-white/50 text-xs hidden sm:inline">{user?.fullName || (isInstructor ? "Instructor" : "Student")}</span>
                    </div>
                    {isRecording && (
                        <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-3 py-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-red-400 text-xs font-medium">REC</span>
                        </div>
                    )}
                </div>
                <div className="flex-1 relative bg-black">
                    <div ref={containerRef} className="w-full h-full" />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl">
                        <ControlButton
                            active={!isAudioMuted}
                            onClick={handleMute}
                            label={isAudioMuted ? "Unmute" : "Mute"}
                        >
                            {isAudioMuted ? <MicSlashIcon size={20} /> : <MicIcon size={20} />}
                        </ControlButton>
                        <ControlButton
                            active={!isSpeakerMuted}
                            onClick={handleSpeaker}
                            label={isSpeakerMuted ? "Open Sound" : "Close Sound"}
                        >
                            {isSpeakerMuted ? <VolumeXIcon size={20} /> : <VolumeIcon size={20} />}
                        </ControlButton>
                        <ControlButton
                            active={!isVideoMuted}
                            onClick={handleVideo}
                            label={isVideoMuted ? "Start Camera" : "Stop Camera"}
                        >
                            {isVideoMuted ? <VideoSlashIcon size={20} /> : <VideoIcon size={20} />}
                        </ControlButton>
                        <div className="hidden sm:contents">
                            <ControlDivider />
                            <ControlButton
                                onClick={handleScreenShare}
                                label="Share Screen"
                            >
                                <DesktopIcon size={20} />
                            </ControlButton>
                        </div>
                        <ControlButton
                            active={isChatOpen}
                            onClick={handleChat}
                            label="Chat"
                        >
                            <CommentDotsIcon size={20} />
                        </ControlButton>
                        {isInstructor ? (
                            <>
                                <ControlDivider />
                                <ControlButton
                                    active={isRecording}
                                    onClick={handleRecording}
                                    label={isRecording ? "Stop Recording" : "Record"}
                                >
                                    <RecordIcon size={20} />
                                </ControlButton>
                            </>
                        ) : (
                            <ControlButton
                                active={isHandRaised}
                                onClick={handleRaiseHand}
                                label={isHandRaised ? "Lower Hand" : "Raise Hand"}
                            >
                                <HandIcon size={20} />
                            </ControlButton>
                        )}
                        <ControlDivider />
                        <ControlButton
                            danger
                            onClick={handleEnd}
                            label="Leave Meeting"
                        >
                            <PhoneSlashIcon size={20} />
                        </ControlButton>
                    </div>
                </div>
            </div>
        );
    }

    const now = new Date();
    const activeMeetingsList = meetings.filter((m) => {
        const meetingTime = new Date(m.dateTime);
        const endTime = new Date(meetingTime.getTime() + 2 * 60 * 60 * 1000);
        return meetingTime <= now && now <= endTime;
    });
    const upcomingMeetings = meetings.filter((m) => new Date(m.dateTime) > now);
    const pastMeetings = meetings.filter((m) => new Date(m.dateTime) <= now && !activeMeetingsList.find(a => a.meetingId === m.meetingId));

    const stats = [
        { label: "Total Meetings", value: meetings.length, icon: <CalendarDaysIcon size={20} />, color: "text-text-accent-default-light dark:text-text-accent-default-dark" },
        { label: "Active", value: activeMeetingsList.length, icon: <VideoIcon size={20} />, color: "text-green-600 dark:text-green-400" },
        { label: "Upcoming", value: upcomingMeetings.length, icon: <ClockIcon size={20} />, color: "text-blue-600 dark:text-blue-400" },
        { label: "Past", value: pastMeetings.length, icon: <CheckIcon size={20} />, color: "text-text-tertiary-default-light dark:text-text-tertiary-default-dark" },
    ];

    const formatDateTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {isInstructor && (
                        <BaseComponent title="Schedule a New Meeting" contentClassName="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] items-end">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">
                                        Meeting Title
                                    </label>
                                    <input
                                        type="text" value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl px-4 py-2.5 text-text-primary-default-light dark:text-text-primary-default-dark placeholder-text-tertiary-default-light dark:placeholder-text-tertiary-default-dark focus:outline-none focus:ring-2 focus:ring-text-accent-default-light dark:focus:ring-text-accent-default-dark"
                                        placeholder="e.g. Week 5 Lecture"
                                    />
                                </div>
                                <DateTimeInput label="Date & Time" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
                                <Button
                                    onClick={handleCreate}
                                    disabled={!title || !dateTime || creating}
                                    loading={creating}
                                    loadingText="Scheduling"
                                    startIcon={<CalendarCheckIcon size={18} />}
                                    className="w-full sm:w-fit"
                                >
                                    Schedule & Start
                                </Button>
                            </div>
                        </BaseComponent>
                    )}

                    {!isInstructor && activeMeetingsList.length > 0 && (
                        <BaseComponent title="Live Now" contentClassName="space-y-3">
                            {activeMeetingsList.map((meeting) => (
                                <div
                                    key={meeting.meetingId}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bg-surface-green-default-light dark:bg-bg-surface-green-default-dark border border-green-500/30 rounded-xl p-4"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-green-100 dark:bg-green-900/30">
                                            <VideoIcon size={20} className="text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                                                {meeting.title}
                                            </h3>
                                            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                                Started at {new Date(meeting.dateTime).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="success" onClick={() => handleJoin(meeting)} startIcon={<VideoIcon size={16} />} className="w-full sm:w-fit">
                                        Join Now
                                    </Button>
                                </div>
                            ))}
                        </BaseComponent>
                    )}

                    <BaseComponent
                        title={isInstructor ? "Upcoming Meetings" : "Scheduled Meetings"}
                        contentClassName="space-y-3"
                    >
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="animate-pulse flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-xl p-4">
                                        <div className="w-10 h-10 shrink-0 rounded-full bg-bg-fill-tertiary-default-light dark:bg-bg-fill-tertiary-default-dark" />
                                        <div className="space-y-2 flex-1 w-full sm:w-auto">
                                            <div className="h-4 w-3/4 sm:w-48 bg-bg-fill-tertiary-default-light dark:bg-bg-fill-tertiary-default-dark rounded" />
                                            <div className="h-3 w-1/2 sm:w-32 bg-bg-fill-tertiary-default-light dark:bg-bg-fill-tertiary-default-dark rounded" />
                                        </div>
                                        <div className="h-9 w-full sm:w-20 bg-bg-fill-tertiary-default-light dark:bg-bg-fill-tertiary-default-dark rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        ) : meetings.length === 0 ? (
                            <div className="text-center py-10 border-2 border-dashed border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl">
                                <VideoSlashIcon size={48} className="mx-auto text-text-tertiary-default-light dark:text-text-tertiary-default-dark mb-3" />
                                <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark font-medium">
                                    No meetings scheduled yet
                                </p>
                                {isInstructor && (
                                    <p className="text-sm text-text-tertiary-default-light dark:text-text-tertiary-default-dark mt-1">
                                        Use the form above to schedule your first meeting
                                    </p>
                                )}
                            </div>
                        ) : upcomingMeetings.length === 0 && activeMeetingsList.length === 0 ? (
                            <div className="text-center py-10 border-2 border-dashed border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl">
                                <CalendarCheckIcon size={48} className="mx-auto text-text-tertiary-default-light dark:text-text-tertiary-default-dark mb-3" />
                                <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark font-medium">
                                    No upcoming meetings
                                </p>
                            </div>
                        ) : (
                            upcomingMeetings.map((meeting) => (
                                <div
                                    key={meeting.meetingId}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-xl p-4 hover:bg-bg-surface-secondary-hover-light dark:hover:bg-bg-surface-secondary-hover-dark transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark">
                                            <VideoIcon size={20} className="text-text-accent-active-light dark:text-text-accent-active-dark" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                                                {meeting.title}
                                            </h3>
                                            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark flex items-center gap-1.5 mt-0.5">
                                                <ClockIcon size={14} />
                                                {formatDateTime(meeting.dateTime)}
                                            </p>
                                        </div>
                                    </div>
                                    {isInstructor ? (
                                        <Button variant="primary" onClick={() => handleJoin(meeting)} startIcon={<VideoIcon size={16} />} className="w-full sm:w-fit">
                                            Start
                                        </Button>
                                    ) : (
                                        <span className="hidden sm:inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-semibold bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark text-blue-700 dark:text-blue-300">
                                            <ClockIcon size={12} />
                                            Scheduled
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </BaseComponent>

                    {isInstructor && pastMeetings.length > 0 && (
                        <BaseComponent title="Past Meetings" contentClassName="space-y-2">
                            {pastMeetings.map((meeting) => (
                                <div
                                    key={meeting.meetingId}
                                    className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-xl p-3 opacity-60 hover:opacity-80 transition-opacity"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-bg-fill-tertiary-default-light dark:bg-bg-fill-tertiary-default-dark">
                                            <CheckIcon size={16} className="text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <h3 className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark text-sm truncate">
                                                    {meeting.title}
                                                </h3>
                                                <span className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark shrink-0">Ended</span>
                                            </div>
                                            <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark flex items-center gap-1 mt-0.5">
                                                <ClockIcon size={12} />
                                                {formatDateTime(meeting.dateTime)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </BaseComponent>
                    )}
                </div>

                <div className="hidden lg:block space-y-6">
                    <BaseComponent title="Overview" contentClassName="space-y-3">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex items-center justify-between p-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-lg"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className={stat.color}>{stat.icon}</span>
                                    <span className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                        {stat.label}
                                    </span>
                                </div>
                                <span className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </BaseComponent>
                </div>
            </div>
        </Section>
    );
}
