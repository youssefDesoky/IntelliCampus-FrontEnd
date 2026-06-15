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

// ─── User Roles (Super Admin) ──────────────────────────────

export async function fetchUserRoles(userId) {
    const res = await fetch(`${API_URL}/api/users/${userId}/roles`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch user roles: ${res.status}`);
    return res.json();
}

export async function assignUserRoles(userId, roles) {
    const res = await fetch(`${API_URL}/api/users/${userId}/roles`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to assign roles: ${res.status}`);
    }
    return res.json();
}

export async function fetchAssignableRoles() {
    const res = await fetch(`${API_URL}/api/roles/assignable`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch assignable roles: ${res.status}`);
    return res.json();
}

// ─── Roles ──────────────────────────────────────────────────

export async function fetchAdminRoles() {
    const res = await fetch(`${API_URL}/api/roles/admin`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch admin roles: ${res.status}`);
    return res.json();
}

export async function fetchInstructorRoles() {
    const res = await fetch(`${API_URL}/api/roles/instructor`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch instructor roles: ${res.status}`);
    return res.json();
}

// ─── Bylaws ─────────────────────────────────────────────────

export async function fetchBylaws() {
    const res = await fetch(`${API_URL}/api/Bylaw`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch bylaws: ${res.status}`);
    return res.json();
}

export async function fetchBylawById(id) {
    const res = await fetch(`${API_URL}/api/Bylaw/${id}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch bylaw: ${res.status}`);
    return res.json();
}

export async function createBylaw(data) {
    const res = await fetch(`${API_URL}/api/Bylaw`, {
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
    const res = await fetch(`${API_URL}/api/Bylaw/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to delete bylaw: ${res.status}`);
    return true;
}

export async function toggleBylawActive(id) {
    const res = await fetch(`${API_URL}/api/Bylaw/${id}/toggle-active`, {
        method: "PATCH",
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to toggle bylaw: ${res.status}`);
    return true;
}

export async function uploadBylawDocument(id, file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/Bylaw/${id}/upload`, {
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
    const res = await fetch(`${API_URL}/api/Bylaw/${id}/grade-scales`, {
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

export async function fetchExams() {
    const res = await fetch(`${API_URL}/api/exams`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch exams: ${res.status}`);
    return res.json();
}

export async function deleteExam(id) {
    const res = await fetch(`${API_URL}/api/exams/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete exam: ${res.status}`);
    }
    return true;
}

export async function updateExam(id, data) {
    const res = await fetch(`${API_URL}/api/exams/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.title || `Failed to update exam: ${res.status}`);
    }
    return res.json();
}

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
    if (bylawId) url += `?bylawId=${bylawId}`;

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

export async function updateClass(classId, data) {
    const payload = { ...data };
    console.log(`[API] PUT /api/classes/${classId} →`, JSON.stringify(payload, null, 2));
    const res = await fetch(`${API_URL}/api/classes/${classId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        let err = {};
        const text = await res.text().catch(() => "");
        try { err = JSON.parse(text); } catch { /* not JSON */ }
        console.error(`[API] PUT /api/classes/${classId} ${res.status} response:`, text || "(empty)");
        const msg = err.errors
            ? Object.entries(err.errors).map(([k, v]) => `${k}: ${v.join(", ")}`).join("; ")
            : err.message || err.title || text || `Failed to update class: ${res.status}`;
        throw new Error(msg);
    }
    if (res.status === 204) return true;
    return res.json();
}

// ─── Course Students ────────────────────────────────────────

const mockCourseStudents = [
    { studentId: "STU001", fullName: "Ahmed Mohamed", email: "ahmed@example.com", gpa: 3.5, section: "A" },
    { studentId: "STU002", fullName: "Sara Ali", email: "sara@example.com", gpa: 3.8, section: "A" },
    { studentId: "STU003", fullName: "Khaled Hassan", email: "khaled@example.com", gpa: 3.2, section: "B" },
    { studentId: "STU004", fullName: "Nadia Ibrahim", email: "nadia@example.com", gpa: 3.9, section: "B" },
    { studentId: "STU005", fullName: "Omar Farouk", email: "omar@example.com", gpa: 2.9, section: "A" },
];

export async function fetchCourseStudents(courseId) {
    try {
        const res = await fetch(`${API_URL}/api/courses/${courseId}/students`, {
            credentials: "include",
        });
        if (res.ok) return res.json();
    } catch { /* fall through to mock */ }
    return [...mockCourseStudents];
}

// ─── Course Grades ──────────────────────────────────────────

export async function uploadCourseGrades(courseId, file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/courses/${courseId}/grades/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to upload grades: ${res.status}`);
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

function toRoomPayload(data) {
    return {
        roomName: data.name,
        nameAr: data.nameAr,
        type: data.type,
        capacity: data.capacity,
        location: data.location,
    };
}

export async function createRoom(data) {
    const payload = toRoomPayload(data);
    console.log("[API] POST /api/rooms →", JSON.stringify(payload, null, 2));
    const res = await fetch(`${API_URL}/api/rooms`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    const payload = toRoomPayload(data);
    console.log(`[API] PUT /api/rooms/${id} →`, JSON.stringify(payload, null, 2));
    const res = await fetch(`${API_URL}/api/rooms/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

// ─── Student Courses (mock/fallback) ───────────────────────
// NOTE: The backend endpoints for these may not exist yet.
// Functions try the real API first, then fall back to mock data.

const mockRegisteredCourses = [
    { _id: "c1", title: "Data Structures", code: "CS201", creditHours: 3, schedule: "Sun/Tue 10:00-11:30", instructor: "Dr. Ahmed", section: "A" },
    { _id: "c2", title: "Algorithms", code: "CS202", creditHours: 3, schedule: "Mon/Wed 10:00-11:30", instructor: "Dr. Sara", section: "B" },
    { _id: "c3", title: "Database Systems", code: "CS301", creditHours: 3, schedule: "Sun/Tue 12:00-13:30", instructor: "Dr. Khaled", section: "A" },
    { _id: "c4", title: "Operating Systems", code: "CS302", creditHours: 3, schedule: "Mon/Wed 12:00-13:30", instructor: "Dr. Nadia", section: "C" },
    { _id: "c5", title: "Software Engineering", code: "CS401", creditHours: 3, schedule: "Tue/Thu 10:00-11:30", instructor: "Dr. Yasser", section: "B" },
];

const mockSections = ["A", "B", "C", "D"];

const mockCompletedCourses = [
    { _id: "c6", title: "Introduction to Programming", code: "CS101", creditHours: 3, grade: "A", gradePercent: 92, attendance: 95, courseWork: 88 },
    { _id: "c7", title: "Calculus I", code: "MATH101", creditHours: 3, grade: "B+", gradePercent: 87, attendance: 90, courseWork: 82 },
    { _id: "c8", title: "Linear Algebra", code: "MATH201", creditHours: 3, grade: "A-", gradePercent: 89, attendance: 93, courseWork: 85 },
    { _id: "c9", title: "Discrete Mathematics", code: "MATH202", creditHours: 3, grade: "B", gradePercent: 82, attendance: 88, courseWork: 78 },
    { _id: "c10", title: "Probability & Statistics", code: "MATH301", creditHours: 3, grade: "A", gradePercent: 94, attendance: 97, courseWork: 91 },
    { _id: "c11", title: "Computer Networks", code: "CS303", creditHours: 3, grade: "B+", gradePercent: 86, attendance: 91, courseWork: 80 },
];

const mockAvailableCourses = [
    { _id: "c12", title: "Machine Learning", code: "CS402", creditHours: 3 },
    { _id: "c13", title: "Computer Vision", code: "CS403", creditHours: 3 },
    { _id: "c14", title: "Natural Language Processing", code: "CS404", creditHours: 3 },
    { _id: "c15", title: "Cryptography", code: "CS405", creditHours: 3 },
    { _id: "c16", title: "Compiler Design", code: "CS406", creditHours: 3 },
];

export async function fetchStudentRegisteredCourses(studentId) {
    try {
        const res = await fetch(`${API_URL}/api/students/${studentId}/courses/registered`, {
            credentials: "include",
        });
        if (res.ok) return res.json();
    } catch { /* fall through to mock */ }
    return [...mockRegisteredCourses];
}

export async function fetchStudentCompletedCourses(studentId) {
    try {
        const res = await fetch(`${API_URL}/api/students/${studentId}/courses/completed`, {
            credentials: "include",
        });
        if (res.ok) return res.json();
    } catch { /* fall through to mock */ }
    return [...mockCompletedCourses];
}

export async function fetchAvailableCoursesForStudent(studentId) {
    try {
        const res = await fetch(`${API_URL}/api/students/${studentId}/courses/available`, {
            credentials: "include",
        });
        if (res.ok) return res.json();
    } catch { /* fall through to mock */ }
    return [...mockAvailableCourses];
}

export async function registerStudentCourse(studentId, courseId) {
    const res = await fetch(`${API_URL}/api/students/${studentId}/courses/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
    });
    if (res.ok) return res.json();
    if (res.status === 404) return { success: true, mock: true };
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to change section: ${res.status}`);
}

// ─── Email ───────────────────────────────────────────────────

export async function sendEmail({ to, subject, body }) {
    const res = await fetch(`${API_URL}/api/email/send`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to send email: ${res.status}`);
    }
    return res.json();
}

// ─── Auto Exam Scheduling ───────────────────────────────────

export async function autoSchedule(request) {
    const res = await fetch(`${API_URL}/api/ExamScheduling/auto-schedule`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.errorMessage || err.message || `Auto-schedule failed: ${res.status}`);
    }
    return res.json();
}

export async function detectConflicts({ courseId, date, startTime, endTime, excludeExamId }) {
    const params = new URLSearchParams({
        courseId,
        date,
        startTime,
        endTime,
    });
    if (excludeExamId) params.append("excludeExamId", excludeExamId);
    const res = await fetch(`${API_URL}/api/ExamScheduling/detect-conflicts?${params}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to detect conflicts: ${res.status}`);
    return res.json();
}

export async function getConflictGraph() {
    const res = await fetch(`${API_URL}/api/ExamScheduling/conflict-graph`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to get conflict graph: ${res.status}`);
    return res.json();
}

export async function assignHalls(examId, examHallIds) {
    const res = await fetch(`${API_URL}/api/ExamScheduling/assign-halls/${examId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId, examHallIds }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.errorMessage || err.message || `Failed to assign halls: ${res.status}`);
    }
    return res.json();
}

export async function getHallAssignments(examId) {
    const res = await fetch(`${API_URL}/api/ExamScheduling/hall-assignments/${examId}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to get hall assignments: ${res.status}`);
    return res.json();
}

export async function getSeatAssignments(examId) {
    const res = await fetch(`${API_URL}/api/ExamScheduling/seat-assignments/${examId}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to get seat assignments: ${res.status}`);
    return res.json();
}

export async function getAvailableSlots(request) {
    const res = await fetch(`${API_URL}/api/ExamScheduling/available-slots`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error(`Failed to get available slots: ${res.status}`);
    return res.json();
}

export async function unregisterStudentCourse(studentId, courseId) {
    const res = await fetch(`${API_URL}/api/students/${studentId}/courses/${courseId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (res.ok) return true;
    if (res.status === 404) return { success: true, mock: true };
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to unregister course: ${res.status}`);
}

export async function fetchStudentCourseSections(studentId, courseId) {
    try {
        const res = await fetch(`${API_URL}/api/students/${studentId}/courses/${courseId}/sections`, {
            credentials: "include",
        });
        if (res.ok) return res.json();
    } catch { /* fall through to mock */ }
    return [...mockSections];
}

export async function changeStudentCourseSection(studentId, courseId, section) {
    const res = await fetch(`${API_URL}/api/students/${studentId}/courses/${courseId}/section`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section }),
    });
    if (res.ok) return res.json();
    if (res.status === 404) return { success: true, mock: true };
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to change section: ${res.status}`);
}

// ─── Instructor Courses (mock/fallback) ───────────────────

const mockInstructorCourses = [
    { _id: "ic1", title: "Data Structures", code: "CS201", creditHours: 3, section: "A", schedule: "Sun/Tue 10:00-11:30", room: "Hall 101" },
    { _id: "ic2", title: "Algorithms", code: "CS202", creditHours: 3, section: "B", schedule: "Mon/Wed 10:00-11:30", room: "Lab 2" },
    { _id: "ic3", title: "Database Systems", code: "CS301", creditHours: 3, section: "A", schedule: "Sun/Tue 12:00-13:30", room: "Hall 102" },
    { _id: "ic4", title: "Operating Systems", code: "CS302", creditHours: 3, section: "C", schedule: "Mon/Wed 12:00-13:30", room: "Lab 3" },
];

const mockTASections = [
    { _id: "ts1", courseTitle: "Data Structures", courseCode: "CS201", section: "A" },
    { _id: "ts2", courseTitle: "Algorithms", courseCode: "CS202", section: "B" },
];

const mockAvailableSections = ["A", "B", "C", "D"];

export async function fetchInstructorCourses(instructorId) {
    try {
        const res = await fetch(`${API_URL}/api/instructors/${instructorId}/courses`, {
            credentials: "include",
        });
        if (res.ok) return res.json();
    } catch { /* fall through to mock */ }
    return [...mockInstructorCourses];
}

export async function fetchInstructorTASections(instructorId) {
    try {
        const res = await fetch(`${API_URL}/api/instructors/${instructorId}/ta-sections`, {
            credentials: "include",
        });
        if (res.ok) return res.json();
    } catch { /* fall through to mock */ }
    return [...mockTASections];
}

export async function fetchInstructorAvailableSections(instructorId, courseId) {
    try {
        const res = await fetch(`${API_URL}/api/instructors/${instructorId}/courses/${courseId}/sections`, {
            credentials: "include",
        });
        if (res.ok) return res.json();
    } catch { /* fall through to mock */ }
    return [...mockAvailableSections];
}

export async function changeInstructorSection(instructorId, courseId, section) {
    const res = await fetch(`${API_URL}/api/instructors/${instructorId}/courses/${courseId}/section`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section }),
    });
    if (res.ok) return res.json();
    if (res.status === 404) return { success: true, mock: true };
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to change section: ${res.status}`);
}
