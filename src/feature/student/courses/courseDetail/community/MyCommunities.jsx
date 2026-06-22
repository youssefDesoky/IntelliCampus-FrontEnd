import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import StudyGroupPost from "../../../../../components/ui/StudyGroupPost";
import Button from "../../../../../components/ui/Button";
import { PlusIcon } from "../../../../../components/ui/icons";
import Dialog from "../../../../../components/ui/Dialog";
import CommunityQuickActions from "./CommunityQuickActions";
import CommunityStats from "./CommunityStats";
import CommunityTopContributes from "./CommunityTopContributes";
import {
    fetchCommunityPosts,
    createCommunityPost,
    toggleUpvote,
    addComment,
} from "./communityService";
import { useError } from '../../../../../contexts/ErrorContext.jsx';

export default function MyCommunities() {
    const { courseId } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showError } = useError();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newPostContent, setNewPostContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const loadPosts = useCallback(async () => {
        if (!courseId) return;
        try {
            setLoading(true);
            const data = await fetchCommunityPosts(courseId);
            setPosts(Array.isArray(data) ? data : []);
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => { loadPosts(); }, [loadPosts]);

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;
        setSubmitting(true);
        try {
            await createCommunityPost(courseId, newPostContent);
            setNewPostContent("");
            setIsCreateOpen(false);
            await loadPosts();
        } catch (err) {
            showError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpvote = async (postId) => {
        try {
            await toggleUpvote(courseId, postId);
            await loadPosts();
        } catch (err) {
        }
    };

    const handleAddComment = async (postId, content) => {
        try {
            await addComment(courseId, postId, content);
            await loadPosts();
        } catch (err) {
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-text-secondary-default-light dark:text-text-secondary-default-dark">
                Loading community...
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                    Course Community
                </h2>
                <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
                    <PlusIcon size={20} />
                    New Question
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-4">
                    {posts.length === 0 ? (
                        <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            No questions yet. Be the first to ask!
                        </p>
                    ) : (
                        <ul className="space-y-4">
                            {posts.map(post => (
                                <StudyGroupPost
                                    key={post.postId}
                                    postData={{
                                        postId: post.postId,
                                        sender: post.authorName,
                                        senderAvatar: post.authorProfileImage || post.authorAvatar || null,
                                        title: post.content?.split('\n')[0] || "Question",
                                        content: post.content,
                                        createdAt: new Date(post.createdAt).toLocaleDateString(),
                                        likes: post.upvoteCount || 0,
                                        comments: post.comments || [],
                                        tags: [],
                                    }}
                                    onUpvote={() => handleUpvote(post.postId)}
                                    onAddComment={(content) => handleAddComment(post.postId, content)}
                                />
                            ))}
                        </ul>
                    )}
                </div>

                <div className="space-y-4">
                    <CommunityStats posts={posts} />
                    <CommunityTopContributes posts={posts} />
                    <CommunityQuickActions
                        courseId={courseId}
                        onGraphExport={() => {}}
                    />
                </div>
            </div>

            <Dialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Ask a Question"
                variant="info"
                onConfirm={handleCreatePost}
                confirmText={submitting ? "Posting..." : "Post Question"}
                cancelText="Cancel"
                showCloseButton={true}
                disabled={submitting}
            >
                <div className="space-y-4">
                    <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="What would you like to ask?"
                        rows={5}
                        className="w-full px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-sm resize-none focus:outline-none focus:border-border-primary-active-light"
                    />
                </div>
            </Dialog>
        </div>
    );
}