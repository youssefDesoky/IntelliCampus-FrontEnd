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

/**
 * Export exam schedule as PDF and trigger download
 * GET /api/examschedule/my-exams/export
 */
export async function exportExamSchedulePdf(type, status) {
    let url = `${API_URL}/api/examschedule/my-exams/export`;
    const params = [];
    if (type) params.push(`type=${encodeURIComponent(type)}`);
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (params.length) url += `?${params.join("&")}`;

    const res = await fetch(url, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to export exam schedule: ${res.status}`);

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "ExamSchedule.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
}
