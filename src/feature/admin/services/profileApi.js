import apiClient from "../../../api/apiClient";

export async function fetchAdminProfile(adminId) {
  return apiClient(`/api/admins/${adminId}`);
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
