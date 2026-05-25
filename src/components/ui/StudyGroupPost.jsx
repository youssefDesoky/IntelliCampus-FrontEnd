import ArrowUpIcon from "./icons/ArrowUpIcon";
import CommentIcon from "./icons/CommentIcon";
import SaveIcon from "./icons/SaveIcon";
import PinIcon from "./icons/PinIcon";
import ClockIcon from "./icons/ClockIcon";

function getSenderAvatar(postData) {
    return postData?.senderAvatar || postData?.profileImage || "/images/students/youssefAhmed/profile.png";
}

function formatDateLabel(value) {
    if (!value) {
        return "Just now";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

export default function StudyGroupPost({ className = "", postData, department = null }) {
    const commentsCount = postData?.comments?.length ?? 0;
    const senderAvatar = getSenderAvatar(postData);

    return (
        <li
            aria-label="study-group-post"
            className={`group relative overflow-hidden rounded-2xl border border-border-primary-default-light/60 dark:border-border-primary-default-dark/60 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${className}`}
        >
            {/* Left accent stripe */}
            <div className="absolute inset-y-0 left-0 w-0.75 bg-text-accent-default-light dark:bg-text-accent-default-dark" />

            <div className="py-5 pl-6 pr-5 sm:py-6 sm:pl-7 sm:pr-6">

                {/* Meta row */}
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <img
                            src={senderAvatar}
                            alt={postData?.sender || "Sender avatar"}
                            className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-bg-surface-primary-default-light dark:ring-bg-surface-primary-default-dark"
                        />

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="truncate text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                                    {postData?.sender}
                                </span>
                                {postData?.pinned && (
                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                        <PinIcon className="h-2.5 w-2.5" />
                                        Pinned
                                    </span>
                                )}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1 text-[11.5px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                                {department && (
                                    <>
                                        <span>{department}</span>
                                        <span className="opacity-40">·</span>
                                    </>
                                )}
                                <ClockIcon className="h-3 w-3" />
                                <span>{formatDateLabel(postData?.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Title + body */}
                <div className="mb-4">
                    <h4 className="text-[17px] font-semibold leading-snug text-text-primary-default-light dark:text-text-primary-default-dark">
                        {postData?.title}
                    </h4>
                    <p className="mt-1.5 line-clamp-3 text-[13.5px] leading-relaxed text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        {postData?.content}
                    </p>
                </div>

                {/* Attachments */}
                {postData?.attachments && postData.attachments.length > 0 && (
                    <div className="mb-4 grid gap-2 grid-cols-2 xs:grid-cols-3">
                        {postData.attachments.map((attachment) => (
                            <div
                                key={attachment.id}
                                className="overflow-hidden rounded-xl border border-border-primary-default-light/40 dark:border-border-primary-default-dark/40 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark hover:border-border-primary-default-light dark:hover:border-border-primary-default-dark transition-colors"
                            >
                                {attachment.preview && attachment.type.startsWith("image/") ? (
                                    <img
                                        src={attachment.preview}
                                        alt={attachment.name}
                                        className="h-20 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-20 w-full items-center justify-center bg-black/5 text-center dark:bg-white/5">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-[10px] font-bold text-text-tertiary-default-light dark:text-text-tertiary-default-dark uppercase truncate px-1">
                                                {attachment.name.split(".").pop()}
                                            </span>
                                            <span className="text-[9px] text-text-tertiary-default-light/60 dark:text-text-tertiary-default-dark/60 truncate px-1">
                                                {(attachment.size / 1024).toFixed(0)}KB
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Tags */}

                {/* Actions */}
                <div className="flex items-center border-t border-border-primary-default-light/60 pt-3 dark:border-border-primary-default-dark/60">
                    <button className="inline-flex items-center gap-1.5 py-1 text-[13px] font-medium text-text-tertiary-default-light transition-colors hover:text-text-accent-default-light dark:text-text-tertiary-default-dark dark:hover:text-text-accent-default-dark">
                        <ArrowUpIcon className="h-4 w-4" />
                        {postData?.likes ?? 0}
                    </button>

                    <div className="mx-3.5 h-3.5 w-px bg-border-primary-default-light/60 dark:bg-border-primary-default-dark/60" />

                    <button className="inline-flex items-center gap-1.5 py-1 text-[13px] font-medium text-text-tertiary-default-light transition-colors hover:text-text-accent-default-light dark:text-text-tertiary-default-dark dark:hover:text-text-accent-default-dark">
                        <CommentIcon className="h-4 w-4" />
                        {commentsCount}
                    </button>

                    <button className="ml-auto inline-flex items-center gap-1.5 py-1 text-[13px] font-medium text-text-tertiary-default-light transition-colors hover:text-text-accent-default-light dark:text-text-tertiary-default-dark dark:hover:text-text-accent-default-dark">
                        <SaveIcon className="h-4 w-4" />
                        Save
                    </button>
                </div>
            </div>
        </li>
    );
}