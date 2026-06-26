import apiClient from "../../../api/apiClient";

export async function fetchCourseGrades(courseId, { pageIndex = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams({ pageIndex, pageSize });
  return apiClient(`/api/grades/course/${courseId}/overview?${params}`);
}