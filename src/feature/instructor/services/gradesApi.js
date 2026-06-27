import apiClient from "../../../api/apiClient";

export async function fetchCourseGrades(courseId, { pageIndex = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams({ pageIndex, pageSize });
  return apiClient(`/api/grades/course/${courseId}/overview?${params}`);
}

export async function fetchCourseComplaints(courseId) {
  return apiClient(`/api/grades/course/${courseId}/complaints`);
}

export async function updateComplaintStatus(complaintId, data) {
  return apiClient(`/api/grades/complaint/${complaintId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}