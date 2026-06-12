import { useState, useEffect, useRef, useCallback } from "react";
import { useOutletContext, useRouteLoaderData } from "react-router-dom";
import Section from "../../../../components/ui/Section";
import { fetchCourseMeetings, createMeeting } from "../../../course/services/meetingsApi";
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
    const isInstructor = user?.role === "instructor" || user?.role === "Instructor";

    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const containerRef = useRef(null);
    const apiRef = useRef(null);

    const loadMeetings = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchCourseMeetings(courseId);
            setMeetings(data);
        } catch (err) {
            console.error("Failed to load meetings:", err);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        loadMeetings();
    }, [loadMeetings]);

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
            await loadMeetings();
            setActiveMeeting(meeting);
        } catch (err) {
            console.error("Failed to create meeting:", err);
            alert("Failed to create meeting. Please try again.");
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
                        <ControlDivider />
                        <ControlButton
                            onClick={handleScreenShare}
                            label="Share Screen"
                        >
                            <DesktopIcon size={20} />
                        </ControlButton>
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

    return (
        <Section>
            <div className="space-y-6">
                {isInstructor && (
                    <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark mb-4">
                            <i className="fas fa-plus-circle mr-2 text-text-accent-default-light dark:text-text-accent-default-dark"></i>
                            Schedule a New Meeting
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] items-end">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Meeting Title</label>
                                <input
                                    type="text" value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl px-4 py-2.5 text-text-primary-default-light dark:text-text-primary-default-dark placeholder-text-tertiary-default-light dark:placeholder-text-tertiary-default-dark focus:outline-none focus:ring-2 focus:ring-text-accent-default-light dark:focus:ring-text-accent-default-dark"
                                    placeholder="e.g. Week 5 Lecture"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Date & Time</label>
                                <input
                                    type="datetime-local" value={dateTime}
                                    onChange={(e) => setDateTime(e.target.value)}
                                    className="w-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl px-4 py-2.5 text-text-primary-default-light dark:text-text-primary-default-dark focus:outline-none focus:ring-2 focus:ring-text-accent-default-light dark:focus:ring-text-accent-default-dark"
                                />
                            </div>
                            <button
                                onClick={handleCreate}
                                disabled={!title || !dateTime || creating}
                                className="bg-text-accent-default-light dark:bg-text-accent-default-dark text-white px-6 py-2.5 rounded-xl hover:bg-text-accent-hover-light dark:hover:bg-text-accent-hover-dark disabled:opacity-50 transition-all flex items-center gap-2 whitespace-nowrap"
                            >
                                <i className="fas fa-calendar-plus"></i>
                                {creating ? "Scheduling..." : "Schedule & Start"}
                            </button>
                        </div>
                    </div>
                )}

                {!isInstructor && activeMeetingsList.length > 0 && (
                    <div className="bg-bg-surface-green-default-light dark:bg-bg-surface-green-default-dark border border-green-500/30 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark mb-4">
                            <i className="fas fa-circle text-green-500 mr-2 animate-pulse"></i>
                            Live Now
                        </h2>
                        <div className="space-y-3">
                            {activeMeetingsList.map((meeting) => (
                                <div key={meeting.meetingId} className="flex items-center justify-between bg-white/50 dark:bg-white/10 rounded-xl p-4">
                                    <div>
                                        <h3 className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{meeting.title}</h3>
                                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                            Started at {new Date(meeting.dateTime).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleJoin(meeting)}
                                        className="bg-green-500 text-white px-6 py-2.5 rounded-xl hover:bg-green-600 transition-all flex items-center gap-2 font-semibold"
                                    >
                                        <i className="fas fa-sign-in-alt"></i>
                                        Join Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark mb-4">
                        <i className="fas fa-video mr-2 text-green-500"></i>
                        {isInstructor ? "Upcoming Meetings" : "Scheduled Meetings"}
                    </h2>
                    {loading ? (
                        <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading meetings...</p>
                    ) : meetings.length === 0 ? (
                        <div className="text-center py-8 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            <i className="fas fa-video-slash text-3xl mb-2"></i>
                            <p>No meetings scheduled for this course yet.</p>
                        </div>
                    ) : upcomingMeetings.length === 0 && activeMeetingsList.length === 0 ? (
                        <div className="text-center py-8 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            <i className="fas fa-calendar-check text-3xl mb-2"></i>
                            <p>No upcoming meetings.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcomingMeetings.map((meeting) => (
                                <div key={meeting.meetingId} className="flex items-center justify-between bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-xl p-4">
                                    <div>
                                        <h3 className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{meeting.title}</h3>
                                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                            <i className="fas fa-clock mr-1"></i>
                                            {new Date(meeting.dateTime).toLocaleString()}
                                        </p>
                                    </div>
                                    {isInstructor ? (
                                        <button
                                            onClick={() => handleJoin(meeting)}
                                            className="bg-green-500 text-white px-5 py-2 rounded-xl hover:bg-green-600 transition-all flex items-center gap-2"
                                        >
                                            <i className="fas fa-sign-in-alt"></i>
                                            Start
                                        </button>
                                    ) : (
                                        <span className="text-xs bg-text-accent-default-light dark:bg-text-accent-default-dark text-white px-3 py-1.5 rounded-full">
                                            Scheduled
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {isInstructor && pastMeetings.length > 0 && (
                    <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark mb-4">
                            <i className="fas fa-history mr-2 text-text-tertiary-default-light dark:text-text-tertiary-default-dark"></i>
                            Past Meetings
                        </h2>
                        <div className="space-y-2">
                            {pastMeetings.map((meeting) => (
                                <div key={meeting.meetingId} className="flex items-center justify-between bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-xl p-3 opacity-70">
                                    <div>
                                        <h3 className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{meeting.title}</h3>
                                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                            {new Date(meeting.dateTime).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">Ended</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
}
