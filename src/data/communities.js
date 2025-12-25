import studentsData from "./student";
import instructorsData from "./instructors";

const communitiesData = [
    {
        courseId: "CS-100",
        courseTitle: "Introduction to Computer Science",
        department: "Computer Science",
        description: "Community for Introduction to Computer Science (CS-100). Discuss lectures, assignments and exams.",
        posts: [
            {
                id: "CS-100-p1",
                title: "Question about lecture 3",
                content: "Can someone explain the difference between compile-time and run-time errors with examples?",
                sender: studentsData[1].name,
                senderId: studentsData[1].id,
                createdAt: "2024-03-12T10:00:00Z",
                likes: 12,
                comments: [
                    {
                        id: "CS-100-p1-c1",
                        sender: studentsData[2].name,
                        senderId: studentsData[2].id,
                        content: "Compile-time errors are caught by the compiler (syntax), run-time occur while program runs (exceptions).",
                        createdAt: "2024-03-12T11:00:00Z"
                    }
                ],
                tags: ["lecture", "errors"],
                pinned: true
            },
            {
                id: "CS-100-p2",
                title: "Shared solution template",
                content: "I uploaded a starter template for the first lab on GitHub (link in comments).",
                sender: studentsData[3].name,
                senderId: studentsData[3].id,
                createdAt: "2024-03-10T08:30:00Z",
                likes: 20,
                comments: [],
                tags: ["resources", "lab"],
                pinned: false
            },
            {
                id: "CS-100-p3",
                title: "Study group",
                content: "Looking for 2-3 people to review lecture notes for the quiz on Friday.",
                sender: studentsData[0].name,
                senderId: studentsData[0].id,
                createdAt: "2024-03-11T14:15:00Z",
                likes: 5,
                comments: [],
                tags: ["study-group"],
                pinned: false
            },
                        {
                id: "CS-200-p1",
                title: "Project ideas",
                content: "Share your project ideas for the term project. I'm thinking of a task tracker app.",
                sender: studentsData[4].name,
                senderId: studentsData[4].id,
                createdAt: "2024-04-01T09:00:00Z",
                likes: 18,
                comments: [
                    {
                        id: "CS-200-p1-c1",
                        sender: studentsData[0].name,
                        senderId: studentsData[0].id,
                        content: "Task tracker is good — consider adding time tracking and analytics.",
                        createdAt: "2024-04-01T10:05:00Z"
                    }
                ],
                tags: ["project", "ideas"],
                pinned: true
            },
            {
                id: "CS-200-p2",
                title: "Team formation",
                content: "Looking for teammates with frontend experience.",
                sender: studentsData[1].name,
                senderId: studentsData[1].id,
                createdAt: "2024-04-02T12:20:00Z",
                likes: 7,
                comments: [],
                tags: ["team", "project"],
                pinned: false
            },
            {
                id: "CS-200-p3",
                title: "Recommended reading",
                content: "Agile Estimating and Planning is a good read for this course.",
                sender: instructorsData[0].name,
                senderId: instructorsData[0].id,
                createdAt: "2024-04-03T08:00:00Z",
                likes: 10,
                comments: [],
                tags: ["reading", "agile"],
                pinned: false
            }
        ]
    },
    {
        courseId: "CS-200",
        courseTitle: "Software Engineering",
        department: "Computer Science",
        description: "Community for Software Engineering (CS-200).",
        posts: [
            {
                id: "CS-200-p1",
                title: "Project ideas",
                content: "Share your project ideas for the term project. I'm thinking of a task tracker app.",
                sender: studentsData[4].name,
                senderId: studentsData[4].id,
                createdAt: "2024-04-01T09:00:00Z",
                likes: 18,
                comments: [
                    {
                        id: "CS-200-p1-c1",
                        sender: studentsData[0].name,
                        senderId: studentsData[0].id,
                        content: "Task tracker is good — consider adding time tracking and analytics.",
                        createdAt: "2024-04-01T10:05:00Z"
                    }
                ],
                tags: ["project", "ideas"],
                pinned: true
            },
            {
                id: "CS-200-p2",
                title: "Team formation",
                content: "Looking for teammates with frontend experience.",
                sender: studentsData[1].name,
                senderId: studentsData[1].id,
                createdAt: "2024-04-02T12:20:00Z",
                likes: 7,
                comments: [],
                tags: ["team", "project"],
                pinned: false
            },
            {
                id: "CS-200-p3",
                title: "Recommended reading",
                content: "Agile Estimating and Planning is a good read for this course.",
                sender: instructorsData[0].name,
                senderId: instructorsData[0].id,
                createdAt: "2024-04-03T08:00:00Z",
                likes: 10,
                comments: [],
                tags: ["reading", "agile"],
                pinned: false
            }
        ]
    },
    {
        courseId: "CS-201",
        courseTitle: "Data Structures and Algorithms",
        department: "Computer Science",
        description: "Community for Data Structures and Algorithms (CS-201).",
        posts: [
            {
                id: "CS-201-p1",
                title: "Heap vs Priority Queue",
                content: "Can someone explain when to use a binary heap vs built-in priority queue?",
                sender: studentsData[0].name,
                senderId: studentsData[0].id,
                createdAt: "2024-05-05T07:45:00Z",
                likes: 14,
                comments: [
                    {
                        id: "CS-201-p1-c1",
                        sender: instructorsData[2].name,
                        senderId: instructorsData[2].id,
                        content: "Heaps are an implementation; priority queue is an abstract data type. Use heaps for efficient extract-min.",
                        createdAt: "2024-05-05T09:00:00Z"
                    }
                ],
                tags: ["algorithms", "data-structures"],
                pinned: true
            },
            {
                id: "CS-201-p2",
                title: "Exam topics list",
                content: "Shared a concise list of topics to focus on for the midterm.",
                sender: studentsData[1].name,
                senderId: studentsData[1].id,
                createdAt: "2024-05-06T10:10:00Z",
                likes: 22,
                comments: [],
                tags: ["exam", "topics"],
                pinned: false
            },
            {
                id: "CS-201-p3",
                title: "Practice problems",
                content: "Posting a set of practice problems with solutions.",
                sender: studentsData[2].name,
                senderId: studentsData[2].id,
                createdAt: "2024-05-07T13:00:00Z",
                likes: 9,
                comments: [],
                tags: ["practice", "solutions"],
                pinned: false
            }
        ]
    },
    {
        courseId: "CS-202",
        courseTitle: "Operating Systems",
        department: "Computer Science",
        description: "Community for Operating Systems (CS-202).",
        posts: [
            {
                id: "CS-202-p1",
                title: "Lab environment setup",
                content: "Instructions to setup the VM for the OS labs.",
                sender: instructorsData[3].name,
                senderId: instructorsData[3].id,
                createdAt: "2024-06-01T08:00:00Z",
                likes: 16,
                comments: [],
                tags: ["lab", "setup"],
                pinned: true
            },
            {
                id: "CS-202-p2",
                title: "Page replacement algo comparison",
                content: "Which algorithm performs best for random access patterns?",
                sender: instructorsData[3].name,
                senderId: instructorsData[3].id,
                createdAt: "2024-06-02T11:30:00Z",
                likes: 6,
                comments: [],
                tags: ["memory", "algorithms"],
                pinned: false
            },
            {
                id: "CS-202-p3",
                title: "Office hours recap",
                content: "Summary of professor's answers during today's office hours.",
                sender: instructorsData[4].name,
                senderId: instructorsData[4].id,
                createdAt: "2024-06-03T15:20:00Z",
                likes: 4,
                comments: [],
                tags: ["office-hours"],
                pinned: false
            }
        ]
    },
    {
        courseId: "IS-200",
        courseTitle: "Database Management Systems",
        department: "Information Systems",
        description: "Community for Database Management Systems (IS-200).",
        posts: [
            {
                id: "IS-200-p1",
                title: "Normalization examples",
                content: "Shared examples for 1NF, 2NF, 3NF transformations.",
                sender: studentsData[3].name,
                senderId: studentsData[3].id,
                createdAt: "2024-02-20T09:00:00Z",
                likes: 11,
                comments: [],
                tags: ["database", "normalization"],
                pinned: true
            },
            {
                id: "IS-200-p2",
                title: "SQL query help",
                content: "I'm getting an unexpected join result — posted query in comments.",
                sender: studentsData[4].name,
                senderId: studentsData[4].id,
                createdAt: "2024-02-21T13:45:00Z",
                likes: 8,
                comments: [
                    {
                        id: "IS-200-p2-c1",
                        sender: instructorsData[4].name,
                        senderId: instructorsData[4].id,
                        content: "Check your join keys and consider using explicit JOIN syntax.",
                        createdAt: "2024-02-21T14:10:00Z"
                    }
                ],
                tags: ["sql", "help"],
                pinned: false
            },
            {
                id: "IS-200-p3",
                title: "ER diagram tools",
                content: "Which tool do you recommend for drawing ER diagrams?",
                sender: studentsData[0].name,
                senderId: studentsData[0].id,
                createdAt: "2024-02-22T10:00:00Z",
                likes: 5,
                comments: [],
                tags: ["tools"],
                pinned: false
            }
        ]
    },
    {
        courseId: "IS-201",
        courseTitle: "Information Systems Analysis",
        department: "Information Systems",
        description: "Community for Information Systems Analysis (IS-201).",
        posts: [
            {
                id: "IS-201-p1",
                title: "Requirement gathering tips",
                content: "Best practices when interviewing stakeholders for requirements.",
                sender: studentsData[2].name,
                senderId: studentsData[2].id,
                createdAt: "2024-03-01T09:30:00Z",
                likes: 9,
                comments: [],
                tags: ["requirements"],
                pinned: true
            },
            {
                id: "IS-201-p2",
                title: "Modeling tools",
                content: "Shared UML diagrams for the sample case study.",
                sender: studentsData[1].name,
                senderId: studentsData[1].id,
                createdAt: "2024-03-02T12:00:00Z",
                likes: 7,
                comments: [],
                tags: ["uml", "case-study"],
                pinned: false
            },
            {
                id: "IS-201-p3",
                title: "Interview checklist",
                content: "Posting a checklist template for stakeholder interviews.",
                sender: studentsData[4].name,
                senderId: studentsData[4].id,
                createdAt: "2024-03-03T16:45:00Z",
                likes: 3,
                comments: [],
                tags: ["templates"],
                pinned: false
            }
        ]
    },
    {
        courseId: "IS-207",
        courseTitle: "Web Development",
        department: "Information Systems",
        description: "Community for Web Development (IS-207).",
        posts: [
            {
                id: "IS-207-p1",
                title: "Frontend starter kit",
                content: "Shared a boilerplate with React + Tailwind setup for the course projects.",
                sender: studentsData[4].name,
                senderId: studentsData[4].id,
                createdAt: "2024-04-15T10:00:00Z",
                likes: 25,
                comments: [],
                tags: ["frontend", "react"],
                pinned: true
            },
            {
                id: "IS-207-p2",
                title: "Deployment tips",
                content: "How to deploy a static site with CI to GitHub Pages or Netlify.",
                sender: studentsData[3].name,
                senderId: studentsData[3].id,
                createdAt: "2024-04-16T11:30:00Z",
                likes: 13,
                comments: [],
                tags: ["deployment"],
                pinned: false
            },
            {
                id: "IS-207-p3",
                title: "Accessibility checklist",
                content: "Simple checklist to make your web pages accessible.",
                sender: studentsData[1].name,
                senderId: studentsData[1].id,
                createdAt: "2024-04-17T09:15:00Z",
                likes: 6,
                comments: [],
                tags: ["accessibility"],
                pinned: false
            }
        ]
    },
    {
        courseId: "IS-310",
        courseTitle: "Enterprise Systems",
        department: "Information Systems",
        description: "Community for Enterprise Systems (IS-310).",
        posts: [
            {
                id: "IS-310-p1",
                title: "ERP case studies",
                content: "Shared notes on major ERP implementations and lessons learned.",
                sender: studentsData[2].name,
                senderId: studentsData[2].id,
                createdAt: "2024-05-10T08:00:00Z",
                likes: 8,
                comments: [],
                tags: ["erp", "case-study"],
                pinned: true
            },
            {
                id: "IS-310-p2",
                title: "Integration patterns",
                content: "Overview of common enterprise integration patterns.",
                sender: instructorsData[5].name,
                senderId: instructorsData[5].id,
                createdAt: "2024-05-11T10:20:00Z",
                likes: 5,
                comments: [],
                tags: ["integration"],
                pinned: false
            },
            {
                id: "IS-310-p3",
                title: "Recommended vendors",
                content: "Discussion on pros/cons of popular ERP vendors.",
                sender: studentsData[0].name,
                senderId: studentsData[0].id,
                createdAt: "2024-05-12T14:00:00Z",
                likes: 2,
                comments: [],
                tags: ["vendors"],
                pinned: false
            }
        ]
    },
    {
        courseId: "AI-101",
        courseTitle: "Artificial Intelligence",
        department: "Artificial Intelligence",
        description: "Community for Artificial Intelligence (AI-101).",
        posts: [
            {
                id: "AI-101-p1",
                title: "Intro to search algorithms",
                content: "Clarification on A* heuristic admissibility examples.",
                sender: studentsData[4].name,
                senderId: studentsData[4].id,
                createdAt: "2024-02-05T09:00:00Z",
                likes: 15,
                comments: [],
                tags: ["search", "a-star"],
                pinned: true
            },
            {
                id: "AI-101-p2",
                title: "Recommended libraries",
                content: "Which Python libraries are best for beginners in AI?",
                sender: studentsData[3].name,
                senderId: studentsData[3].id,
                createdAt: "2024-02-06T10:10:00Z",
                likes: 11,
                comments: [],
                tags: ["python", "libraries"],
                pinned: false
            },
            {
                id: "AI-101-p3",
                title: "Project dataset ideas",
                content: "Looking for public datasets suitable for classification projects.",
                sender: studentsData[0].name,
                senderId: studentsData[0].id,
                createdAt: "2024-02-07T12:00:00Z",
                likes: 4,
                comments: [],
                tags: ["datasets"],
                pinned: false
            }
        ]
    },
    {
        courseId: "AI-102",
        courseTitle: "Machine Learning Basics",
        department: "Artificial Intelligence",
        description: "Community for Machine Learning Basics (AI-102).",
        posts: [
            {
                id: "AI-102-p1",
                title: "Gradient descent intuition",
                content: "Simple visualization to understand gradient descent steps.",
                sender: studentsData[4].name,
                senderId: studentsData[4].id,
                createdAt: "2024-03-20T09:30:00Z",
                likes: 19,
                comments: [],
                tags: ["ml", "gradient-descent"],
                pinned: true
            },
            {
                id: "AI-102-p2",
                title: "Evaluation metrics",
                content: "Difference between precision, recall and F1 with examples.",
                sender: instructorsData[4].name,
                senderId: instructorsData[4].id,
                createdAt: "2024-03-21T11:00:00Z",
                likes: 8,
                comments: [],
                tags: ["metrics"],
                pinned: false
            },
            {
                id: "AI-102-p3",
                title: "Notebook share",
                content: "Shared a Jupyter notebook with common ML pipelines.",
                sender: studentsData[0].name,
                senderId: studentsData[0].id,
                createdAt: "2024-03-22T14:45:00Z",
                likes: 6,
                comments: [],
                tags: ["notebook", "resources"],
                pinned: false
            }
        ]
    },
    {
        courseId: "AI-201",
        courseTitle: "Neural Networks",
        department: "Artificial Intelligence",
        description: "Community for Neural Networks (AI-201).",
        posts: [
            {
                id: "AI-201-p1",
                title: "Backpropagation derivation",
                content: "Step-by-step derivation of backpropagation for a 2-layer network.",
                sender: instructorsData[5].name,
                senderId: instructorsData[5].id,
                createdAt: "2024-04-05T09:00:00Z",
                likes: 21,
                comments: [],
                tags: ["nn", "backprop"],
                pinned: true
            },
            {
                id: "AI-201-p2",
                title: "Activation functions",
                content: "Discussion: ReLU vs Leaky ReLU vs ELU in practice.",
                sender: instructorsData[5].name,
                senderId: instructorsData[5].id,
                createdAt: "2024-04-06T10:30:00Z",
                likes: 9,
                comments: [],
                tags: ["activation"],
                pinned: false
            },
            {
                id: "AI-201-p3",
                title: "GPU tips",
                content: "How to speed up training on limited GPU memory.",
                sender: studentsData[1].name,
                senderId: studentsData[1].id,
                createdAt: "2024-04-07T13:15:00Z",
                likes: 3,
                comments: [],
                tags: ["gpu", "performance"],
                pinned: false
            }
        ]
    },
    {
        courseId: "AI-250",
        courseTitle: "Ethics in AI",
        department: "Artificial Intelligence",
        description: "Community for Ethics in AI (AI-250).",
        posts: [
            {
                id: "AI-250-p1",
                title: "Bias in datasets",
                content: "Examples of dataset bias and mitigation strategies.",
                sender: instructorsData[6].name,
                senderId: instructorsData[6].id,
                createdAt: "2024-05-01T09:00:00Z",
                likes: 13,
                comments: [],
                tags: ["ethics", "bias"],
                pinned: true
            },
            {
                id: "AI-250-p2",
                title: "Privacy concerns",
                content: "Discussion on anonymization techniques for user data.",
                sender: studentsData[2].name,
                senderId: studentsData[2].id,
                createdAt: "2024-05-02T11:20:00Z",
                likes: 6,
                comments: [],
                tags: ["privacy"],
                pinned: false
            },
            {
                id: "AI-250-p3",
                title: "Regulations overview",
                content: "Summary of current AI regulations and guidelines.",
                sender: studentsData[3].name,
                senderId: studentsData[3].id,
                createdAt: "2024-05-03T14:00:00Z",
                likes: 2,
                comments: [],
                tags: ["regulation"],
                pinned: false
            }
        ]
    },
    {
        courseId: "IT-300",
        courseTitle: "Computer Networks",
        department: "Information Technology",
        description: "Community for Computer Networks (IT-300).",
        posts: [
            {
                id: "IT-300-p1",
                title: "Wireshark tutorial",
                content: "Shared a step-by-step Wireshark tutorial for packet analysis.",
                sender: instructorsData[7].name,
                senderId: instructorsData[7].id,
                createdAt: "2024-01-15T09:00:00Z",
                likes: 17,
                comments: [],
                tags: ["network", "wireshark"],
                pinned: true
            },
            {
                id: "IT-300-p2",
                title: "Subnetting practice",
                content: "Posting subnetting exercises and answers.",
                sender: studentsData[4].name,
                senderId: studentsData[4].id,
                createdAt: "2024-01-16T10:00:00Z",
                likes: 8,
                comments: [],
                tags: ["subnetting", "practice"],
                pinned: false
            },
            {
                id: "IT-300-p3",
                title: "Lab schedule",
                content: "Lab sessions organizers and topics.",
                sender: instructorsData[7].name,
                senderId: instructorsData[7].id,
                createdAt: "2024-01-17T12:00:00Z",
                likes: 3,
                comments: [],
                tags: ["lab"],
                pinned: false
            }
        ]
    },
    {
        courseId: "IT-301",
        courseTitle: "Systems Administration",
        department: "Information Technology",
        description: "Community for Systems Administration (IT-301).",
        posts: [
            {
                id: "IT-301-p1",
                title: "Bash scripting tips",
                content: "Useful one-liners and common pitfalls in bash scripting.",
                sender: instructorsData[8].name,
                senderId: instructorsData[8].id,
                createdAt: "2024-02-10T09:30:00Z",
                likes: 14,
                comments: [],
                tags: ["bash", "scripting"],
                pinned: true
            },
            {
                id: "IT-301-p2",
                title: "Server hardening checklist",
                content: "A checklist for securing Ubuntu servers used in labs.",
                sender: studentsData[2].name,
                senderId: studentsData[2].id,
                createdAt: "2024-02-11T11:00:00Z",
                likes: 9,
                comments: [],
                tags: ["security", "server"],
                pinned: false
            },
            {
                id: "IT-301-p3",
                title: "Automation tools",
                content: "Comparing Ansible vs shell scripts for configuration tasks.",
                sender: instructorsData[8].name,
                senderId: instructorsData[8].id,
                createdAt: "2024-02-12T13:45:00Z",
                likes: 6,
                comments: [],
                tags: ["automation"],
                pinned: false
            }
        ]
    },
    {
        courseId: "IT-310",
        courseTitle: "Cybersecurity Fundamentals",
        department: "Information Technology",
        description: "Community for Cybersecurity Fundamentals (IT-310).",
        posts: [
            {
                id: "IT-310-p1",
                title: "Common vulnerabilities",
                content: "List of the top 10 common vulnerabilities and exploit examples.",
                sender: instructorsData[9].name,
                senderId: instructorsData[9].id,
                createdAt: "2024-03-05T09:00:00Z",
                likes: 20,
                comments: [],
                tags: ["vulnerabilities"],
                pinned: true
            },
            {
                id: "IT-310-p2",
                title: "CTF resources",
                content: "Good CTF platforms for beginners to practice web security.",
                sender: studentsData[2].name,
                senderId: studentsData[2].id,
                createdAt: "2024-03-06T10:30:00Z",
                likes: 11,
                comments: [],
                tags: ["ctf", "resources"],
                pinned: false
            }
        ]
    },
    {
        courseId: "IT-320",
        courseTitle: "Cloud Computing",
        department: "Information Technology",
        description: "Community for Cloud Computing (IT-320).",
        posts: [
            {
                id: "IT-320-p1",
                title: "Deployment on AWS",
                content: "Basic steps to deploy a simple web app on AWS EC2.",
                sender: instructorsData[10].name,
                senderId: instructorsData[10].id,
                createdAt: "2024-04-10T09:00:00Z",
                likes: 15,
                comments: [],
                tags: ["aws", "deployment"],
                pinned: true
            },
            {
                id: "IT-320-p2",
                title: "Cost optimization tips",
                content: "How to reduce cloud costs for small projects.",
                sender: studentsData[0].name,
                senderId: studentsData[0].id,
                createdAt: "2024-04-11T10:20:00Z",
                likes: 7,
                comments: [],
                tags: ["cost", "cloud"],
                pinned: false
            }
        ]
    },
    {
        courseId: "DS-150",
        courseTitle: "Introduction to Data Science",
        department: "Data Science",
        description: "Community for Introduction to Data Science (DS-150).",
        posts: [
            {
                id: "DS-150-p1",
                title: "Data cleaning tips",
                content: "Common techniques for cleaning messy datasets.",
                sender: instructorsData[11].name,
                senderId: instructorsData[11].id,
                createdAt: "2024-01-05T09:00:00Z",
                likes: 13,
                comments: [],
                tags: ["data-cleaning"],
                pinned: true
            },
            {
                id: "DS-150-p2",
                title: "Pandas tricks",
                content: "Useful pandas tricks for faster data manipulation.",
                sender: studentsData[4].name,
                senderId: studentsData[4].id,
                createdAt: "2024-01-06T10:30:00Z",
                likes: 9,
                comments: [],
                tags: ["pandas"],
                pinned: false
            }
        ]
    },
    {
        courseId: "DS-151",
        courseTitle: "Statistics for Data Science",
        department: "Data Science",
        description: "Community for Statistics for Data Science (DS-151).",
        posts: [
            {
                id: "DS-151-p1",
                title: "Probability practice",
                content: "Shared a set of probability exercises with step-by-step solutions.",
                sender: instructorsData[12].name,
                senderId: instructorsData[12].id,
                createdAt: "2024-02-01T09:00:00Z",
                likes: 10,
                comments: [],
                tags: ["probability"],
                pinned: true
            },
            {
                id: "DS-151-p2",
                title: "Hypothesis testing examples",
                content: "Examples comparing t-test and chi-square in practice.",
                sender: studentsData[3].name,
                senderId: studentsData[3].id,
                createdAt: "2024-02-02T11:00:00Z",
                likes: 6,
                comments: [],
                tags: ["hypothesis"],
                pinned: false
            },
            {
                id: "DS-151-p3",
                title: "Recommended textbooks",
                content: "Shortlist of textbooks and online courses.",
                sender: instructorsData[12].name,
                senderId: instructorsData[12].id,
                createdAt: "2024-02-03T13:00:00Z",
                likes: 4,
                comments: [],
                tags: ["resources"],
                pinned: false
            }
        ]
    },
    {
        courseId: "DS-210",
        courseTitle: "Data Visualization",
        department: "Data Science",
        description: "Community for Data Visualization (DS-210).",
        posts: [
            {
                id: "DS-210-p1",
                title: "Chart best practices",
                content: "Dos and don'ts when presenting charts.",
                sender: studentsData[0].name,
                senderId: studentsData[0].id,
                createdAt: "2024-03-10T09:00:00Z",
                likes: 12,
                comments: [],
                tags: ["visualization"],
                pinned: true
            },
            {
                id: "DS-210-p2",
                title: "D3 examples",
                content: "Sharing simple D3 snippets for interactive charts.",
                sender: studentsData[3].name,
                senderId: studentsData[3].id,
                createdAt: "2024-03-11T10:45:00Z",
                likes: 7,
                comments: [],
                tags: ["d3", "examples"],
                pinned: false
            },
            {
                id: "DS-210-p3",
                title: "Tool comparison",
                content: "Comparing Tableau, Power BI and matplotlib for different use cases.",
                sender: instructorsData[1].name,
                senderId: instructorsData[1].id,
                createdAt: "2024-03-12T12:30:00Z",
                likes: 3,
                comments: [],
                tags: ["tools"],
                pinned: false
            }
        ]
    },
    {
        courseId: "DS-220",
        courseTitle: "Machine Learning for Data Science",
        department: "Data Science",
        description: "Community for Machine Learning for Data Science (DS-220).",
        posts: [
            {
                id: "DS-220-p1",
                title: "Model selection workflow",
                content: "Steps to choose the right model and avoid overfitting.",
                sender: instructorsData[10].name,
                senderId: instructorsData[10].id,
                createdAt: "2024-04-20T09:00:00Z",
                likes: 16,
                comments: [],
                tags: ["modeling"],
                pinned: true
            },
            {
                id: "DS-220-p2",
                title: "Cross-validation tips",
                content: "K-fold strategies and when to use stratified splits.",
                sender: studentsData[4].name,
                senderId: studentsData[4].id,
                createdAt: "2024-04-21T11:10:00Z",
                likes: 8,
                comments: [],
                tags: ["cv"],
                pinned: false
            },
            {
                id: "DS-220-p3",
                title: "Feature engineering ideas",
                content: "Ideas for feature extraction in tabular datasets.",
                sender: studentsData[1].name,
                senderId: studentsData[1].id,
                createdAt: "2024-04-22T13:00:00Z",
                likes: 5,
                comments: [],
                tags: ["features"],
                pinned: false
            }
        ]
    }
];
export default communitiesData;