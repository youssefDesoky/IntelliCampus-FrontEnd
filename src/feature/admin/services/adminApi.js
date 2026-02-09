import { API_URL } from "../../../config/api";

// ─── Students ───────────────────────────────────────────────

export async function fetchStudents() {
    const res = await fetch(`${API_URL}/api/students`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch students: ${res.status}`);
    return res.json();
}

export async function fetchStudentById(id) {
    const res = await fetch(`${API_URL}/api/students/${id}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch student: ${res.status}`);
    return res.json();
}

export async function createStudent(data) {
    console.log("[API] POST /api/students →", JSON.stringify(data, null, 2));
    const res = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("[API] POST /api/students error response:", JSON.stringify(err, null, 2));
        const msg = err.errors
            ? Object.entries(err.errors).map(([k, v]) => `${k}: ${v.join(", ")}`).join("; ")
            : err.message || err.title || `Failed to create student: ${res.status}`;
        throw new Error(msg);
    }
    return res.json();
}

export async function deleteStudent(id) {
    const res = await fetch(`${API_URL}/api/students/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete student: ${res.status}`);
    }
    return true;
}

// ─── Instructors ────────────────────────────────────────────

export async function fetchInstructors() {
    const res = await fetch(`${API_URL}/api/instructors`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch instructors: ${res.status}`);
    return res.json();
}

export async function fetchInstructorById(id) {
    const res = await fetch(`${API_URL}/api/instructors/${id}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch instructor: ${res.status}`);
    return res.json();
}

export async function createInstructor(data) {
    console.log("[API] POST /api/instructors →", JSON.stringify(data, null, 2));
    const res = await fetch(`${API_URL}/api/instructors`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to create instructor: ${res.status}`);
    }
    return res.json();
}

export async function deleteInstructor(id) {
    const res = await fetch(`${API_URL}/api/instructors/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete instructor: ${res.status}`);
    }
    return true;
}

// ─── Admins ─────────────────────────────────────────────────

export async function fetchAdmins() {
    const res = await fetch(`${API_URL}/api/admins`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch admins: ${res.status}`);
    return res.json();
}

export async function createAdmin(data) {
    console.log("[API] POST /api/admins \u2192", JSON.stringify(data, null, 2));
    const res = await fetch(`${API_URL}/api/admins`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to create admin: ${res.status}`);
    }
    return res.json();
}

export async function deleteAdmin(id) {
    const res = await fetch(`${API_URL}/api/admins/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete admin: ${res.status}`);
    }
    if (res.status === 204) return true;
    return true;
}

// ─── Courses ────────────────────────────────────────────────

export async function fetchCourses() {
    const res = await fetch(`${API_URL}/api/courses`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);
    return res.json();
}

export async function fetchCourseById(id) {
    const res = await fetch(`${API_URL}/api/courses/${id}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch course: ${res.status}`);
    return res.json();
}

export async function createCourse(data) {
    console.log("[API] POST /api/courses →", JSON.stringify(data, null, 2));
    const res = await fetch(`${API_URL}/api/courses`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("[API] POST /api/courses error response:", JSON.stringify(err, null, 2));
        const msg = err.errors
            ? Object.entries(err.errors).map(([k, v]) => `${k}: ${v.join(", ")}`).join("; ")
            : err.message || err.title || `Failed to create course: ${res.status}`;
        throw new Error(msg);
    }
    return res.json();
}

export async function updateCourse(id, data) {
    console.log(`[API] PUT /api/courses/${id} →`, JSON.stringify(data, null, 2));
    const res = await fetch(`${API_URL}/api/courses/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to update course: ${res.status}`);
    }
    return res.json();
}

export async function deleteCourse(id) {
    const res = await fetch(`${API_URL}/api/courses/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete course: ${res.status}`);
    }
    return true;
}

export async function activateCourse(id) {
    const res = await fetch(`${API_URL}/api/courses/${id}/activate`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to activate course: ${res.status}`);
    }
    if (res.status === 204) return true;
    return res.json();
}

export async function deactivateCourse(id) {
    const res = await fetch(`${API_URL}/api/courses/${id}/deactivate`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to deactivate course: ${res.status}`);
    }
    if (res.status === 204) return true;
    return res.json();
}

// ─── Course Classes ─────────────────────────────────────────

export async function fetchCourseClasses(courseId) {
    const res = await fetch(`${API_URL}/api/classes/course/${courseId}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch classes: ${res.status}`);
    return res.json();
}

export async function addClassToCourse(courseId, data) {
    const payload = { ...data, courseId: Number(courseId) };
    console.log("[API] POST /api/classes →", JSON.stringify(payload, null, 2));
    const res = await fetch(`${API_URL}/api/classes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("[API] POST /api/classes error response:", JSON.stringify(err, null, 2));
        const msg = err.errors
            ? Object.entries(err.errors).map(([k, v]) => `${k}: ${v.join(", ")}`).join("; ")
            : err.message || err.title || `Failed to add class: ${res.status}`;
        throw new Error(msg);
    }
    return res.json();
}

export async function deleteClassFromCourse(courseId, classId) {
    const res = await fetch(`${API_URL}/api/classes/${classId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete class: ${res.status}`);
    }
    if (res.status === 204) return true;
    return true;
}
