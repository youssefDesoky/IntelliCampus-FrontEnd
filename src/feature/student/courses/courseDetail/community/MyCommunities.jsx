import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import StudyGroupPost from "../../../../../components/ui/StudyGroupPost";
import TextArea from "../../../../../components/ui/TextArea";
import {
    CommentsIcon,
    PaperclipIcon,
    PaperPlaneIcon,
} from "../../../../../components/ui/icons";
import {
    fetchCommunityPosts,
    createCommunityPost,
    toggleUpvote,
} from "./communityService";
import { useError } from '../../../../../contexts/ErrorContext.jsx';

export default function MyCommunities() {
    const { course, courseId } = useOutletContext();
    const [posts, setPosts] = useState([]);
    const [postDraft, setPostDraft] = useState("");
    const [attachments, setAttachments] = useState([]);
    const { showError } = useError();

    function mapPost(raw) {
        return {
            id: raw.postId,
            sender: raw.authorName,
            senderAvatar: raw.authorProfileImage || raw.authorAvatar || null,
            title: raw.content?.split('\n')[0] || "Question",
            content: raw.content,
            createdAt: raw.createdAt,
            likes: raw.upvoteCount || 0,
            comments: (raw.comments || []).map(c => ({
                commentId: c.commentId,
                authorName: c.authorName,
                authorAvatar: c.authorProfileImage || c.authorAvatar || null,
                content: c.content,
                createdAt: c.createdAt,
            })),
            pinned: raw.isPinned || false,
            saved: false,
        };
    }

    function extractPosts(data) {
        if (Array.isArray(data)) return data;
        if (data?.data && Array.isArray(data.data)) return data.data;
        if (data?.questions && Array.isArray(data.questions)) return data.questions;
        if (data?.content && Array.isArray(data.content)) return data.content;
        return [];
    }

    useEffect(() => {
        if (!courseId) return;
        let ignore = false;

        async function loadCommunities() {
            try {
                const data = await fetchCommunityPosts(courseId);
                if (!ignore) setPosts(extractPosts(data).map(mapPost));
            } catch {
                if (!ignore) setPosts([]);
            }
        }

        loadCommunities();
        return () => {
            ignore = true;
        };
    }, [courseId]);

    const handleCreatePost = async () => {
        if (!postDraft.trim() || !courseId) return;
        try {
            await createCommunityPost(courseId, postDraft);
            setPostDraft("");
            const data = await fetchCommunityPosts(courseId);
            setPosts(extractPosts(data).map(mapPost));
        } catch (err) {
            showError(err.message);
        }
    };

    const handleUpvote = async (postId) => {
        if (!courseId) return;
        try {
            await toggleUpvote(courseId, postId);
            const data = await fetchCommunityPosts(courseId);
            setPosts(extractPosts(data).map(mapPost));
        } catch (err) {
            showError(err.message);
        }
    };

    const handleAttachmentChange = (event) => {
        const files = Array.from(event.target.files || []);
        const newAttachments = files.map((file) => ({
            id: crypto.randomUUID(),
            name: file.name,
            type: file.type,
            preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
            file,
        }));
        setAttachments((prev) => [...prev, ...newAttachments].slice(0, 5));
        event.target.value = "";
    };

    const removeAttachment = (id) => {
        setAttachments((prev) => prev.filter((a) => a.id !== id));
    };

    if (!course) {
        return (
            <div className="py-10 text-center">
                <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading course...</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <aside className="space-y-6 xl:order-2 xl:sticky xl:top-20 xl:self-start">
                <div className="rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5 sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                            Start a thread
                        </h2>
                        <PaperPlaneIcon className="h-4 w-4 text-text-accent-default-light dark:text-text-accent-default-dark" />
                    </div>

                    <TextArea
                        value={postDraft}
                        onChange={(event) => setPostDraft(event.target.value)}
                        placeholder="Write a question, share notes, or ask for help..."
                        className="w-full rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark px-4 py-3 text-sm text-text-primary-default-light outline-none transition-colors placeholder:text-text-tertiary-default-light focus:border-text-accent-default-light dark:text-text-primary-default-dark dark:placeholder:text-text-tertiary-default-dark dark:focus:border-text-accent-default-dark"
                    />

                    {attachments.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <p className="text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark">Attachments ({attachments.length}/5)</p>
                            <div className="flex flex-wrap gap-2">
                                {attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className="group relative overflow-hidden rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark p-1.5 transition-colors hover:bg-bg-surface-primary-default-light dark:hover:bg-bg-surface-primary-default-dark"
                                    >
                                        {attachment.type.startsWith("image/") ? (
                                            <div className="relative h-16 w-16 overflow-hidden rounded-md bg-black/5 dark:bg-white/5">
                                                <img
                                                    src={attachment.preview}
                                                    alt={attachment.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-black/5 dark:bg-white/5">
                                                <span className="text-xs font-bold text-text-tertiary-default-light dark:text-text-tertiary-default-dark uppercase">
                                                    {attachment.name.split(".").pop()}
                                                </span>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(attachment.id)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <span className="text-xs font-semibold text-white">Remove</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <input
                                id="file-input"
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleAttachmentChange}
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById("file-input")?.click()}
                                disabled={attachments.length >= 5}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark px-3 py-2 text-xs font-medium transition-colors hover:bg-bg-surface-primary-default-light disabled:opacity-50 dark:hover:bg-bg-surface-primary-default-dark"
                            >
                                <PaperclipIcon className="h-3.5 w-3.5" />
                                Attach
                            </button>
                            <span className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">{postDraft.length}/500</span>
                        </div>

                        <button
                            type="button"
                            disabled={!postDraft.trim() || !courseId}
                            onClick={handleCreatePost}
                            className="inline-flex items-center gap-2 rounded-lg bg-text-accent-default-light px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-text-accent-hover-light disabled:opacity-50 dark:bg-text-accent-default-dark dark:hover:bg-text-accent-hover-dark"
                        >
                            <PaperPlaneIcon className="h-3.5 w-3.5" />
                            Post
                        </button>
                    </div>
                </div>
            </aside>

            <div className="space-y-4 xl:order-1">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <StudyGroupPost
                            key={post.id}
                            postData={post}
                            courseId={courseId}
                            onUpvote={() => handleUpvote(post.id)}
                        />
                    ))
                ) : (
                    <div className="rounded-2xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark p-16 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                            <CommentsIcon className="h-6 w-6 text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
                        </div>
                        <p className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">No posts yet</p>
                        <p className="mt-1 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Be the first to start a discussion.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
