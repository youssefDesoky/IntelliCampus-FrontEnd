import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowUpIcon from "./icons/ArrowUpIcon";
import CommentIcon from "./icons/CommentIcon";

const CONTENT_PREVIEW_LENGTH = 240;

export default function StudyGroupPost({ className = "", postData, courseId, courseTitle = null, onUpvote }) {
    const navigate = useNavigate();
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const content = postData.content || "";
    const isLongContent = content.length > CONTENT_PREVIEW_LENGTH;

    const handleUpvote = () => {
        setHasUpvoted((prev) => !prev);
        onUpvote?.();
    };

    return (
        <li
            aria-label="post-item"
            className={`flex flex-col gap-4 rounded-2xl p-5 sm:p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark transition-shadow duration-200 hover:shadow-sm ${className}`}
        >
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
                    onClick={() => navigate(`/courses/${courseId}/community/questions/${postData.id}`)}
                    className="px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark transition-colors duration-150"
                >
                    <CommentIcon className="w-4 h-4" />
                    <span>{postData.comments?.length || 0}</span>
                </button>
            </div>
        </li>
    );
}