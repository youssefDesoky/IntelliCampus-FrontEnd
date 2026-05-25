import { API_URL } from "../../../config/api";

/**
 * Get all student's exams
 * GET /api/examschedule/my-exams
 */
export async function fetchMyExams() {
    const res = await fetch(`${API_URL}/api/examschedule/my-exams`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch exams: ${res.status}`);
    return res.json();
}

/**
 * Get student's midterm exams
 * GET /api/examschedule/my-exams/midterms
 */
export async function fetchMidterms() {
    const res = await fetch(`${API_URL}/api/examschedule/my-exams/midterms`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch midterms: ${res.status}`);
    return res.json();
}

/**
 * Get student's final exams
 * GET /api/examschedule/my-exams/finals
 */
export async function fetchFinals() {
    const res = await fetch(`${API_URL}/api/examschedule/my-exams/finals`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch finals: ${res.status}`);
    return res.json();
}

/**
 * Get student's upcoming exams
 * GET /api/examschedule/my-exams/upcoming
 */
export async function fetchUpcomingExams() {
    const res = await fetch(`${API_URL}/api/examschedule/my-exams/upcoming`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch upcoming exams: ${res.status}`);
    return res.json();
}

/**
 * Get exam schedule by ID
 * GET /api/examschedule/{examScheduleId}
 */
export async function fetchExamScheduleById(examScheduleId) {
    const res = await fetch(`${API_URL}/api/examschedule/${examScheduleId}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch exam schedule: ${res.status}`);
    return res.json();
}
