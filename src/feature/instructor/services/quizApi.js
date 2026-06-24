import apiClient from "../../../api/apiClient";

export async function fetchQuizzesByCourse(courseId) {
  return apiClient(`/api/courses/${courseId}/quizzes`);
}

export async function createQuiz(payload) {
  return apiClient(`/api/courses/${payload.courseId}/quizzes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function addQuestions(courseId, quizId, questions) {
  return apiClient(`/api/courses/${courseId}/quizzes/${quizId}/questions`, {
    method: "POST",
    body: JSON.stringify(questions),
  });
}
