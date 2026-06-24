import apiClient from "./apiClient";

export async function fetchStudentDashboard() {
  return apiClient("/api/dashboard/student");
}

export async function fetchInstructorDashboard() {
  return {
    stats: {
      activeCourses: 6,
      totalStudents: 142,
      averageAttendance: 87,
    },
    latestNews: [
      { id: 1, title: "Final exam schedules are now available", course: "CS101 - Intro to Programming", date: "2026-06-20T10:00:00Z" },
      { id: 2, title: "New course materials uploaded for Week 12", course: "MATH201 - Linear Algebra", date: "2026-06-19T14:30:00Z" },
      { id: 3, title: "Guest lecture on AI ethics next Thursday", course: "CS301 - Artificial Intelligence", date: "2026-06-18T09:00:00Z" },
      { id: 4, title: "Project submission deadline extended", course: "SE401 - Software Engineering", date: "2026-06-17T16:00:00Z" },
    ],
    attendanceTrend: [
      { week: "W1", attendance: 92 },
      { week: "W2", attendance: 88 },
      { week: "W3", attendance: 85 },
      { week: "W4", attendance: 90 },
      { week: "W5", attendance: 78 },
      { week: "W6", attendance: 82 },
      { week: "W7", attendance: 91 },
      { week: "W8", attendance: 87 },
    ],
    assignmentCompletion: [
      { course: "CS101", completed: 42, pending: 8 },
      { course: "MATH201", completed: 35, pending: 15 },
      { course: "CS301", completed: 28, pending: 12 },
      { course: "SE401", completed: 18, pending: 2 },
      { course: "PHYS101", completed: 22, pending: 18 },
      { course: "ENG102", completed: 48, pending: 2 },
    ],
  };
}
