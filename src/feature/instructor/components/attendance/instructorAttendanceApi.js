import { API_URL } from "../../../../config/api";

export async function fetchClassesByCourse(courseId) {
    const res = await fetch(`${API_URL}/api/classes/course/${courseId}`, {
        credentials: "include",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch classes (${res.status})`);
    }

    return res.json();
}

export async function fetchAttendanceReport(classId) {
    const res = await fetch(`${API_URL}/api/attendance/report/class/${classId}`, {
        credentials: "include",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch attendance report (${res.status})`);
    }

    return res.json();
}

export async function createClass(payload) {
    const res = await fetch(`${API_URL}/api/classes`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to create class (${res.status})`);
    }

    return res.json();
}

export async function recordAttendance(payload) {
    const res = await fetch(`${API_URL}/api/attendance/record`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to record attendance (${res.status})`);
    }

    return res.json();
}

export async function getSessionsByClass(classId) {
    const res = await fetch(`${API_URL}/api/attendance/sessions/class/${classId}`, {
        credentials: "include",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch sessions (${res.status})`);
    }

    return res.json();
}

export async function createSession(payload) {
    const res = await fetch(`${API_URL}/api/attendance/sessions`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to create session (${res.status})`);
    }

    return res.json();
}

export async function scanAttendanceQr(payload) {
    const res = await fetch(`${API_URL}/api/attendance/scan`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to scan QR (${res.status})`);
    }

    return res.json();
}

export async function recordManualAttendance(payload) {
    const res = await fetch(`${API_URL}/api/attendance/manual`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to record manual attendance (${res.status})`);
    }

    return res.json();
}

export async function generateStudentAttendanceQr() {
    const res = await fetch(`${API_URL}/api/attendance/qr`, {
        credentials: "include",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to generate QR (${res.status})`);
    }

    return res.json();
}
