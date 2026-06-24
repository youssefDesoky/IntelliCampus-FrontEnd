import apiClient from "../../../api/apiClient";

export async function fetchCourseGrades(courseId) {
  return apiClient(`/api/grades/instructor/course/${courseId}`);
}
