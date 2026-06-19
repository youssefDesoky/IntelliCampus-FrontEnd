import apiClient from "../../../utils/apiClient";

export async function fetchCourseQuizzesOverview(courseId) {
  return apiClient(`/api/courses/${courseId}/quizzes`);
}

export async function fetchPracticeQuiz(courseId, quizId) {
  const query = quizId ? `?quizId=${encodeURIComponent(quizId)}` : "";
  return apiClient(`/api/courses/${courseId}/quizzes/practice${query}`);
}

export async function submitPracticeQuiz(courseId, submitData) {
  return apiClient(`/api/courses/${courseId}/quizzes/practice/submit`, {
    method: 'POST',
    body: JSON.stringify(submitData),
  });
}
