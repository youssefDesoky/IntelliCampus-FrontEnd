import apiClient from "../../../utils/apiClient";

export async function fetchMyTeachingCourses() {
  return apiClient('/api/courses/my-teaching');
}

export async function fetchMyStudentCourses() {
  return apiClient('/api/courses/my-courses');
}

export async function fetchAllCourses() {
  return apiClient('/api/courses');
}

export async function fetchCourseById(courseId) {
  return apiClient(`/api/courses/${courseId}`);
}
