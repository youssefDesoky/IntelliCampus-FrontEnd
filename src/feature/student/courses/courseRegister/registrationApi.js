import { API_URL } from "../../../../config/api";

/**
 * Fetch all active courses available for registration.
 * GET /api/courses/active
 */
export async function fetchActiveCourses() {
    const res = await fetch(`${API_URL}/api/courses/active`, {
        credentials: "include",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch active courses (${res.status})`);
    }
    return res.json();
}

/**
 * Fetch classes (lectures + sections) for a specific course.
 * GET /api/classes/course/:courseId
 */
export async function fetchClassesForCourse(courseId) {
    const res = await fetch(`${API_URL}/api/classes/course/${courseId}`, {
        credentials: "include",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch classes (${res.status})`);
    }
    return res.json();
}

/**
 * Register the current student in a course + class.
 * POST /api/registration  →  body: { courseId, classId }
 */
export async function registerForCourse(courseId, classId) {
    const res = await fetch(`${API_URL}/api/registration`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, classId }),
    });
    if (!res.ok) {
        let msg = `Registration failed (${res.status})`;
        try {
            const json = await res.json();
            msg = json.message || msg;
        } catch { /* ignore */ }
        throw new Error(msg);
    }
    return res.json();
}

/**
 * Fetch the current student's registered courses.
 * GET /api/registration/my-courses
 */
export async function getMyRegistrations() {
    const res = await fetch(`${API_URL}/api/registration/my-courses`, {
        credentials: "include",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch registrations (${res.status})`);
    }
    return res.json();
}

/**
 * Unregister the current student from a course.
 * DELETE /api/registration/:courseId
 */
export async function unregisterFromCourse(courseId) {
    const res = await fetch(`${API_URL}/api/registration/${courseId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (res.status === 204) return true;
    if (!res.ok) {
        let msg = `Unregister failed (${res.status})`;
        try {
            const json = await res.json();
            msg = json.message || msg;
        } catch { /* ignore */ }
        throw new Error(msg);
    }
    return true;
}
