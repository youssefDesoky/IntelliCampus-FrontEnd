import { API_URL } from "../../../config/api";

/**
 * Get student's schedule
 * GET /api/schedule/my-schedule
 * GET /api/schedule/my-schedule?type=Lecture&type=Lab (optional types filter)
 */
export async function fetchMySchedule(types = []) {
    let url = `${API_URL}/api/schedule/my-schedule`;
    
    if (types && types.length > 0) {
        const typeParams = types.map((t) => `type=${encodeURIComponent(t)}`).join("&");
        url += `?${typeParams}`;
    }

    const res = await fetch(url, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch schedule: ${res.status}`);
    return res.json();
}

/**
 * Get schedule by ID
 * GET /api/schedule/{scheduleId}
 */
export async function fetchScheduleById(scheduleId) {
    const res = await fetch(`${API_URL}/api/schedule/${scheduleId}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch schedule: ${res.status}`);
    return res.json();
}
