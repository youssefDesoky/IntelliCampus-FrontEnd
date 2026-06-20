import apiClient from "../../../utils/apiClient";

// ─── Students ───────────────────────────────────────────────

export async function fetchStudents() {
    return apiClient('/api/students');
}

export async function fetchStudentById(id) {
    return apiClient(`/api/students/${id}`);
}

export async function createStudent(data) {
    return apiClient('/api/students', {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateStudent(id, data) {
    return apiClient(`/api/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteStudent(id) {
    await apiClient(`/api/students/${id}`, { method: "DELETE" });
}

// ─── Instructors ────────────────────────────────────────────

export async function fetchInstructors() {
    return apiClient('/api/instructors');
}

export async function fetchInstructorById(id) {
    return apiClient(`/api/instructors/${id}`);
}

export async function updateInstructor(id, data) {
    return apiClient(`/api/instructors/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function createInstructor(data) {
    return apiClient('/api/instructors', {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function deleteInstructor(id) {
    await apiClient(`/api/instructors/${id}`, { method: "DELETE" });
    return true;
}

// ─── Admins ─────────────────────────────────────────────────

export async function fetchAdmins() {
    return apiClient('/api/admins');
}

export async function createAdmin(data) {
    return apiClient('/api/admins', {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function fetchAdminById(id) {
    return apiClient(`/api/admins/${id}`);
}

export async function updateAdmin(id, data) {
    return apiClient(`/api/admins/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteAdmin(id) {
    await apiClient(`/api/admins/${id}`, { method: "DELETE" });
    return true;
}

// ─── User Roles (Super Admin) ──────────────────────────────

const ROLE_GROUP_MAP = {
    student_undergrad: { label: "UnderGrad Student", group: "student" },
    student_masters: { label: "Masters Student", group: "student" },
    student_phd: { label: "PhD Student", group: "student" },
    student_diploma: { label: "Diploma Student", group: "student" },
    instructor: { label: "Instructor", group: "instructor" },
    admin_undergrad: { label: "UnderGrad Admin", group: "admin" },
    admin_postgrad: { label: "PostGrad Admin", group: "admin" },
    admin_academicstaff: { label: "Academic Staff Admin", group: "admin" },
    superadmin: { label: "Super Admin", group: "admin" },
};

/** Fetch current roles for a user (returns array of role name strings) */
export async function fetchUserRoles(userId) {
    const data = await apiClient(`/api/Roles/user/${userId}`);
    return (data || []).map(r => r.roleName?.toLowerCase());
}

/** Fetch all available roles for assignment */
export async function fetchAssignableRoles() {
    const data = await apiClient('/api/Roles');
    return (data || []).map(r => {
        const key = r.roleName?.toLowerCase();
        const meta = ROLE_GROUP_MAP[key] || {};
        return {
            value: key,
            label: meta.label || r.roleName,
            group: meta.group || "",
        };
    });
}

/** Assign a single role to a user */
export async function assignUserRole(userId, roleName) {
    return apiClient('/api/Roles/assign', {
        method: "POST",
        body: JSON.stringify({ userId, roleName }),
    });
}

/** Remove a single role from a user */
export async function removeUserRole(userId, roleId) {
    try {
        await apiClient(`/api/Roles/user/${userId}/role/${roleId}`, { method: "DELETE" });
    } catch (err) {
        if (err.status !== 404) throw err;
    }
    return true;
}

/** Fetch admin-specific roles for form dropdowns */
export async function fetchAdminRoles() {
    const data = await apiClient('/api/Roles');
    return (data || [])
        .filter(r => r.roleName?.toLowerCase().startsWith("admin_"))
        .map(r => ({
            value: r.roleName,
            label: r.roleName.replace("Admin_", "").replace(/([A-Z])/g, " $1").trim() + " Admin",
        }));
}

/** Fetch instructor-specific roles for form dropdowns */
export async function fetchInstructorRoles() {
    const data = await apiClient('/api/Roles');
    return (data || [])
        .filter(r => r.roleName?.toLowerCase() === "instructor")
        .map(r => ({ value: r.roleName, label: "Instructor" }));
}

/** Bulk assign/remove roles for a user (syncs selectedRoles with backend) */
export async function assignUserRoles(userId, selectedRoles) {
    const currentRoles = await fetchUserRoles(userId);

    const rolesToAdd = selectedRoles.filter(r => !currentRoles.includes(r));
    const rolesToRemove = currentRoles.filter(r => !selectedRoles.includes(r));

    const allRoles = await apiClient('/api/Roles');

    for (const roleName of rolesToAdd) {
        const role = allRoles.find(r => r.roleName?.toLowerCase() === roleName);
        if (role) {
            await assignUserRole(userId, role.roleName);
        }
    }

    for (const roleName of rolesToRemove) {
        const role = allRoles.find(r => r.roleName?.toLowerCase() === roleName);
        if (role) {
            await removeUserRole(userId, role.roleId);
        }
    }

    return true;
}

// ─── Bylaws ─────────────────────────────────────────────────

export async function fetchBylaws() {
    return apiClient('/api/Bylaw');
}

export async function fetchBylawById(id) {
    return apiClient(`/api/Bylaw/${id}`);
}

export async function updateBylaw(id, data) {
    return apiClient(`/api/Bylaw/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function createBylaw(data) {
    return apiClient('/api/Bylaw', {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function deleteBylaw(id) {
    await apiClient(`/api/Bylaw/${id}`, { method: "DELETE" });
    return true;
}

export async function toggleBylawActive(id) {
    await apiClient(`/api/Bylaw/${id}/toggle-active`, { method: "PATCH" });
    return true;
}

export async function uploadBylawDocument(id, file) {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient(`/api/Bylaw/${id}/upload`, {
        method: "POST",
        body: formData,
    });
}

export async function setBylawGradeScales(id, items) {
    return apiClient(`/api/Bylaw/${id}/grade-scales`, {
        method: "PUT",
        body: JSON.stringify(items),
    });
}

export async function setBylawLevelScales(id, items) {
    return apiClient(`/api/Bylaw/${id}/level-scales`, {
        method: "PUT",
        body: JSON.stringify(items),
    });
}

export async function setBylawMinHoursDepartment(id, minHours) {
    return apiClient(`/api/Bylaw/${id}/min-hours-department`, {
        method: "PUT",
        body: JSON.stringify({ minHours }),
    });
}

export async function setBylawMinHoursSpecialization(id, minHours) {
    return apiClient(`/api/Bylaw/${id}/min-hours-specialization`, {
        method: "PUT",
        body: JSON.stringify({ minHours }),
    });
}

export async function updateBylawRequirements(id, data) {
    return apiClient(`/api/Bylaw/${id}/requirements`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function updateBylawPassingGrade(id, data) {
    return apiClient(`/api/Bylaw/${id}/passing-grade`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function updateBylawProbation(id, data) {
    return apiClient(`/api/Bylaw/${id}/probation`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function updateBylawGradeWeights(id, data) {
    return apiClient(`/api/Bylaw/${id}/grade-weights`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function updateBylawMinHours(id, data) {
    return apiClient(`/api/Bylaw/${id}/minhours-departmentAndSpecialization`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function mapCourseToBylaw(bylawId, data) {
    return apiClient(`/api/Bylaw/${bylawId}/courses`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function unmapCourseFromBylaw(bylawCourseId) {
    await apiClient(`/api/Bylaw/courses/${bylawCourseId}`, { method: "DELETE" });
    return true;
}

export async function setCoursePrerequisites(bylawCourseId, data) {
    return apiClient(`/api/Bylaw/courses/${bylawCourseId}/prerequisites`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

// ─── Elective Buckets ──────────────────────────────────────

export async function fetchBucketsByBylaw(bylawId) {
    return apiClient(`/api/ElectiveBuckets/bylaw/${bylawId}`);
}

export async function createBucket(data) {
    return apiClient('/api/ElectiveBuckets', {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateBucket(bucketId, data) {
    return apiClient(`/api/ElectiveBuckets/${bucketId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteBucket(bucketId) {
    await apiClient(`/api/ElectiveBuckets/${bucketId}`, { method: "DELETE" });
    return true;
}

// ─── Exams ─────────────────────────────────────────────────

export async function fetchExams() {
    return apiClient('/api/exams');
}

export async function deleteExam(id) {
    await apiClient(`/api/exams/${id}`, { method: "DELETE" });
    return true;
}

export async function updateExam(id, data) {
    return apiClient(`/api/exams/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function uploadExams(file, examType) {
    const formData = new FormData();
    formData.append("file", file);
    let url = '/api/ExcelImport/exams';
    if (examType) url += `?examType=${examType}`;
    return apiClient(url, {
        method: "POST",
        body: formData,
    });
}

// ─── Student Upload ─────────────────────────────────────────

export async function uploadStudents(file, bylawId) {
    const formData = new FormData();
    formData.append("file", file);
    let url = '/api/ExcelImport/students';
    if (bylawId) url += `?bylawId=${bylawId}`;
    return apiClient(url, {
        method: "POST",
        body: formData,
    });
}

// ─── Departments ────────────────────────────────────────────

export async function fetchDepartments() {
    return apiClient('/api/departments');
}

export async function fetchDepartmentById(id) {
    return apiClient(`/api/departments/${id}`);
}

export async function createDepartment(data) {
    return apiClient('/api/departments', {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateDepartment(id, data) {
    return apiClient(`/api/departments/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteDepartment(id) {
    await apiClient(`/api/departments/${id}`, { method: "DELETE" });
    return true;
}

// ─── Department Specializations ────────────────────────────

export async function fetchSpecializations(departmentId) {
    return apiClient(`/api/Specialization/department/${departmentId}`);
}

export async function createSpecialization(departmentId, data) {
    const payload = {
        name: data.name,
        nameAr: data.nameAr || null,
        departmentId: parseInt(departmentId),
    };
    return apiClient('/api/Specialization', {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function deleteSpecialization(departmentId, specId) {
    await apiClient(`/api/Specialization/${specId}`, { method: "DELETE" });
    return true;
}

// ─── Courses ────────────────────────────────────────────────

export async function fetchCourses() {
    return apiClient('/api/courses');
}

export async function fetchCourseById(id) {
    return apiClient(`/api/courses/${id}`);
}

/** Maps frontend course fields to the backend CreateCourseDto JSON property names */
function toCoursePayload(data) {
    return {
        courseName: data.courseName,
        courseNameAr: data.courseNameAr,
        courseCode: data.courseId,
        departmentName: data.departmentId,
        creditHours: Number(data.creditHours) || 0,
    };
}

export async function createCourse(data) {
    const payload = toCoursePayload(data);
    return apiClient('/api/courses', {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateCourse(id, data) {
    const payload = toCoursePayload(data);
    return apiClient(`/api/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteCourse(id) {
    await apiClient(`/api/courses/${id}`, { method: "DELETE" });
    return true;
}

export async function activateCourse(id) {
    const result = await apiClient(`/api/courses/${id}/activate`, { method: "PATCH" });
    return result ?? true;
}

export async function deactivateCourse(id) {
    const result = await apiClient(`/api/courses/${id}/deactivate`, { method: "PATCH" });
    return result ?? true;
}

// ─── Course Classes ─────────────────────────────────────────

export async function fetchCourseClasses(courseId) {
    return apiClient(`/api/classes/course/${courseId}`);
}

export async function addClassToCourse(courseId, data) {
    const payload = { ...data, courseId: String(courseId) };
    return apiClient('/api/classes', {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function createLecture(courseId, data) {
    const payload = { ...data, courseId: Number(courseId) };
    return apiClient('/api/classes/lecture', {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function createSection(courseId, data) {
    const payload = { ...data, courseId: Number(courseId) };
    return apiClient('/api/classes/section', {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateClass(classId, data) {
    const payload = { ...data };
    const result = await apiClient(`/api/classes/${classId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    return result ?? true;
}

export async function fetchLectureInstructors() {
    return apiClient('/api/classes/lecture-instructors');
}

export async function fetchSectionInstructors() {
    return apiClient('/api/classes/section-instructors');
}

export async function fetchLectureRooms() {
    return apiClient('/api/classes/lecture-rooms');
}

export async function fetchSectionRooms() {
    return apiClient('/api/classes/section-rooms');
}

// ─── Course Students ────────────────────────────────────────

export async function fetchCourseStudents(courseId) {
    return apiClient(`/api/courses/${courseId}/students`);
}

// ─── Course Grades ──────────────────────────────────────────

export async function uploadCourseGrades(courseId, file) {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient(`/api/courses/${courseId}/grades/upload`, {
        method: "POST",
        body: formData,
    });
}

export async function deleteClassFromCourse(courseId, classId) {
    await apiClient(`/api/classes/${classId}`, { method: "DELETE" });
    return true;
}

// ─── Rooms ──────────────────────────────────────────────────

export async function fetchRooms() {
    return apiClient('/api/rooms');
}

export async function fetchRoomById(id) {
    return apiClient(`/api/rooms/${id}`);
}

function toRoomPayload(data) {
    return {
        roomName: data.name,
        roomNameAr: data.nameAr,
        type: data.type,
        capacity: data.capacity,
        location: data.location,
        locationAr: data.locationAr,
    };
}

export async function createRoom(data) {
    const payload = toRoomPayload(data);
    return apiClient('/api/rooms', {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateRoom(id, data) {
    const payload = toRoomPayload(data);
    return apiClient(`/api/rooms/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteRoom(id) {
    await apiClient(`/api/rooms/${id}`, { method: "DELETE" });
    return true;
}

// ─── Student Courses ────────────────────────────────────────

export async function fetchStudentRegisteredCourses(studentId) {
    return apiClient(`/api/Courses/student/${studentId}?status=inprogress`);
}

export async function fetchStudentCompletedCourses(studentId) {
    return apiClient(`/api/Courses/student/${studentId}?status=completed`);
}

export async function fetchAvailableCoursesForStudent(studentId) {
    return apiClient('/api/Courses/active');
}

export async function registerStudentCourse(studentId, courseId, classId = null) {
    const payload = { courseId: Number(courseId) };
    if (classId) {
        payload.classId = Number(classId);
    }
    return await apiClient(`/api/Students/${studentId}/register`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// ─── Email ───────────────────────────────────────────────────

export async function sendEmail({ to, subject, body }) {
    return apiClient('/api/email/send', {
        method: "POST",
        body: JSON.stringify({ to, subject, body }),
    });
}

// ─── Auto Exam Scheduling ───────────────────────────────────

export async function autoSchedule(request) {
    return apiClient('/api/ExamScheduling/auto-schedule', {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export async function detectConflicts({ courseId, date, startTime, endTime, excludeExamId }) {
    const params = new URLSearchParams({
        courseId,
        date,
        startTime,
        endTime,
    });
    if (excludeExamId) params.append("excludeExamId", excludeExamId);
    return apiClient(`/api/ExamScheduling/detect-conflicts?${params}`);
}

export async function getConflictGraph() {
    return apiClient('/api/ExamScheduling/conflict-graph');
}

export async function assignHalls(examId, examHallIds) {
    return apiClient(`/api/ExamScheduling/assign-halls/${examId}`, {
        method: "POST",
        body: JSON.stringify({ examId, examHallIds }),
    });
}

export async function getHallAssignments(examId) {
    return apiClient(`/api/ExamScheduling/hall-assignments/${examId}`);
}

export async function getSeatAssignments(examId) {
    return apiClient(`/api/ExamScheduling/seat-assignments/${examId}`);
}

export async function getAvailableSlots(request) {
    return apiClient('/api/ExamScheduling/available-slots', {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export async function unregisterStudentCourse(studentId, courseId) {
    await apiClient(`/api/Students/${studentId}/courses/${courseId}`, { method: "DELETE" });
    return true;
}

export async function fetchStudentCourseSections(studentId, courseId) {
    return await apiClient(`/api/Classes/course/${courseId}`);
}

export async function changeStudentCourseSection(studentId, courseId, classId) {
    return await apiClient(`/api/Students/${studentId}/courses/${courseId}/section`, {
        method: "PATCH",
        body: JSON.stringify({ classId: Number(classId) }),
    });
}

// ─── Constants ──────────────────────────────────────────────────

export async function fetchStudentTypes() {
    return apiClient('/api/students/types');
}

export async function fetchNationalities() {
    return apiClient('/api/Constants/nationalities');
}

// ─── Instructor Courses ─────────────────────────────────────

export async function fetchInstructorCourses(instructorId) {
    return apiClient(`/api/Courses/instructor/${instructorId}`);
}

export async function fetchInstructorTASections(instructorId) {
    return apiClient(`/api/instructors/${instructorId}/ta-sections`);
}

export async function fetchInstructorAvailableSections(instructorId, courseId) {
    return apiClient(`/api/instructors/${instructorId}/courses/${courseId}/sections`);
}

export async function changeInstructorSection(instructorId, courseId, section) {
    await apiClient(`/api/instructors/${instructorId}/courses/${courseId}/section`, {
        method: "PATCH",
        body: JSON.stringify({ section }),
    });
    return true;
}
