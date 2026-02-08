// Simple Express.js dummy backend using the mock data (ESM)
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import communities from './communities.js';
import courses from './courses.js';
import instructors from './instructors.js';
import rooms from './rooms.js';
import students from './students.js';
import admins from './admins.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 4000;
const JWT_SECRET = 'IntelliCampus';

app.use(cors({
    origin: 'http://192.168.1.15:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Middleware to verify JWT from cookie
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;  // Read from cookie instead of header
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Helper function to generate next ID
function generateId(entity) {
    const maxId = entity.reduce((max, item) => Math.max(max, parseInt(item.id.split('-')[1])), 0);
    return `${entity[0].id.split('-')[0]}-${String(maxId + 1).padStart(3, '0')}`;
}

// Communities routes
app.get('/api/communities', (req, res) => res.json(communities));
app.get('/api/communities/:id', (req, res) => {
    const community = communities.find(c => c.id === req.params.id);
    community ? res.json(community) : res.status(404).json({ error: 'Community not found' });
});
app.post('/api/communities', (req, res) => {
    const newCommunity = { id: generateId(communities), ...req.body };
    communities.push(newCommunity);
    res.status(201).json(newCommunity);
});
app.put('/api/communities/:id', (req, res) => {
    const index = communities.findIndex(c => c.id === req.params.id);
    if (index !== -1) {
        communities[index] = { ...communities[index], ...req.body };
        res.json(communities[index]);
    } else {
        res.status(404).json({ error: 'Community not found' });
    }
});
app.delete('/api/communities/:id', (req, res) => {
    const index = communities.findIndex(c => c.id === req.params.id);
    if (index !== -1) {
        communities.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Community not found' });
    }
});

// Helper: flatten courses object into array
function flattenCourses() {
    const all = [];
    for (const dept in courses) {
        for (const c of courses[dept]) {
            all.push(c);
        }
    }
    return all;
}

// Helper: find course across departments
function findCourse(id) {
    for (const dept in courses) {
        const course = courses[dept].find(c => c.id === id);
        if (course) return { course, dept };
    }
    return { course: null, dept: null };
}

// Courses routes
app.get('/api/courses', (req, res) => res.json(flattenCourses()));
app.get('/api/courses/:id', (req, res) => {
    const { course } = findCourse(req.params.id);
    course ? res.json(course) : res.status(404).json({ error: 'Course not found' });
});
app.post('/api/courses', (req, res) => {
    const department = req.body.department || "General";
    if (!courses[department]) {
        courses[department] = [];
    }
    const allCourses = flattenCourses();
    const maxNum = allCourses.reduce((max, c) => {
        const num = parseInt(c.id.split('-')[1]) || 0;
        return Math.max(max, num);
    }, 0);
    const prefix = req.body.id?.split('-')[0] || department.split(' ').map(w => w[0]).join('').toUpperCase();
    const newId = req.body.id || `${prefix}-${String(maxNum + 1).padStart(3, '0')}`;
    const newCourse = { 
        id: newId,
        isActive: false,
        ...req.body, 
        id: newId,
    };
    courses[department].push(newCourse);
    res.status(201).json(newCourse);
});
app.put('/api/courses/:id', (req, res) => {
    const { course, dept } = findCourse(req.params.id);
    if (course) {
        const index = courses[dept].findIndex(c => c.id === req.params.id);
        // If department changed, move the course
        if (req.body.department && req.body.department !== dept) {
            courses[dept].splice(index, 1);
            const newDept = req.body.department;
            if (!courses[newDept]) courses[newDept] = [];
            const updated = { ...course, ...req.body };
            courses[newDept].push(updated);
            res.json(updated);
        } else {
            courses[dept][index] = { ...course, ...req.body };
            res.json(courses[dept][index]);
        }
    } else {
        res.status(404).json({ error: 'Course not found' });
    }
});
app.patch('/api/courses/:id/activate', (req, res) => {
    const { course, dept } = findCourse(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    const index = courses[dept].findIndex(c => c.id === req.params.id);
    courses[dept][index] = { 
        ...course, 
        isActive: true, 
        semester: req.body.semester || course.semester,
        professor: req.body.professor || course.professor,
    };
    res.json(courses[dept][index]);
});
app.patch('/api/courses/:id/deactivate', (req, res) => {
    const { course, dept } = findCourse(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    const index = courses[dept].findIndex(c => c.id === req.params.id);
    courses[dept][index] = { ...course, isActive: false };
    res.json(courses[dept][index]);
});
// ─── Course Classes ──────────────────────────────────────────
app.get('/api/courses/:id/classes', (req, res) => {
    const { course } = findCourse(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course.classes || []);
});
app.post('/api/courses/:id/classes', (req, res) => {
    const { course, dept } = findCourse(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (!course.classes) course.classes = [];
    const classId = `cls-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newClass = { id: classId, ...req.body };
    course.classes.push(newClass);
    res.status(201).json(newClass);
});
app.delete('/api/courses/:id/classes/:classId', (req, res) => {
    const { course } = findCourse(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (!course.classes) return res.status(404).json({ error: 'Class not found' });
    const idx = course.classes.findIndex(c => c.id === req.params.classId);
    if (idx === -1) return res.status(404).json({ error: 'Class not found' });
    course.classes.splice(idx, 1);
    res.status(204).send();
});

app.delete('/api/courses/:id', (req, res) => {
    const { course, dept } = findCourse(req.params.id);
    if (course) {
        const index = courses[dept].findIndex(c => c.id === req.params.id);
        courses[dept].splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Course not found' });
    }
});

// Instructors routes
app.get('/api/instructors', (req, res) => res.json(instructors));
app.get('/api/instructors/:id', (req, res) => {
    const instructor = instructors.find(i => i.id === req.params.id);
    instructor ? res.json(instructor) : res.status(404).json({ error: 'Instructor not found' });
});
app.post('/api/instructors', (req, res) => {
    const newInstructor = { id: generateId(instructors), ...req.body };
    instructors.push(newInstructor);
    res.status(201).json(newInstructor);
});
app.put('/api/instructors/:id', (req, res) => {
    const index = instructors.findIndex(i => i.id === req.params.id);
    if (index !== -1) {
        instructors[index] = { ...instructors[index], ...req.body };
        res.json(instructors[index]);
    } else {
        res.status(404).json({ error: 'Instructor not found' });
    }
});
app.delete('/api/instructors/:id', (req, res) => {
    const index = instructors.findIndex(i => i.id === req.params.id);
    if (index !== -1) {
        instructors.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Instructor not found' });
    }
});

// Rooms routes (rooms is an object, so GET all is fine, but for CRUD, perhaps not applicable or handle differently)
app.get('/api/rooms', (req, res) => res.json(rooms));
// For rooms, since it's not an array, skipping CRUD for simplicity

// Students routes
app.get('/api/students', (req, res) => res.json(students));
app.get('/api/students/:id', (req, res) => {
    const studentId = req.params.id;
    const student = students.find(s => String(s.studentId) === String(studentId));
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});
app.post('/api/students', (req, res) => {
    const newStudent = { studentId: generateId(students).replace('stu-', ''), ...req.body };
    students.push(newStudent);
    res.status(201).json(newStudent);
});
app.put('/api/students/:id', (req, res) => {
    const studentId = req.params.id;
    const index = students.findIndex(s => String(s.studentId) === String(studentId));
    if (index !== -1) {
        students[index] = { ...students[index], ...req.body };
        res.json(students[index]);
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});
app.delete('/api/students/:id', (req, res) => {
    const studentId = req.params.id;
    const index = students.findIndex(s => String(s.studentId) === String(studentId));
    if (index !== -1) {
        students.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});

// Admins routes
app.get('/api/admins', (req, res) => res.json(admins));
app.get('/api/admins/:id', (req, res) => {
    const admin = admins.find(a => String(a.id) === String(req.params.id));
    admin ? res.json(admin) : res.status(404).json({ error: 'Admin not found' });
});
app.post('/api/admins', (req, res) => {
    const newId = admins.length ? Math.max(...admins.map(a => a.id)) + 1 : 1;
    const newAdmin = { id: newId, ...req.body };
    admins.push(newAdmin);
    res.status(201).json(newAdmin);
});
app.put('/api/admins/:id', (req, res) => {
    const index = admins.findIndex(a => String(a.id) === String(req.params.id));
    if (index !== -1) {
        admins[index] = { ...admins[index], ...req.body };
        res.json(admins[index]);
    } else {
        res.status(404).json({ error: 'Admin not found' });
    }
});
app.delete('/api/admins/:id', (req, res) => {
    const index = admins.findIndex(a => String(a.id) === String(req.params.id));
    if (index !== -1) {
        admins.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Admin not found' });
    }
});

// Login route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    setTimeout(() => {
        // Check students
        let user = students.find(s => s.email === email && s.password === password);

        if (user) {
            const token = jwt.sign({ id: user.studentId, role: 'student' }, JWT_SECRET, { expiresIn: '24h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000
            });
            return res.json({ userId: user.studentId, name: user.name, role: 'student' });
        }

        // Check instructors
        user = instructors.find(i => i.email === email && i.password === password);

        if (user) {
            const token = jwt.sign({ id: user.id, role: 'instructor' }, JWT_SECRET, { expiresIn: '24h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000
            });
            return res.json({ userId: user.id, name: user.name, role: 'instructor' });
        }

        // Check admins
        user = admins.find(a => a.email === email && a.password === password);

        if (user) {
            const token = jwt.sign({ id: user.id, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000
            });
            return res.json({ userId: user.id, name: user.name, role: 'admin' });
        }

        res.status(401).json({ error: 'Invalid credentials' });
    }, 3000);
});

// Logout route (clear cookie)
app.post('/api/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });
    res.json({ message: 'Logged out successfully' });
});

// Instructor's currently assigned courses
app.get('/api/me/courses', verifyToken, (req, res) => {
    const { id, role } = req.user;
    if (role !== 'instructor') {
        return res.status(403).json({ error: 'Only instructors can access this endpoint' });
    }
    const instructor = instructors.find(i => i.id === id);
    if (!instructor) {
        return res.status(404).json({ error: 'Instructor not found' });
    }
    // Find all courses where the professor matches the instructor's name
    const instructorCourses = [];
    for (const department in courses) {
        for (const course of courses[department]) {
            if (course.professor === instructor.name) {
                instructorCourses.push(course);
            }
        }
    }
    res.json(instructorCourses);
});

// Me route - return role in response
app.get('/api/me', verifyToken, (req, res) => {
    const { id, role } = req.user;
    let user;
    if (role === 'student') {
        user = students.find(s => String(s.studentId) === String(id));
    } else if (role === 'instructor') {
        user = instructors.find(i => i.id === id);
    } else if (role === 'admin') {
        user = admins.find(a => String(a.id) === String(id));
    }
    if (user) {
        const avatar = user.avatar || user.profileImage;
        res.json({ avatar, notifications: user.notifications, role });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock backend running on http://0.0.0.0:${PORT}`);
});
