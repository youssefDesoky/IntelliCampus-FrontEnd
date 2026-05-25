import { API_URL } from "../../../config/api";

export async function fetchCourseQuizzesOverview(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/quizzes`, {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch quizzes overview: ${res.status}`);
    }

    return res.json();
}

export async function fetchPracticeQuiz(courseId, quizId) {
    const query = quizId ? `?quizId=${encodeURIComponent(quizId)}` : "";
    const res = await fetch(`${API_URL}/api/courses/${courseId}/quizzes/practice${query}`, {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch practice quiz: ${res.status}`);
    }

    return res.json();
}

export async function submitPracticeQuiz(courseId, submitData) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/quizzes/practice/submit`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(payload?.message || payload?.error || `Failed to submit quiz: ${res.status}`);
    }

    return payload;
}
