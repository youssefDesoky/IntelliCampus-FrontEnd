import apiClient from "../../../utils/apiClient";

export async function fetchMySchedule(types = []) {
  let url = '/api/instructor/schedule/my-schedule';

  if (types && types.length > 0) {
    const typeParams = types.map((t) => `type=${encodeURIComponent(t)}`).join("&");
    url += `?${typeParams}`;
  }

  return apiClient(url);
}

export async function fetchScheduleById(scheduleId) {
  return apiClient(`/api/instructor/schedule/${scheduleId}`);
}

export async function exportSchedulePdf(types = []) {
  let url = '/api/instructor/schedule/my-schedule/export';

  if (types && types.length > 0) {
    const typeParams = types.map((t) => `type=${encodeURIComponent(t)}`).join("&");
    url += `?${typeParams}`;
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL || ''}${url}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to export schedule: ${res.status}`);

  const blob = await res.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "WeeklySchedule.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}
