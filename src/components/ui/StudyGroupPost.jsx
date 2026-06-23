import { useState } from "react";
import ArrowUpIcon from "./icons/ArrowUpIcon";
import CommentIcon from "./icons/CommentIcon";

const CONTENT_PREVIEW_LENGTH = 240;

export default function StudyGroupPost({ className = "", postData, courseTitle = null, onUpvote, onAddComment, currentUserAvatar }) {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const content = postData.content || "";
    const isLongContent = content.length > CONTENT_PREVIEW_LENGTH;

    // Visual toggle only — actual like count still comes from postData.likes via the parent,
    // so this won't double-count. Wire up an `isUpvoted` prop instead if the backend tracks
    // per-user upvote state and you want this to persist across remounts.
    const handleUpvote = () => {
        setHasUpvoted((prev) => !prev);
        onUpvote?.();
    };

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (commentText.trim() && onAddComment) {
            onAddComment(commentText.trim());
            setCommentText("");
        }
    };

    return (
        <li
            aria-label="post-item"
            className={`flex flex-col gap-4 rounded-2xl p-5 sm:p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark transition-shadow duration-200 hover:shadow-sm ${className}`}
        >
            {/* Header */}
            <div aria-label="post-header" className="flex items-center gap-3">
                <img
                    src={postData.senderAvatar}
                    alt={postData.sender}
                    className="w-11 h-11 rounded-full shrink-0 object-cover ring-2 ring-border-primary-default-light dark:ring-border-primary-default-dark"
                />
                <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="font-semibold text-[15px] text-text-primary-default-light dark:text-text-primary-default-dark leading-tight">
                        {postData.sender}
                    </h3>
                    <div className="flex items-center gap-2 text-[13px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark min-w-0">
                        {courseTitle && (
                            <>
                                <span className="truncate max-w-[160px] sm:max-w-[220px] px-1.5 py-0.5 rounded-md bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark font-medium">
                                    {courseTitle}
                                </span>
                                <span className="w-1 h-1 rounded-full shrink-0 bg-text-tertiary-default-light dark:bg-text-tertiary-default-dark" />
                            </>
                        )}
                        <span className="shrink-0">{postData.createdAt}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div aria-label="post-content" className="flex flex-col gap-1.5">
                <p
                    className={`text-[15px] leading-relaxed text-text-secondary-default-light dark:text-text-secondary-default-dark whitespace-pre-wrap ${
                        isLongContent && !expanded ? "line-clamp-4" : ""
                    }`}
                >
                    {content}
                </p>
                {isLongContent && (
                    <button
                        type="button"
                        onClick={() => setExpanded((prev) => !prev)}
                        className="self-start text-[13px] font-medium text-text-accent-default-light dark:text-text-accent-default-dark hover:text-text-accent-active-light dark:hover:text-text-accent-active-dark transition-colors duration-150"
                    >
                        {expanded ? "Show less" : "Show more"}
                    </button>
                )}
            </div>

            {/* Actions */}
            <div
                aria-label="post-actions"
                className="flex items-center gap-2 border-t border-border-primary-default-light dark:border-border-primary-default-dark pt-2 -mb-1"
            >
                <button
                    onClick={handleUpvote}
                    aria-pressed={hasUpvoted}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 ${
                        hasUpvoted
                            ? "text-text-accent-active-light dark:text-text-accent-active-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark"
                            : "text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark"
                    }`}
                >
                    <ArrowUpIcon className="w-4 h-4" />
                    <span>{postData.likes}</span>
                </button>
                <button
                    onClick={() => setShowComments((prev) => !prev)}
                    aria-expanded={showComments}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 ${
                        showComments
                            ? "text-text-primary-default-light dark:text-text-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark"
                            : "text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark"
                    }`}
                >
                    <CommentIcon className="w-4 h-4" />
                    <span>{postData.comments?.length || 0}</span>
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${showComments ? "rotate-180" : ""}`}
                        aria-hidden="true"
                    >
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Comments — CSS-only height animation via grid-template-rows, no JS measuring needed */}
            <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ gridTemplateRows: showComments ? "1fr" : "0fr" }}
            >
                <div className="overflow-hidden">
                    <div className="flex flex-col gap-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark pt-3">
                        {(postData.comments || []).length > 0 ? (
                            <ul className="flex flex-col gap-2">
                                {postData.comments.map((comment, idx) => (
                                    <li key={comment.commentId || idx} className="flex items-start gap-2">
                                        <img
                                            src={comment.authorAvatar}
                                            alt={comment.authorName}
                                            className="w-7 h-7 rounded-full shrink-0 object-cover"
                                        />
                                        <div className="flex flex-col gap-0.5 rounded-2xl rounded-tl-sm bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark px-3 py-2 max-w-[85%]">
                                            <span className="text-[13px] font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                                                {comment.authorName || "Unknown"}
                                            </span>
                                            <span className="text-[14px] text-text-secondary-default-light dark:text-text-secondary-default-dark whitespace-pre-wrap">
                                                {comment.content}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-[13px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark text-center py-2">
                                No comments yet — start the conversation.
                            </p>
                        )}

                        {onAddComment && (
                            <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
                                <img
                                    src={currentUserAvatar}
                                    alt="You"
                                    className="w-7 h-7 rounded-full shrink-0 object-cover"
                                />
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="flex-1 px-4 py-2 rounded-full border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-sm text-text-primary-default-light dark:text-text-primary-default-dark placeholder:text-text-tertiary-default-light dark:placeholder:text-text-tertiary-default-dark focus:outline-none focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark transition-colors duration-150"
                                />
                                <button
                                    type="submit"
                                    disabled={!commentText.trim()}
                                    aria-label="Send comment"
                                    className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-white hover:bg-bg-surface-accent-hover-light dark:hover:bg-bg-surface-accent-hover-dark disabled:opacity-40 transition-colors duration-150"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
                                        <path d="M3 11l18-8-8 18-2-8-8-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
}