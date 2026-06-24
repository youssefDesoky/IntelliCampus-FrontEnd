import apiClient from "../../../api/apiClient";

export async function fetchActiveCourses(params = {}) {
  const { search, status, departmentId, isActiveOnly } = params;
  const query = new URLSearchParams();
  if (search) query.set('search', search);
  if (status) query.set('status', status);
  if (departmentId) query.set('departmentId', departmentId);
  if (isActiveOnly) query.set('isActiveOnly', 'true');
  const qs = query.toString();
  return apiClient(`/api/courses/active${qs ? `?${qs}` : ''}`);
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
