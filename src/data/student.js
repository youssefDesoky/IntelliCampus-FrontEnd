import coursesData from "./courses";

function calculateGPA(courses) {
    const gradePointsMap = {
        "A": 4.0,
        "A-": 3.7,
        "B+": 3.3,
        "B": 3.0,
        "B-": 2.7,
        "C+": 2.3,
        "C": 2.0,
        "C-": 1.7,
        "D+": 1.3,
        "D": 1.0,
        "F": 0.0
    };

    let totalWeightedPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        const grade = course.grade;
        const points = gradePointsMap[grade];
        const credits = course.creditHours || 3;
        if (typeof points === "number") {
            totalWeightedPoints += points * credits;
            totalCredits += credits;
        }
    });

    return totalCredits === 0 ? "0.00" : (totalWeightedPoints / totalCredits).toFixed(2);
}

function getRankByPoints(points) {
    if (points >= 150) return "Gold Rank";
    if (points >= 100) return "Silver Rank";
    if (points >= 50) return "Bronze Rank";
    return "Participant";
}

function calculateAttendanceOverall(courses) {
    if (courses.length === 0) return 0;
    const totalAttendance = courses.reduce((sum, course) => sum + (course.attendance || 0), 0);
    return Math.round((totalAttendance / courses.length));
}

const studentsData = [
    // Student 1
    {
        name: "Youssef Ahmed Desoky",
        profileImage: "/images/students/youssefDesoky/profile.png",
        attendanceQRCode: "/images/students/youssefDesoky/attendance-qr.png",
        specialization: "Information Systems",
        studentId: "20230625",
        faculty: "Computer Science",
        year: "4th Level",
        semester: "Fall 2025",
        email: "11410120230625@stud.cu.edu.eg",
        phone: "01096132270",
        get gpa() { return calculateGPA(this.courses); },
        get rank() { return getRankByPoints(this.points); },
        get attendanceOverall() { return calculateAttendanceOverall(this.courses); },
        points: 156,
        courses: [
            {
                ...coursesData["Information Systems"][0],
                inProgress: true,
                progress: "50%",
                grade: null,
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-03-01",
                        status: "Pending"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-15",
                        status: "Pending"
                    }
                ],
                attendance: 60
            },
            {
                ...coursesData["Information Systems"][1],
                inProgress: true,
                progress: "55%",
                grade: null,
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-03-05",
                        status: "Pending"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-20",
                        status: "Pending"
                    }
                ],
                attendance: 70
            },
            {
                ...coursesData["Information Systems"][2],
                inProgress: false,
                progress: "85%",
                grade: "A-",
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-02-25",
                        status: "Submitted"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-10",
                        status: "Submitted"
                    }
                ],
                attendance: 90
            },
            {
                ...coursesData["Information Systems"][3],
                inProgress: false,
                progress: "90%",
                grade: "A",
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-02-18",
                        status: "Submitted"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-03",
                        status: "Submitted"
                    }
                ],
                attendance: 95
            },
            {
                ...coursesData["Computer Science"][0],
                inProgress: true,
                progress: "50%",
                grade: null,
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-03-01",
                        status: "Pending"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-15",
                        status: "Pending"
                    }
                ],
                attendance: 65
            },
            {
                ...coursesData["Computer Science"][1],
                inProgress: true,
                progress: "55%",
                grade: null,
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-03-05",
                        status: "Pending"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-20",
                        status: "Pending"
                    }
                ],
                attendance: 75
            },
        ],
        notes: [
            {
                title: "Database Normalization",
                modified: "1 day ago",
                creationDate: "2024-06-09",
                tags: ["Database", "Lecture"],
                content: `Detailed explanation of normalization forms (1NF, 2NF, 3NF) with examples and benefits for database design.`
            },
            {
                id: 8,
                title: "Web Development Basics",
                modified: "1 month ago",
                creationDate: "2024-05-15",
                tags: ["Web Development", "Assignment"],
                content: `Introduction to HTML, CSS, and JavaScript for building responsive and interactive web applications.`
            },
        ],
        reminders: {
            "today": [
                {
                    title: "Submit Final Project Report",
                    dueDate: "Due in 3 hours",
                    status: "Pending",
                    category: "Assignments",
                },
                {
                    title: "Attend Data Science Webinar",
                    dueDate: "5:00 PM",
                    status: "Pending",
                    category: "Events",
                }
            ],
            "tomorrow": [
                {
                    title: "Midterm Exam: Information Systems",
                    dueDate: "10:00 AM",
                    status: "Pending",
                    category: "Exams",
                }
            ],
            "thisWeek": [
                {
                    title: "Group Meeting for Capstone Project",
                    dueDate: "Friday 3:00 PM",
                    status: "Pending",
                    category: "Meetings",
                },
                {
                    title: "Complete Online Course Module",
                    dueDate: "Sunday 11:59 PM",
                    status: "Pending",
                    category: "Courses",
                }
            ]
        }
    },

    // Student 2
    {
        name: "Mohamed Adel EL-Sayed",  
        profileImage: "/images/students/mohamedAdel/profile.png",
        attendanceQRCode: "/images/students/mohamedAdel/attendance-qr.png",
        faculty: "Computer Science",
        studentId: "20230643",
        specialization: "Computer Science",
        year: "4th Level",
        semester: "Fall 2025",
        email: "11410120230643@stud.cu.edu.eg",
        phone: "01115138796",
        get gpa() { return calculateGPA(this.courses); },
        get rank() { return getRankByPoints(this.points); },
        get attendanceOverall() { return calculateAttendanceOverall(this.courses); },
        points: 120,
        courses: [
            {
                ...coursesData["Computer Science"][0],
                inProgress: true,
                progress: "50%",
                grade: null,
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-03-01",
                        status: "Pending"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-15",
                        status: "Pending"
                    }
                ],
                attendance: 65
            },
            {
                ...coursesData["Computer Science"][1],
                inProgress: true,
                progress: "55%",
                grade: null,
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-03-05",
                        status: "Pending"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-20",
                        status: "Pending"
                    }
                ],
                attendance: 75
            },
            {
                ...coursesData["Computer Science"][2],
                inProgress: false,
                progress: "80%",
                grade: "B",
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-02-22",
                        status: "Submitted"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-07",
                        status: "Submitted"
                    }
                ],
                attendance: 88
            },
            {
                ...coursesData["Computer Science"][3],
                inProgress: false,
                progress: "70%",
                grade: "B+",
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-02-28",
                        status: "Submitted"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-12",
                        status: "Submitted"
                    }
                ],
                attendance: 70
            }
        ],
        notes: [
            {
                title: "Operating System Concepts",
                modified: "1 week ago",
                creationDate: "2024-06-05",
                tags: ["Operating Systems", "Assignment"],
                content: `Notes on process management, memory allocation, and file systems in modern operating systems.`
            },
            {
                title: "Software Engineering Principles",
                modified: "3 days ago",
                creationDate: "2024-06-08",
                tags: ["Software Engineering", "Exam"],
                content: `Key principles of software engineering including SDLC, Agile methodologies, and best practices for project management.`
            },
            {
                title: "Binary Search Trees Implementation",
                modified: "2 hours ago",
                creationDate: "2024-06-10",
                tags: ["Data Structures", "Lecture"],
                content: `Comprehensive notes on BST operations including insertion, deletion, and traversal methods with complexity analysis.`
            },
            {
                title: "Algorithm Analysis Techniques",
                modified: "5 days ago",
                creationDate: "2024-06-06",
                tags: ["Algorithms", "Lecture"],
                content: `Overview of Big O notation, time and space complexity analysis, and common algorithmic strategies.`
            },
            {
                title: "Object-Oriented Programming Concepts",
                modified: "3 weeks ago",
                creationDate: "2024-05-25",
                tags: ["Programming", "Lecture"],
                content: `Fundamental concepts of OOP such as classes, objects, inheritance, polymorphism, and encapsulation.`
            },
        ],
        reminders: {
            "today": [
                {
                    title: "Complete Data Structures Assignment",
                    dueDate: "Due in 4 hours",
                    status: "Pending",
                    category: "Assignments",
                },
                {
                    title: "Attend Algorithms Workshop",
                    dueDate: "6:00 PM",
                    status: "Pending",
                    category: "Events",
                }
            ],
            "tomorrow": [
                {
                    title: "Midterm Exam: Computer Science",
                    dueDate: "9:00 AM",
                    status: "Pending",
                    category: "Exams",
                }
            ],
            "thisWeek": [
                {
                    title: "Team Meeting for Group Project",
                    dueDate: "Thursday 4:00 PM",
                    status: "Pending",
                    category: "Meetings",
                },
                {
                    title: "Finish Online Coding Challenge",
                    dueDate: "Sunday 11:59 PM",
                    status: "Pending",
                    category: "Courses",
                }
            ]
        }
    },

    // Student 3
    {
        name: "Youssef Ahmed Saeed",
        profileImage: "/images/students/youssefAhmed/profile.png",
        attendanceQRCode: "/images/students/youssefAhmed/attendance-qr.png",
        faculty: "Computer Science",
        studentId: "20220384",
        specialization: "Information Technology",
        year: "4th Level",
        semester: "Fall 2025",
        email: "11410120220384@stud.cu.edu.eg",
        phone: "01277802223",
        get gpa() { return calculateGPA(this.courses); },
        get rank() { return getRankByPoints(this.points); },
        get attendanceOverall() { return calculateAttendanceOverall(this.courses); },
        points: 110,
        courses: [
            {
                ...coursesData["Information Technology"][0],
                inProgress: true,
                progress: "50%",
                grade: null,
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-03-01",
                        status: "Pending"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-15",
                        status: "Pending"
                    }
                ],
                attendance: 68
            },
            {
                ...coursesData["Information Technology"][1],
                inProgress: true,
                progress: "55%",
                grade: null,
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-03-05",
                        status: "Pending"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-20",
                        status: "Pending"
                    }
                ],
                attendance: 78
            },
            {
                ...coursesData["Information Technology"][2],
                inProgress: false,
                progress: "90%",
                grade: "A",
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-02-18",
                        status: "Submitted"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-03",
                        status: "Submitted"
                    }
                ],
                attendance: 92
            },
            {
                ...coursesData["Information Technology"][3],
                inProgress: false,
                progress: "85%",
                grade: "A-",
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-02-25",
                        status: "Submitted"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-10",
                        status: "Submitted"
                    }
                ],
                attendance: 89
            }
        ],
        notes: [
            {
                title: "Network Protocols Overview",
                modified: "2 weeks ago",
                creationDate: "2024-05-30",
                tags: ["Networking", "Lecture"],
                content: `Summary of key network protocols including TCP/IP, HTTP, FTP, and their roles in data communication.`
            },
        ],
        reminders: {
            "today": [
                {
                    title: "Finish Networking Assignment",
                    dueDate: "Due in 5 hours",
                    status: "Pending",
                    category: "Assignments",
                },
                {
                    title: "Join Cybersecurity Seminar",
                    dueDate: "4:00 PM",
                    status: "Pending",
                    category: "Events",
                }
            ],
            "tomorrow": [
                {
                    title: "Midterm Exam: Information Technology",
                    dueDate: "11:00 AM",
                    status: "Pending",
                    category: "Exams",
                }
            ],
            "thisWeek": [
                {
                    title: "Project Discussion Meeting",
                    dueDate: "Wednesday 2:00 PM",
                    status: "Pending",
                    category: "Meetings",
                },
                {
                    title: "Submit Online Lab Report",
                    dueDate: "Saturday 11:59 PM",
                    status: "Pending",
                    category: "Courses",
                }
            ]
        }
    },

    // Student 4
    {
        name: "Mazen Khaled Taha",
        profileImage: "/images/students/mazenKhaled/profile.png",
        attendanceQRCode: "/images/students/mazenKhaled/attendance-qr.png",
        faculty: "Data Science",
        studentId: "20230624",
        specialization: "Computer Science",
        year: "4th Level",
        semester: "Fall 2025",
        email: "11410120230624@stud.cu.edu.eg",
        phone: "01098510400",
        get gpa() { return calculateGPA(this.courses); },
        get rank() { return getRankByPoints(this.points); },
        get attendanceOverall() { return calculateAttendanceOverall(this.courses); },
        points: 138,
        courses: [
            {
                ...coursesData["Computer Science"][0],
                inProgress: true,
                progress: "50%",
                grade: null,
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-03-01",
                        status: "Pending"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-15",
                        status: "Pending"
                    }
                ],
                attendance: 62
            },
            {
                ...coursesData["Computer Science"][1],
                inProgress: true,
                progress: "55%",
                grade: null,
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-03-05",
                        status: "Pending"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-20",
                        status: "Pending"
                    }
                ],
                attendance: 72
            },
            {
                ...coursesData["Computer Science"][2],
                inProgress: false,
                progress: "80%",
                grade: "B",
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-02-22",
                        status: "Submitted"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-07",
                        status: "Submitted"
                    }
                ],
                attendance: 85
            },
            {
                ...coursesData["Computer Science"][3],
                inProgress: false,
                progress: "70%",
                grade: "B+",
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-02-28",
                        status: "Submitted"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-12",
                        status: "Submitted"
                    }
                ],
                attendance: 89
            }
        ],
        notes: [
            {
                title: "Data Mining Techniques",
                modified: "1 month ago",
                creationDate: "2024-05-10",
                tags: ["Data Science", "Lecture"],
                content: `Exploration of data mining methods including clustering, classification, and association rule mining.`
            }
        ],
        reminders: {
            "today": [
                {
                    title: "Complete Data Analysis Assignment",
                    dueDate: "Due in 2 hours",
                    status: "Pending",
                    category: "Assignments",
                },
                {
                    title: "Attend Data Visualization Workshop",
                    dueDate: "3:00 PM",
                    status: "Pending",
                    category: "Events",
                }
            ],
            "tomorrow": [
                {
                    title: "Midterm Exam: Data Science",
                    dueDate: "10:00 AM",
                    status: "Pending",
                    category: "Exams",
                }
            ],
            "thisWeek": [
                {
                    title: "Group Study Session",
                    dueDate: "Friday 2:00 PM",
                    status: "Pending",
                    category: "Meetings",
                },
                {
                    title: "Submit Online Quiz",
                    dueDate: "Sunday 11:59 PM",
                    status: "Pending",
                    category: "Courses",
                }
            ]
        }
    },

    // Student 5
    {
        name: "Mahmoud Mustafa Anas",
        profileImage: "/images/students/mahmoudAnas/profile.png",
        attendanceQRCode: "/images/students/mahmoudAnas/attendance-qr.png",
        faculty: "Computer Science",
        studentId: "20220323",
        specialization: "Artificial Intelligence",
        year: "4th Level",
        semester: "Fall 2025",
        email: "11410120220323@stud.cu.edu.eg",
        phone: "011153589079",
        get gpa() { return calculateGPA(this.courses); },
        get rank() { return getRankByPoints(this.points); },
        get attendanceOverall() { return calculateAttendanceOverall(this.courses); },
        points: 154,
        courses: [
            {
                ...coursesData["Artificial Intelligence"][0],
                inProgress: true,
                progress: "50%",
                grade: null,
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-03-01",
                        status: "Pending"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-15",
                        status: "Pending"
                    }
                ],
                attendance: 66
            },
            {
                ...coursesData["Artificial Intelligence"][1],
                inProgress: true,
                progress: "55%",
                grade: null,
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-03-05",
                        status: "Pending"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-20",
                        status: "Pending"
                    }
                ],
                attendance: 76
            },
            {
                ...coursesData["Artificial Intelligence"][2],
                inProgress: false,
                progress: "75%",
                grade: "A",
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-02-15",
                        status: "Submitted"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-01",
                        status: "Submitted"
                    }
                ],
                attendance: 85
            },
            {
                ...coursesData["Artificial Intelligence"][3],
                inProgress: false,
                progress: "80%",
                grade: "B+",
                assignments: [
                    {
                        title: "Assignment 1",
                        dueDate: "2024-02-28",
                        status: "Submitted"
                    },
                    {
                        title: "Assignment 2",
                        dueDate: "2024-03-12",
                        status: "Submitted"
                    }
                ],
                attendance:  88
            }
        ],
        notes: [
            {
                title: "Neural Networks Fundamentals",
                modified: "2 weeks ago",
                creationDate: "2024-05-28",
                tags: ["AI", "Lecture"],
                content: `Introduction to neural networks, including architecture, activation functions, and training algorithms.`
            }
        ],
        reminders: {
            "today": [
                {
                    title: "Finalize AI Project Report",
                    dueDate: "Due in 3 hours",
                    status: "Pending",
                    category: "Assignments",
                },
                {
                    title: "Participate in AI Ethics Discussion",
                    dueDate: "5:00 PM",
                    status: "Pending",
                    category: "Events",
                }
            ],
            "tomorrow": [
                {
                    title: "Midterm Exam: Artificial Intelligence",
                    dueDate: "9:00 AM",
                    status: "Pending",
                    category: "Exams",
                }
            ],
            "thisWeek": [
                {
                    title: "AI Research Group Meeting",
                    dueDate: "Thursday 4:00 PM",
                    status: "Pending",
                    category: "Meetings",
                },
                {
                    title: "Complete Online AI Module",
                    dueDate: "Sunday 11:59 PM",
                    status: "Pending",
                    category: "Courses",
                }
            ]
        }
    }
];

export default studentsData;