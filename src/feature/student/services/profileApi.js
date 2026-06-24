import apiClient from "../../../api/apiClient";

export async function fetchStudentProfile(studentId) {
  return apiClient(`/api/students/${studentId}`);
}

export async function updateProfileImage(dataUrl) {
  return apiClient('/api/auth/profile/image', {
    method: "PUT",
    body: JSON.stringify(dataUrl),
  });
}

export async function updateProfile(data) {
  return apiClient('/api/auth/profile', {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function changePassword(currentPassword, newPassword) {
  return apiClient('/api/auth/change-password', {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function generateAttendanceQr() {
  return apiClient('/api/attendance/qr');
}

export async function fetchCommunities() {
  return apiClient('/api/communities');
}

export async function fetchCoursePrerequisites() {
  return apiClient('/api/courses/prerequisites');
}

export async function fetchMyAttendance(courseId) {
  return apiClient(`/api/attendance/my-attendance/course/${courseId}`);
}

export async function submitExcuse(courseId, { sessionId, reason, file }) {
  const formData = new FormData();
  formData.append("SessionId", sessionId);
  formData.append("Reason", reason);
  formData.append("Document", file);

  return apiClient(`/api/courses/${courseId}/attendance/excuse`, {
    method: "POST",
    body: formData,
  });
}

export async function fetchStudentNotes(studentId) {
  return apiClient(`/api/students/${studentId}`);
}
