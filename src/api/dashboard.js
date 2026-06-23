import apiClient from "../utils/apiClient";

export async function fetchStudentDashboard() {
  return apiClient("/api/dashboard/student");
}
