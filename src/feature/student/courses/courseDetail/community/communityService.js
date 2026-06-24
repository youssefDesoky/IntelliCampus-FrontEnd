import { API_URL } from "../../../../../config/api";

export async function fetchCommunityPosts(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/community/questions`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
    return res.json();
}

export async function createCommunityPost(courseId, content) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/community/questions`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to create post: ${res.status}`);
    }
    return res.json();
}

export async function deleteCommunityPost(courseId, postId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/community/questions/${postId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to delete post: ${res.status}`);
    return true;
}

export async function addComment(courseId, postId, content) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/community/questions/${postId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to add comment: ${res.status}`);
    }
    return res.json();
}

export async function deleteComment(courseId, postId, commentId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/community/questions/${postId}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to delete comment: ${res.status}`);
    return true;
}

export async function toggleUpvote(courseId, postId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/community/questions/${postId}/upvote`, {
        method: "POST",
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to toggle upvote: ${res.status}`);
    return res.json();
}

export async function routeQuestion(courseId, postId, topN = 3) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/community/route`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, topN }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to route question: ${res.status}`);
    }
    return res.json();
}

export async function exportGraph(courseId, graphType = "interaction") {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/community/graph?graphType=${graphType}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to export graph: ${res.status}`);
    return res.text();
}