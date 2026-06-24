import apiClient from "../utils/apiClient";

export async function fetchStudentProfile(studentId) {
    return apiClient(`/api/students/${studentId}`);
}
