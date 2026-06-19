import { useState } from "react";
import ArrowUpIcon from "./icons/ArrowUpIcon";
import CommentIcon from "./icons/CommentIcon";

export default function CommunityPost({ className, postData, courseTitle = null, onUpvote, onAddComment }) {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (commentText.trim() && onAddComment) {
            onAddComment(commentText);
            setCommentText("");
        }
    };

    return (
        <li aria-label="post-item" className={`flex flex-col gap-4 rounded-lg p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark ${className}`}>
            <div aria-label="post-header" className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full shrink-0 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                    {postData.sender?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-[16px]">{postData.sender}</h3>
                    <div className="flex items-center gap-1 text-sm text-text-tertiary-default-light dark:text-text-tertiary-default-dark min-w-0">
                        {courseTitle && (
                            <>
                                <span className="truncate block max-w-[60%]">Posted in {courseTitle}</span>
                                <span className="w-1 h-1 rounded-full my-auto mx-1 bg-text-tertiary-default-light dark:bg-text-tertiary-default-dark" />
                            </>
                        )}
                        <span>{postData.createdAt}</span>
                    </div>
                </div>
            </div>

            <div aria-label="post-content" className="flex flex-col gap-3">
                <p className="text-[16px] text-text-secondary-default-light dark:text-text-secondary-default-dark whitespace-pre-wrap">{postData.content}</p>
            </div>

            <div aria-label="post-actions" className="flex gap-8 border-t border-border-primary-default-light dark:border-border-primary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark pt-2">
                <button
                    onClick={onUpvote}
                    className="p-2 flex flex-row items-center gap-1 hover:text-text-accent-default-light dark:hover:text-text-accent-default-dark transition-colors duration-200 ease-in-out"
                >
                    <ArrowUpIcon className="w-4 h-4" />
                    <span>{postData.likes}</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="p-2 flex flex-row items-center gap-1 hover:text-text-accent-default-light dark:hover:text-text-accent-default-dark transition-colors duration-200 ease-in-out"
                >
                    <CommentIcon className="w-4 h-4" />
                    <span>{postData.comments?.length || 0}</span>
                </button>
            </div>

            {showComments && (
                <div className="space-y-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark pt-3">
                    {(postData.comments || []).length > 0 && (
                        <ul className="space-y-2">
                            {(postData.comments || []).map((comment, idx) => (
                                <li key={comment.commentId || idx} className="flex items-start gap-2 text-sm">
                                    <div className="w-6 h-6 rounded-full shrink-0 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark flex items-center justify-center text-xs font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                                        {comment.authorName?.charAt(0)?.toUpperCase() || "?"}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
                                            {comment.authorName || "Unknown"}
                                        </span>
                                        <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                            {comment.content}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    {onAddComment && (
                        <form onSubmit={handleSubmitComment} className="flex gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 px-3 py-1.5 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-sm focus:outline-none focus:border-border-primary-active-light"
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim()}
                                className="px-3 py-1.5 rounded-md bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-white text-sm font-medium hover:bg-bg-surface-accent-hover-light dark:hover:bg-bg-surface-accent-hover-dark disabled:opacity-50"
                            >
                                Post
                            </button>
                        </form>
                    )}
                </div>
            )}
        </li>
    );
}