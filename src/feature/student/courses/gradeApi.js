import { API_URL } from "../../../config/api";
import apiClient from "../../../utils/apiClient";

export const fetchCourseGrade = async (courseId) => {
  const response = await fetch(`${API_URL}/api/grades/course/${courseId}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    let errorMsg = `Failed to fetch course grade: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMsg = errorData.message;
      }
    } catch (e) {
      // Could not parse error response, use generic message
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  if (!data) {
    return null;
  }
  return data;
};

export const fetchAllMyGrades = async () => {
  return apiClient('/api/grades/my-grades');
};

export const fileGradeComplaint = async (complaintData) => {
  return apiClient('/api/grades/complaint', {
    method: 'POST',
    body: JSON.stringify(complaintData),
  });
};

export const fetchMyComplaints = async () => {
  return apiClient('/api/grades/complaints');
};

export const fetchTranscript = async () => {
  return apiClient('/api/grades/transcript');
};

export const exportTranscriptPdf = async () => {
  const response = await fetch(`${API_URL}/api/grades/transcript/export`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to export transcript: ${response.status} ${response.statusText}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Transcript.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
