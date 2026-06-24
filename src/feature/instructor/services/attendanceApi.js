import apiClient from "../../../api/apiClient";

export async function fetchClassesByCourse(courseId) {
  return apiClient(`/api/classes/course/${courseId}`);
}

export async function fetchAttendanceReport(classId) {
  return apiClient(`/api/attendance/report/class/${classId}`);
}

export async function createClass(payload) {
  return apiClient('/api/classes', {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function recordAttendance(payload) {
  return apiClient('/api/attendance/record', {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getSessionsByClass(classId) {
  return apiClient(`/api/attendance/sessions/class/${classId}`);
}

export async function createSession(payload) {
  return apiClient('/api/attendance/sessions', {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function scanAttendanceQr(payload) {
  return apiClient('/api/attendance/scan', {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function recordManualAttendance(payload) {
  return apiClient('/api/attendance/manual', {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function generateStudentAttendanceQr() {
  return apiClient('/api/attendance/qr');
}
