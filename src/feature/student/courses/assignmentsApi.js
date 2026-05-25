import { API_URL } from "../../../config/api";
import { dispatchNotificationsChanged } from "../../../api/notifications";

/**
 * Get assignments for a student in a specific course
 * GET /api/assignments/{courseId}
 */
export async function fetchAssignmentsByCourse(courseId) {
    const res = await fetch(`${API_URL}/api/assignments/${courseId}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch assignments: ${res.status}`);
    return res.json();
}

/**
 * Get assignment stats for a student in a course
 * GET /api/assignments/{courseId}/stats
 */
export async function fetchAssignmentStats(courseId) {
    const res = await fetch(`${API_URL}/api/assignments/${courseId}/stats`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch assignment stats: ${res.status}`);
    return res.json();
}

/**
 * Submit an assignment
 * POST /api/assignments/{assignmentId}/submit
 */
export async function submitAssignment(assignmentId, submitData) {
    const res = await fetch(`${API_URL}/api/assignments/${assignmentId}/submit`, {
        method: "POST",
        credentials: "include",
        body: submitData,
    });
    if (!res.ok) {
        let errorMsg = `Failed to submit assignment: ${res.status}`;
        try {
            const errBody = await res.text();
            try {
                const errJson = JSON.parse(errBody);
                errorMsg = errJson.message || errJson.title || errJson.detail || errorMsg;
            } catch {
                if (errBody) errorMsg = errBody;
            }
        } catch {
            // ignore
        }
        throw new Error(errorMsg);
    }

    dispatchNotificationsChanged();
    return res.json();
}

/**
 * Delete an assignment (instructor only)
 * DELETE /api/assignments/{assignmentId}
 */
export async function deleteAssignment(assignmentId) {
    const res = await fetch(`${API_URL}/api/assignments/${assignmentId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete assignment: ${res.status}`);
    }
    return true;
}
