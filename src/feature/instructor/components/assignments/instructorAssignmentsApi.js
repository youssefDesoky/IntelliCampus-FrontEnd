import { API_URL } from "../../../../config/api";

export async function fetchInstructorAssignmentsByCourse(courseId) {
    const res = await fetch(`${API_URL}/api/assignments/instructor/course/${courseId}`, {
        credentials: "include",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch assignments (${res.status})`);
    }

    return res.json();
}

export async function createInstructorAssignment(payload) {
    const res = await fetch(`${API_URL}/api/assignments/create`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to create assignment (${res.status})`);
    }

    return res.json();
}

export async function deleteInstructorAssignment(assignmentId) {
    const res = await fetch(`${API_URL}/api/assignments/${assignmentId}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to delete assignment (${res.status})`);
    }

    return res.json();
}

export async function updateInstructorAssignment(assignmentId, payload) {
    const res = await fetch(`${API_URL}/api/assignments/${assignmentId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to update assignment (${res.status})`);
    }

    return res.json();
}

export async function fetchAssignmentSubmissions(assignmentId) {
    const res = await fetch(`${API_URL}/api/assignments/${assignmentId}/submissions`, {
        credentials: "include",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch submissions (${res.status})`);
    }

    return res.json();
}
