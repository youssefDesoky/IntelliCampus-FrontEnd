import { API_URL } from "../../../config/api";

/**
 * Fetch overall grade and breakdown for a specific course
 * @param {number} courseId - The course ID
 * @returns {Promise<Object>} Course grade data with overall grade and assessment breakdown
 */
export const fetchCourseGrade = async (courseId) => {
    const response = await fetch(`${API_URL}/api/grades/course/${courseId}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    // 404 means no grades yet (backend returns null for students with no graded assignments)
    if (response.status === 404) {
        console.log(`No grades yet for course ${courseId}`);
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
        console.error("Backend error:", errorMsg);
        throw new Error(errorMsg);
    }

    const data = await response.json();
    // If backend returns null, student has no grades yet
    if (!data) {
        console.log(`Student has no grades yet for course ${courseId}`);
        return null;
    }
    return data;
};

/**
 * Fetch all grades for the current student across all courses
 * @returns {Promise<Array>} Array of grade objects for all courses
 */
export const fetchAllMyGrades = async () => {
    const response = await fetch(`${API_URL}/api/grades/my-grades`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch all grades: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

/**
 * File a grade complaint for an assessment
 * @param {Object} complaintData - Complaint data (reasons, description, etc.)
 * @returns {Promise<Object>} Created complaint response
 */
export const fileGradeComplaint = async (complaintData) => {
    const response = await fetch(`${API_URL}/api/grades/complaint`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintData),
    });

    if (!response.ok) {
        throw new Error(`Failed to file complaint: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

/**
 * Fetch all grade complaints filed by the current student
 * @returns {Promise<Array>} Array of complaint objects
 */
export const fetchMyComplaints = async () => {
    const response = await fetch(`${API_URL}/api/grades/complaints`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch complaints: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

/**
 * Fetch transcript data for the current student
 * GET /api/grades/transcript
 * @returns {Promise<Array>} Array of TranscriptCourseDto objects
 */
export const fetchTranscript = async () => {
    const response = await fetch(`${API_URL}/api/grades/transcript`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch transcript: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

/**
 * Export transcript as PDF and trigger download
 * GET /api/grades/transcript/export
 */
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
