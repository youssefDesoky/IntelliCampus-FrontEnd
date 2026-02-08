import { API_URL } from "../../../config/api";

/**
 * Fetch courses assigned to the current instructor.
 * GET /api/courses/my-teaching
 */
export async function fetchMyTeachingCourses() {
    const res = await fetch(`${API_URL}/api/courses/my-teaching`, {
        credentials: "include",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch teaching courses (${res.status})`);
    }
    return res.json();
}

/**
 * Fetch courses the current student is enrolled in.
 * GET /api/courses/my-courses
 */
export async function fetchMyStudentCourses() {
    const res = await fetch(`${API_URL}/api/courses/my-courses`, {
        credentials: "include",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch student courses (${res.status})`);
    }
    return res.json();
}

/**
 * Fetch all courses.
 * GET /api/courses
 */
export async function fetchAllCourses() {
    const res = await fetch(`${API_URL}/api/courses`, {
        credentials: "include",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch courses (${res.status})`);
    }
    return res.json();
}

/**
 * Fetch a single course by ID.
 * GET /api/courses/:id
 */
export async function fetchCourseById(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}`, {
        credentials: "include",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch course (${res.status})`);
    }
    return res.json();
}
