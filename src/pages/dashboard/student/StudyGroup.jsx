import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import StudyGroupPost from "../../../components/ui/StudyGroupPost";
import TextArea from "../../../components/ui/TextArea";

import {
    CommentsIcon,
    PaperPlaneIcon,
} from "../../../components/ui/icons";
import { fetchCommunityPosts, createCommunityPost, toggleUpvote } from "../../../feature/student/courses/courseDetail/community/communityService";
import { useError } from '../../../contexts/ErrorContext.jsx';

export default function StudyGroup() {
    const { course } = useOutletContext();
    const courseId = course?.id;
    const [posts, setPosts] = useState([]);
    const [postDraft, setPostDraft] = useState("");
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

                        <div className="mt-4 flex items-center justify-between gap-3">
                            <span className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">{postDraft.length}/500</span>

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
