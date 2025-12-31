const coursesData = {
    // Computer Science Courses
    "Computer Science": [
        {
            id: "CS-100",
            creditHours: 3,
            department: "Computer Science",
            semester: "Spring 2024",
            title: "Introduction to Computer Science",
            description: "Learn the basics of computer science and programming.",
            professor: "Dr. John Doe",
            schedule: "Mon 10:00 AM, Wed 11:30 AM",
            room: "Ibrahim Farag Hall",
            numOfStudents: 45,
            weeks: [
                {
                    topic: "Introduction To Data Types",
                    description: "In this week, we will cover the basics of data types in programming including integers, floats, strings, and booleans. Understanding data types is crucial for effective coding and problem-solving.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Introduction to Computer Science Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Introduction to Computer Science.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Introduction to Computer Science.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Introduction to Computer Science.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Control Structures",
                    description: "In this week, we will learn about if-else statements, loops, and other control structures in programming.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Introduction to Computer Science Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Introduction to Computer Science.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Introduction to Computer Science - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Introduction to Computer Science - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Functions and Modules",
                    description: "This week covers defining functions, parameters, return values, and organizing code into modules.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Introduction to Computer Science Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Introduction to Computer Science.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Introduction to Computer Science - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Introduction to Computer Science - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "CS-200",
            creditHours: 3,
            department: "Computer Science",
            semester: "Spring 2024",
            title: "Software Engineering",
            description: "Study software development methodologies and project management.",
            professor: "Mr. Robert Wilson",
            schedule: "Sat 1:00 PM, Wed 4:00 PM",
            numOfStudents: 28,
            room: "Ibrahim Farag Hall",
            weeks: [
                {
                    topic: "Software Development Life Cycle",
                    description: "Introduction to SDLC models including Waterfall, Agile, and Scrum methodologies.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Software Engineering Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Software Engineering.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Software Engineering.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Software Engineering.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Requirements Engineering",
                    description: "Techniques for eliciting, analyzing, and documenting software requirements.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Software Engineering Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Software Engineering.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Software Engineering - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Software Engineering - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Software Design",
                    description: "Principles of software design, architecture, and design patterns.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Software Engineering Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Software Engineering.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Software Engineering - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Software Engineering - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "CS-201",
            creditHours: 3,
            department: "Computer Science",
            semester: "Spring 2024",
            title: "Data Structures and Algorithms",
            description: "Explore fundamental data structures and algorithms.",
            professor: "Prof. Jane Smith",
            schedule: "Tue 1:00 PM, Sun 2:30 PM",
            room: "Hall 7",
            numOfStudents: 30,
            weeks: [
                {
                    topic: "Arrays and Linked Lists",
                    description: "Introduction to basic data structures: arrays, linked lists, and their operations.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Data Structures and Algorithms Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Data Structures and Algorithms.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Data Structures and Algorithms.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Data Structures and Algorithms.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Stacks and Queues",
                    description: "Study of stack and queue data structures and their applications.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Data Structures and Algorithms Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Data Structures and Algorithms.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Data Structures and Algorithms - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Data Structures and Algorithms - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Trees and Graphs",
                    description: "Advanced data structures including trees, graphs, and traversal algorithms.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Data Structures and Algorithms Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Data Structures and Algorithms.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Data Structures and Algorithms - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Data Structures and Algorithms - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "CS-202",
            creditHours: 3,
            department: "Computer Science",
            semester: "Spring 2024",
            title: "Operating Systems",
            description: "Learn about the design and implementation of operating systems.",
            professor: "Prof. Linda Davis",
            schedule: "Tue 10:00 AM, Thu 11:30 AM",
            numOfStudents: 35,
            room: "Ibrahim Farag Hall",
            weeks: [
                {
                    topic: "Processes and Threads",
                    description: "Understanding process management, scheduling, and multithreading.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Operating Systems Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Operating Systems.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Operating Systems.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Operating Systems.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Memory Management",
                    description: "Memory allocation, virtual memory, and paging techniques.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Operating Systems Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Operating Systems.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Operating Systems - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Operating Systems - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "File Systems and I/O",
                    description: "File system organization, I/O operations, and device management.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Operating Systems Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Operating Systems.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Operating Systems - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Operating Systems - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
    ],

    // Information Systems Courses
    "Information Systems": [
        {
            id: "IS-200",
            creditHours: 3,
            department: "Information Systems",
            semester: "Spring 2024",
            title: "Database Management Systems",
            description: "Understand the principles of database design and SQL.",
            professor: "Dr. Michael Brown",
            schedule: "Mon 3:00 PM, Wed 4:30 PM",
            numOfStudents: 40,
            room: "Ibrahim Farag Hall",
            weeks: [
                {
                    topic: "Relational Database Design",
                    description: "Introduction to relational model, normalization, and database design principles.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Database Management Systems Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Database Management Systems.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Database Management Systems.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Database Management Systems.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "SQL and Query Processing",
                    description: "SQL language, query optimization, and transaction management.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Database Management Systems Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Database Management Systems.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Database Management Systems - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Database Management Systems - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Database Administration",
                    description: "Database security, backup, recovery, and performance tuning.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Database Management Systems Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Database Management Systems.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Database Management Systems - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Database Management Systems - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "IS-201",
            creditHours: 3,
            department: "Information Systems",
            semester: "Spring 2024",
            title: "Information Systems Analysis",
            description: "Techniques for system analysis, modeling and requirements gathering.",
            professor: "Dr. Sara Lee",
            schedule: "Tue 9:00 AM, Thu 10:30 AM",
            room: "Hall 3",
            numOfStudents: 33,
            weeks: [
                {
                    topic: "Systems Analysis Fundamentals",
                    description: "Introduction to systems analysis, requirements gathering, and stakeholder analysis.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Information Systems Analysis Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Information Systems Analysis.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Information Systems Analysis.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Information Systems Analysis.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Modeling Techniques",
                    description: "Data flow diagrams, use case modeling, and process modeling.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Information Systems Analysis Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Information Systems Analysis.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Information Systems Analysis - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Information Systems Analysis - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Requirements Specification",
                    description: "Writing functional and non-functional requirements, validation techniques.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Information Systems Analysis Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Information Systems Analysis.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Information Systems Analysis - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Information Systems Analysis - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "IS-207",
            creditHours: 3,
            department: "Information Systems",
            semester: "Spring 2024",
            title: "Web Development",
            description: "Build modern web applications using HTML, CSS, and JavaScript.",
            professor: "Ms. Emily Johnson",
            schedule: "Sun 9:00 AM, Tue 12:00 PM",
            room: "Ibrahim Farag Hall",
            numOfStudents: 25,
            weeks: [
                {
                    topic: "HTML Fundamentals",
                    description: "Introduction to HTML structure, tags, and basic web page creation.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Web Development Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Web Development.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Web Development.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Web Development.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "CSS Styling",
                    description: "Learn how to style web pages with CSS, including layouts and responsive design.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Web Development Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Web Development.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Web Development - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Web Development - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "JavaScript Basics",
                    description: "Introduction to JavaScript for interactivity and dynamic content.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Web Development Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Web Development.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Web Development - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Web Development - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "IS-310",
            creditHours: 3,
            department: "Information Systems",
            semester: "Spring 2024",
            title: "Enterprise Systems",
            description: "Study enterprise resource planning and integration of business systems.",
            professor: "Prof. Ahmed Hassan",
            schedule: "Mon 2:00 PM, Wed 2:00 PM",
            room: "Ibrahim Farag Hall",
            numOfStudents: 27,
            weeks: [
                {
                    topic: "Overview of Enterprise Systems",
                    description: "Understanding the role and components of enterprise systems in organizations.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Enterprise Systems Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Enterprise Systems.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Enterprise Systems.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Enterprise Systems.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "ERP Implementation",
                    description: "Steps and challenges in implementing Enterprise Resource Planning systems.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Enterprise Systems Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Enterprise Systems.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Enterprise Systems - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Enterprise Systems - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Integration and Data Flow",
                    description: "How enterprise systems integrate with other business processes and manage data.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Enterprise Systems Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Enterprise Systems.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Enterprise Systems - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Enterprise Systems - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
    ],

    // Artificial Intelligence Courses
    "Artificial Intelligence": [
        {
            id: "AI-101",
            creditHours: 3,
            department: "Artificial Intelligence",
            semester: "Spring 2024",
            title: "Artificial Intelligence",
            description: "Explore the concepts and techniques of artificial intelligence.",
            professor: "Dr. Patricia Martinez",
            schedule: "Mon 12:00 PM, Wed 1:30 PM",
            numOfStudents: 32,
            room: "Ibrahim Farag Hall",
            weeks: [
                {
                    topic: "What is AI?",
                    description: "Introduction to artificial intelligence, its history, and basic concepts.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Artificial Intelligence Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Artificial Intelligence.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Artificial Intelligence.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Artificial Intelligence.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "AI Techniques",
                    description: "Overview of key AI techniques like search algorithms and knowledge representation.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Artificial Intelligence Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Artificial Intelligence.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Artificial Intelligence - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Artificial Intelligence - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "AI Applications",
                    description: "Exploring real-world applications of AI in various industries.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Artificial Intelligence Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Artificial Intelligence.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Artificial Intelligence - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Artificial Intelligence - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "AI-102",
            creditHours: 3,
            department: "Artificial Intelligence",
            semester: "Spring 2024",
            title: "Machine Learning Basics",
            description: "Introduction to supervised and unsupervised learning methods.",
            professor: "Dr. Kevin Park",
            schedule: "Tue 11:00 AM, Thu 12:30 PM",
            room: "Hall 5",
            numOfStudents: 34,
            weeks: [
                {
                    topic: "Introduction to Machine Learning",
                    description: "Basics of machine learning, types of learning, and supervised vs unsupervised.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Machine Learning Basics Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Machine Learning Basics.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Machine Learning Basics.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Machine Learning Basics.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Data Preparation",
                    description: "Techniques for preparing data for machine learning models.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Machine Learning Basics Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Machine Learning Basics.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Machine Learning Basics - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Machine Learning Basics - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Model Evaluation",
                    description: "How to evaluate and validate machine learning models.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Machine Learning Basics Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Machine Learning Basics.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Machine Learning Basics - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Machine Learning Basics - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "AI-201",
            creditHours: 3,
            department: "Artificial Intelligence",
            semester: "Spring 2024",
            title: "Neural Networks",
            description: "Study neural network architectures and training techniques.",
            professor: "Prof. Lina Gomez",
            schedule: "Wed 9:00 AM, Fri 10:30 AM",
            room: "Hall 2",
            numOfStudents: 26,
            weeks: [
                {
                    topic: "Neural Network Fundamentals",
                    description: "Understanding neurons, layers, and basic neural network architecture.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Neural Networks Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Neural Networks.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Neural Networks.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Neural Networks.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Training Neural Networks",
                    description: "Backpropagation, optimization algorithms, and training processes.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Neural Networks Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Neural Networks.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Neural Networks - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Neural Networks - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Deep Learning Applications",
                    description: "Applications of deep neural networks in image recognition and more.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Neural Networks Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Neural Networks.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Neural Networks - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Neural Networks - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "AI-250",
            creditHours: 3,
            department: "Artificial Intelligence",
            semester: "Spring 2024",
            title: "Ethics in AI",
            description: "Examine ethical, legal and societal implications of AI systems.",
            professor: "Dr. Omar Khaled",
            schedule: "Sun 11:00 AM, Tue 1:30 PM",
            room: "Ibrahim Farag Hall",
            numOfStudents: 30,
            weeks: [
                {
                    topic: "Ethical Issues in AI",
                    description: "Discussing bias, privacy, and fairness in AI systems.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Ethics in AI Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Ethics in AI.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Ethics in AI.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Ethics in AI.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Responsible AI Development",
                    description: "Best practices for developing ethical AI solutions.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Ethics in AI Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Ethics in AI.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Ethics in AI - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Ethics in AI - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "AI Regulation and Policy",
                    description: "Current regulations and future policies for AI.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Ethics in AI Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Ethics in AI.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Ethics in AI - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Ethics in AI - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
    ],

    // Information Technology Courses
    "Information Technology": [
        {
            id: "IT-300",
            creditHours: 3,
            department: "Information Technology",
            semester: "Spring 2024",
            title: "Computer Networks",
            description: "Understand the principles of computer networking and protocols.",
            professor: "Prof. William Anderson",
            schedule: "Tue 3:00 PM, Sat 4:30 PM",
            numOfStudents: 38,
            room: "Ibrahim Farag Hall",
            weeks: [
                {
                    topic: "Network Fundamentals",
                    description: "Basics of computer networks, OSI model, and TCP/IP.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Computer Networks Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Computer Networks.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Computer Networks.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Computer Networks.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Network Devices and Protocols",
                    description: "Routers, switches, and common network protocols.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Computer Networks Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Computer Networks.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Computer Networks - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Computer Networks - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Network Security",
                    description: "Introduction to securing computer networks.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Computer Networks Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Computer Networks.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Computer Networks - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Computer Networks - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "IT-301",
            creditHours: 3,
            department: "Information Technology",
            semester: "Spring 2024",
            title: "Systems Administration",
            description: "Learn server administration, scripting and automation.",
            professor: "Ms. Nadia El-Sayed",
            schedule: "Mon 9:00 AM, Thu 2:00 PM",
            room: "Lab 1",
            numOfStudents: 22,
            weeks: [
                {
                    topic: "Server Management",
                    description: "Introduction to server hardware, operating systems, and basic administration tasks.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Systems Administration Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Systems Administration.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Systems Administration.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Systems Administration.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Network Services",
                    description: "Configuring network services, DNS, DHCP, and web servers.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Systems Administration Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Systems Administration.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Systems Administration - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Systems Administration - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Automation and Security",
                    description: "Scripting for automation, security best practices, and monitoring.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Systems Administration Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Systems Administration.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Systems Administration - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Systems Administration - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "IT-310",
            creditHours: 3,
            department: "Information Technology",
            semester: "Spring 2024",
            title: "Cybersecurity Fundamentals",
            description: "Introduction to security principles, threats and defenses.",
            professor: "Dr. Karim Soliman",
            schedule: "Wed 3:00 PM, Fri 1:00 PM",
            room: "Hall 6",
            numOfStudents: 36,
            weeks: [
                {
                    topic: "Security Principles",
                    description: "Introduction to information security, CIA triad, and basic concepts.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Cybersecurity Fundamentals Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Cybersecurity Fundamentals.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Cybersecurity Fundamentals.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Cybersecurity Fundamentals.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Threats and Vulnerabilities",
                    description: "Common threats, vulnerabilities, and attack vectors.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Cybersecurity Fundamentals Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Cybersecurity Fundamentals.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Cybersecurity Fundamentals - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Cybersecurity Fundamentals - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Defense Mechanisms",
                    description: "Security controls, encryption, and best practices.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Cybersecurity Fundamentals Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Cybersecurity Fundamentals.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Cybersecurity Fundamentals - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Cybersecurity Fundamentals - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "IT-320",
            creditHours: 3,
            department: "Information Technology",
            semester: "Spring 2024",
            title: "Cloud Computing",
            description: "Concepts and hands-on with cloud services and deployment models.",
            professor: "Prof. Mona Farouk",
            schedule: "Tue 8:00 AM, Thu 9:30 AM",
            room: "Lab 2",
            numOfStudents: 29,
            weeks: [
                {
                    topic: "Cloud Fundamentals",
                    description: "Introduction to cloud computing, service models, and deployment types.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Cloud Computing Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Cloud Computing.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Cloud Computing.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Cloud Computing.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Cloud Services",
                    description: "Major cloud providers, IaaS, PaaS, SaaS offerings.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Cloud Computing Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Cloud Computing.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Cloud Computing - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Cloud Computing - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Cloud Security and Migration",
                    description: "Security in the cloud, migration strategies, and best practices.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Cloud Computing Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Cloud Computing.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Cloud Computing - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Cloud Computing - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
    ],

    // Data Science Courses
    "Data Science": [
        {
            id: "DS-150",
            creditHours: 3,
            department: "Data Science",
            semester: "Spring 2024",
            title: "Introduction to Data Science",
            description: "Learn the fundamentals of data science and data analysis.",
            professor: "Dr. Barbara Thomas",
            schedule: "Thu 9:00 AM, Sun 10:30 AM",
            numOfStudents: 29,
            room: "Ibrahim Farag Hall",
            weeks: [
                {
                    topic: "Data Science Overview",
                    description: "Introduction to data science, its importance, and basic concepts.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Introduction to Data Science Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Introduction to Data Science.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Introduction to Data Science.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Introduction to Data Science.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Data Collection and Cleaning",
                    description: "Methods for data collection, preprocessing, and cleaning.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Introduction to Data Science Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Introduction to Data Science.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Introduction to Data Science - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Introduction to Data Science - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Data Analysis Basics",
                    description: "Basic statistical analysis and data visualization techniques.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Introduction to Data Science Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Introduction to Data Science.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Introduction to Data Science - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Introduction to Data Science - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "DS-151",
            creditHours: 3,
            department: "Data Science",
            semester: "Spring 2024",
            title: "Statistics for Data Science",
            description: "Probability and statistical methods for data analysis.",
            professor: "Dr. Hala Mohamed",
            schedule: "Mon 11:00 AM, Wed 12:30 PM",
            room: "Hall 4",
            numOfStudents: 31,
            weeks: [
                {
                    topic: "Descriptive Statistics",
                    description: "Measures of central tendency, dispersion, and data distribution.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Statistics for Data Science Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Statistics for Data Science.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Statistics for Data Science.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Statistics for Data Science.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Probability Theory",
                    description: "Basic probability concepts, distributions, and statistical inference.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Statistics for Data Science Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Statistics for Data Science.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Statistics for Data Science - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Statistics for Data Science - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Hypothesis Testing",
                    description: "Statistical testing, p-values, and confidence intervals.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Statistics for Data Science Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Statistics for Data Science.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Statistics for Data Science - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Statistics for Data Science - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "DS-210",
            creditHours: 3,
            department: "Data Science",
            semester: "Spring 2024",
            title: "Data Visualization",
            description: "Techniques and tools for visualizing data effectively.",
            professor: "Mr. Tamer Ali",
            schedule: "Tue 2:00 PM, Thu 3:30 PM",
            room: "Lab 3",
            numOfStudents: 24,
            weeks: [
                {
                    topic: "Visualization Tools",
                    description: "Introduction to data visualization tools and software.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Data Visualization Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Data Visualization.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Data Visualization.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Data Visualization.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Chart Types",
                    description: "Different types of charts and when to use them.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Data Visualization Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Data Visualization.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Data Visualization - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Data Visualization - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Interactive Dashboards",
                    description: "Creating interactive dashboards for data presentation.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Data Visualization Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Data Visualization.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Data Visualization - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Data Visualization - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
        {
            id: "DS-220",
            creditHours: 3,
            department: "Data Science",
            semester: "Spring 2024",
            title: "Machine Learning for Data Science",
            description: "Applied machine learning techniques for data-driven projects.",
            professor: "Prof. Rania Youssef",
            schedule: "Sun 1:00 PM, Fri 10:00 AM",
            room: "Hall 8",
            numOfStudents: 28,
            weeks: [
                {
                    topic: "Supervised Learning",
                    description: "Algorithms and techniques for supervised machine learning.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Machine Learning for Data Science Chapter 1.mp4",
                            size: 2.8,
                        },
                        {
                            id: 2,
                            title: "Assignment 1 - Machine Learning for Data Science.pdf",
                            size: 1.2,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Machine Learning for Data Science.pdf",
                            size: 0.9,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Machine Learning for Data Science.pptx",
                            size: 3.5,
                        }
                    ]
                },
                {
                    topic: "Unsupervised Learning",
                    description: "Clustering and dimensionality reduction techniques.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Machine Learning for Data Science Chapter 2.mp4",
                            size: 2.5,
                        },
                        {
                            id: 2,
                            title: "Assignment 2 - Machine Learning for Data Science.pdf",
                            size: 1.3,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Machine Learning for Data Science - Update.pdf",
                            size: 1.0,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Machine Learning for Data Science - Week 2.pptx",
                            size: 3.7,
                        }
                    ]
                },
                {
                    topic: "Model Evaluation",
                    description: "Metrics and methods for evaluating machine learning models.",
                    materials: [
                        {
                            id: 1,
                            title: "Lecture Notes - Machine Learning for Data Science Chapter 3.mp4",
                            size: 2.9,
                        },
                        {
                            id: 2,
                            title: "Assignment 3 - Machine Learning for Data Science.pdf",
                            size: 1.4,
                        },
                        {
                            id: 3,
                            title: "Project Guidelines - Machine Learning for Data Science - Final.pdf",
                            size: 1.1,
                        },
                        {
                            id: 4,
                            title: "Supplementary Reading Material - Machine Learning for Data Science - Week 3.pptx",
                            size: 3.8,
                        }
                    ]
                }
            ],
        },
    ]
};

export default coursesData;