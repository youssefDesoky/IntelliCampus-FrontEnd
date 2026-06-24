import apiClient from "../../../utils/apiClient";

export async function fetchMyExams() {
  return apiClient('/api/instructor/examschedule/my-exams');
}

export async function fetchMidterms() {
  return apiClient('/api/instructor/examschedule/my-exams/midterms');
}

export async function fetchFinals() {
  return apiClient('/api/instructor/examschedule/my-exams/finals');
}

export async function fetchUpcomingExams() {
  return apiClient('/api/instructor/examschedule/my-exams/upcoming');
}

export async function fetchExamScheduleById(examScheduleId) {
  return apiClient(`/api/instructor/examschedule/${examScheduleId}`);
}

export async function exportExamSchedulePdf(type, status) {
  let url = '/api/instructor/examschedule/my-exams/export';
  const params = [];
  if (type) params.push(`type=${encodeURIComponent(type)}`);
  if (status) params.push(`status=${encodeURIComponent(status)}`);
  if (params.length) url += `?${params.join("&")}`;

  const res = await fetch(`${import.meta.env.VITE_API_URL || ''}${url}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to export exam schedule: ${res.status}`);

  const blob = await res.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "ExamSchedule.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}
