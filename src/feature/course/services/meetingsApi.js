import { API_URL } from "../../../config/api";

function getBaseUrl() {
    return API_URL;
}

export async function fetchCourseMeetings(courseId) {
    const res = await fetch(`${getBaseUrl()}/api/meetings/course/${courseId}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch meetings: ${res.status}`);
    return res.json();
}

export async function createMeeting({ title, dateTime, courseId }) {
    const res = await fetch(`${getBaseUrl()}/api/meetings`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Title: title, DateTime: dateTime, CourseId: courseId }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to create meeting: ${res.status}`);
    }
    return res.json();
}

export async function deleteMeeting(meetingId) {
    const res = await fetch(`${getBaseUrl()}/api/meetings/${meetingId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete meeting: ${res.status}`);
    }
    return true;
}
