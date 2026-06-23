import apiClient from "../../../utils/apiClient";

export async function fetchMyTeachingCourses() {
  return apiClient('/api/courses/my-teaching');
}

export async function fetchMyStudentCourses(status = null) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  const query = params.toString();
  return apiClient(`/api/courses/my-courses${query ? `?${query}` : ''}`);
}

export async function fetchAllCourses() {
  return apiClient('/api/courses');
}

export async function fetchCourseById(courseId) {
  return apiClient(`/api/courses/${courseId}`);
}
