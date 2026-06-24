import apiClient from "../../../api/apiClient";

export async function fetchActiveCourses() {
  return apiClient('/api/courses/active');
}

export async function fetchClassesForCourse(courseId) {
  return apiClient(`/api/classes/course/${courseId}`);
}

export async function registerForCourse(courseId, classId) {
  return apiClient('/api/registration', {
    method: "POST",
    body: JSON.stringify({ courseId, classId }),
  });
}

export async function getMyRegistrations() {
  return apiClient('/api/registration/my-courses');
}

export async function unregisterFromCourse(courseId) {
  await apiClient(`/api/registration/${courseId}`, { method: "DELETE" });
  return true;
}
