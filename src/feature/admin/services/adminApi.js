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

// ─── Bylaws ─────────────────────────────────────────────────

export async function fetchBylaws() {
    const res = await fetch(`${API_URL}/api/Baylaw`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch bylaws: ${res.status}`);
    return res.json();
}

export async function fetchBylawById(id) {
    const res = await fetch(`${API_URL}/api/Baylaw/${id}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch bylaw: ${res.status}`);
    return res.json();
}

export async function createBylaw(data) {
    const res = await fetch(`${API_URL}/api/Baylaw`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to create bylaw: ${res.status}`);
    }
    return res.json();
}

export async function deleteBylaw(id) {
    const res = await fetch(`${API_URL}/api/Baylaw/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to delete bylaw: ${res.status}`);
    return true;
}

export async function toggleBylawActive(id) {
    const res = await fetch(`${API_URL}/api/Baylaw/${id}/toggle-active`, {
        method: "PATCH",
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to toggle bylaw: ${res.status}`);
    return true;
}

export async function uploadBylawDocument(id, file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/Baylaw/${id}/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to upload bylaw document: ${res.status}`);
    }
    return res.json();
}

export async function setBylawGradeScales(id, items) {
    const res = await fetch(`${API_URL}/api/Baylaw/${id}/grade-scales`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to set grade scales: ${res.status}`);
    }
    return res.json();
}

// ─── Exams ─────────────────────────────────────────────────

export async function uploadExams(file, examType) {
    const formData = new FormData();
    formData.append("file", file);
    let url = `${API_URL}/api/ExcelImport/exams`;
    if (examType) url += `?examType=${examType}`;
    const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err.message || (err.errors && err.errors.join("; ")) || `Failed to upload exams: ${res.status}`;
        throw new Error(msg);
    }
    return res.json();
}

// ─── Student Upload ─────────────────────────────────────────

export async function uploadStudents(file, bylawId) {
    const formData = new FormData();
    formData.append("file", file);
    let url = `${API_URL}/api/ExcelImport/students`;
    if (bylawId) url += `?baylawId=${bylawId}`;

    const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to upload students: ${res.status}`);
    }
    return res.json();
}

// ─── Departments ────────────────────────────────────────────

export async function fetchDepartments() {
    const res = await fetch(`${API_URL}/api/departments`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch departments: ${res.status}`);
    return res.json();
}

export async function fetchDepartmentById(id) {
    const res = await fetch(`${API_URL}/api/departments/${id}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch department: ${res.status}`);
    return res.json();
}

export async function createDepartment(data) {
    console.log("[API] POST /api/departments →", JSON.stringify(data, null, 2));
    const res = await fetch(`${API_URL}/api/departments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to create department: ${res.status}`);
    }
    return res.json();
}

export async function updateDepartment(id, data) {
    console.log(`[API] PUT /api/departments/${id} →`, JSON.stringify(data, null, 2));
    const res = await fetch(`${API_URL}/api/departments/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to update department: ${res.status}`);
    }
    return res.json();
}

export async function deleteDepartment(id) {
    const res = await fetch(`${API_URL}/api/departments/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete department: ${res.status}`);
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

/** Maps frontend course fields to the backend CreateCourseDto JSON property names */
function toCoursePayload(data) {
    return {
        title: data.courseName,
        courseNameAr: data.courseNameAr,
        id: data.courseId,
        creditHours: data.creditHours,
        department: data.departmentId,
        description: data.description,
        prerequisites: data.prerequisites,
    };
}

export async function createCourse(data) {
    const payload = toCoursePayload(data);
    console.log("[API] POST /api/courses →", JSON.stringify(payload, null, 2));
    const res = await fetch(`${API_URL}/api/courses`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    const payload = toCoursePayload(data);
    console.log(`[API] PUT /api/courses/${id} →`, JSON.stringify(payload, null, 2));
    const res = await fetch(`${API_URL}/api/courses/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    const payload = { ...data, courseId: String(courseId) };
    console.log("[API] POST /api/classes →", JSON.stringify(payload, null, 2));
    const res = await fetch(`${API_URL}/api/classes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        let err = {};
        const text = await res.text().catch(() => "");
        try { err = JSON.parse(text); } catch { /* not JSON */ }
        console.error(`[API] POST /api/classes ${res.status} response:`, text || "(empty)");
        const msg = err.errors
            ? Object.entries(err.errors).map(([k, v]) => `${k}: ${v.join(", ")}`).join("; ")
            : err.message || err.title || text || `Failed to add class: ${res.status}`;
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

// ─── Rooms ──────────────────────────────────────────────────

export async function fetchRooms() {
    const res = await fetch(`${API_URL}/api/rooms`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch rooms: ${res.status}`);
    return res.json();
}

export async function fetchRoomById(id) {
    const res = await fetch(`${API_URL}/api/rooms/${id}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch room: ${res.status}`);
    return res.json();
}

export async function createRoom(data) {
    console.log("[API] POST /api/rooms →", JSON.stringify(data, null, 2));
    const res = await fetch(`${API_URL}/api/rooms`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("[API] POST /api/rooms error response:", JSON.stringify(err, null, 2));
        const msg = err.errors
            ? Object.entries(err.errors).map(([k, v]) => `${k}: ${v.join(", ")}`).join("; ")
            : err.message || err.title || `Failed to create room: ${res.status}`;
        throw new Error(msg);
    }
    return res.json();
}

export async function updateRoom(id, data) {
    console.log(`[API] PUT /api/rooms/${id} →`, JSON.stringify(data, null, 2));
    const res = await fetch(`${API_URL}/api/rooms/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to update room: ${res.status}`);
    }
    return res.json();
}

export async function deleteRoom(id) {
    const res = await fetch(`${API_URL}/api/rooms/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete room: ${res.status}`);
    }
    return true;
}
