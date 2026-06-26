import apiClient from "../../../api/apiClient";

export async function fetchInstructorProfile(instructorId) {
  return apiClient(`/api/instructors/${instructorId}`);
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

export async function fetchInstructorCourses(instructorId) {
  return apiClient(`/api/Courses/instructor/${instructorId}`);
}
