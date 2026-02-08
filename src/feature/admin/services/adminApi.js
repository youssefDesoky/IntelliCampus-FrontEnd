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
    const res = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to create student: ${res.status}`);
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
    const res = await fetch(`${API_URL}/api/courses`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to create course: ${res.status}`);
    }
    return res.json();
}

export async function updateCourse(id, data) {
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

export async function activateCourse(id, data) {
    const res = await fetch(`${API_URL}/api/courses/${id}/activate`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to activate course: ${res.status}`);
    }
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
    return res.json();
}

// ─── Course Classes ─────────────────────────────────────────

export async function fetchCourseClasses(courseId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/classes`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch classes: ${res.status}`);
    return res.json();
}

export async function addClassToCourse(courseId, data) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/classes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to add class: ${res.status}`);
    }
    return res.json();
}

export async function deleteClassFromCourse(courseId, classId) {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/classes/${classId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete class: ${res.status}`);
    }
    return true;
}
