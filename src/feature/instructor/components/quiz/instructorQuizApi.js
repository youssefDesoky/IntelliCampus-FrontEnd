import { API_URL } from "../../../../config/api";

export async function fetchQuizzesByCourse(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/quizzes`, {
        credentials: "include",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch quizzes (${res.status})`);
    }

    return res.json();
}

export async function createQuiz(payload) {
    const res = await fetch(`${API_URL}/api/courses/${payload.courseId}/quizzes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to create quiz (${res.status})`);
    }

    return res.json();
}
