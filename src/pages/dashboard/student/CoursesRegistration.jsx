import { useState, useEffect, useCallback } from "react";

import useDeviceType from "../../../hooks/useDeviceType";

import Section from "../../../components/ui/Section";
import WeeklySchedule from "../../../components/ui/WeeklySchedule";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import Dialog from "../../../components/ui/Dialog";

import CourseCard from "../../../feature/student/courses/courseRegister/CourseCard";
import CourseRegistrationNote from "../../../feature/student/courses/courseRegister/CourseRegistrationNote";
import CourseRegistrationHeader from "../../../feature/student/courses/courseRegister/CourseRegistrationHeader";
import CoursesRegistrationActionButtons from "../../../feature/student/courses/courseRegister/CourseRegistrationActionButtons";

import {
    fetchActiveCourses,
    fetchClassesForCourse,
    getMyRegistrations,
    registerForCourse,
    unregisterFromCourse,
} from "../../../feature/student/courses/courseRegister/registrationApi";


// const sampleSchedule = [
//     {
//         id: 1,
//         title: "Data Structures",
//         day: "sat",
//         startTime: "8:00 AM",
//         endTime: "10:00 AM",
//         type: "lecture",
//         location: "Room 101",
//         instructor: "Dr. Ahmed"
//     },
//     {
//         id: 2,
//         title: "Database Lab",
//         day: "sat",
//         startTime: "11:00 AM",
//         endTime: "1:00 PM",
//         type: "lab",
//         location: "Lab 3",
//         instructor: "Eng. Sara"
//     },
//     {
//         id: 3,
//         title: "Web Development",
//         day: "sun",
//         startTime: "9:00 AM",
//         endTime: "11:00 AM",
//         type: "lecture",
//         location: "Room 205",
//         instructor: "Dr. Mohamed"
//     }
// ];

/**
 * Maps a StudentRegistrationDto (from GET /api/registration/my-courses)
 * to the shape that <CourseCard> expects.
 *
 * Missing backend fields are shown as "{field} is missing".
 */
function mapRegistrationToCard(reg) {
    return {
        id:          reg.courseCode  ?? reg.code ?? reg.courseId ?? "code is missing",
        title:       reg.courseName  ?? "courseName is missing",
        code:        reg.courseCode  ?? reg.code ?? "code is missing",
        creditHours: reg.creditHours ?? "creditHours is missing",
        professor:   reg.professorName ?? reg.professor ?? "professor is missing",
        schedule:    reg.schedule    ?? "schedule is missing",
        room:        reg.room        ?? "room is missing",
        courseId:     reg.courseId,
        classId:      reg.classId,
        isRegistered: true,
    };
}

/**
 * Maps an active‑course object (from GET /api/courses/active)
 * to the shape that <CourseCard> expects.
 *
 * Missing backend fields are shown as "{field} is missing".
 */
function mapActiveCourseToCard(course) {
    return {
        id:            course.courseCode  ?? course.code ?? course.courseId ?? course.id ?? "code is missing",
        title:         course.courseName  ?? course.title   ?? "courseName is missing",
        code:          course.courseCode  ?? course.code ?? "code is missing",
        creditHours:   course.creditHours ?? "creditHours is missing",
        professor:     course.professorName ?? course.professor ?? course.instructor ?? "professor is missing",
        schedule:      course.schedule    ?? "schedule is missing",
        room:          course.room        ?? "room is missing",
        preRequisites: course.prerequisites ?? course.preRequisites ?? null,
        courseId:       course.courseId    ?? course.id,
        classId:       course.classId,
        isRegistered: false,
    };
}

const ITEMS_PER_PAGE = 3;

export default function CoursesRegistration() {
    const { isDesktop }  = useDeviceType();

    const [selectedCourses, setSelectedCourses]   = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [sectionOptionsByCourseId, setSectionOptionsByCourseId] = useState({});
    const [selectedSectionByCourseId, setSelectedSectionByCourseId] = useState({});
    const [pendingRemovalCourseIds, setPendingRemovalCourseIds] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    const [selectedCoursesPage, setSelectedCoursesPage]   = useState(1);
    const [availableCoursesPage, setAvailableCoursesPage] = useState(1);

    const [showResultDialog, setShowResultDialog]   = useState(false);
    const [resultDialogVariant, setResultDialogVariant] = useState("success");
    const [resultDialogMessage, setResultDialogMessage] = useState("");

    /* ── Fetch data on mount ── */
    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [registrations, activeCourses] = await Promise.all([
                getMyRegistrations(),
                fetchActiveCourses(),
            ]);

            const registeredIds = new Set(
                registrations.map((r) => r.courseId)
            );

            setSelectedCourses(registrations.map(mapRegistrationToCard));
            setAvailableCourses(
                (Array.isArray(activeCourses) ? activeCourses : [])
                    .filter((c) => !registeredIds.has(c.courseId ?? c.id))
                    .map(mapActiveCourseToCard)
            );
        } catch (err) {
            setError(err.message || "Failed to load courses");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    /* ── Load sections for selected courses ── */
    useEffect(() => {
        let isMounted = true;

        async function loadSections() {
            const courseIds = selectedCourses
                .map((c) => c.courseId)
                .filter((id) => id !== undefined && id !== null);

            if (courseIds.length === 0) {
                setSectionOptionsByCourseId({});
                return;
            }

            try {
                const results = await Promise.all(
                    courseIds.map(async (courseId) => {
                        const classes = await fetchClassesForCourse(courseId);
                        const list = Array.isArray(classes) ? classes : [];
                        const sections = list.filter((cls) => {
                            const type = (cls.classTypeName ?? cls.classType ?? cls.type ?? "").toString().toLowerCase();
                            return type === "section";
                        });

                        const options = sections.map((cls) => {
                            const groupName = cls.groupCode ?? cls.group ?? cls.groupName ?? cls.className ?? "groupCode is missing";
                            const taName = cls.instructorName ?? cls.taName ?? "TA is missing";
                            const classId = cls.classId ?? cls.id ?? "classId is missing";
                            return {
                                value: classId,
                                label: `${groupName} — ${taName}`,
                            };
                        });

                        return { courseId, options };
                    })
                );

                if (!isMounted) return;

                const optionsMap = {};
                results.forEach(({ courseId, options }) => {
                    optionsMap[courseId] = options;
                });

                setSectionOptionsByCourseId(optionsMap);

                setSelectedSectionByCourseId((prev) => {
                    const next = { ...prev };
                    selectedCourses.forEach((course) => {
                        const options = optionsMap[course.courseId] || [];
                        if (course.classId && options.some((opt) => opt.value === course.classId)) {
                            next[course.courseId] = options.find((opt) => opt.value === course.classId);
                        } else if (!next[course.courseId] && options.length > 0) {
                            next[course.courseId] = options[0];
                        }
                    });
                    return next;
                });
            } catch (err) {
                if (!isMounted) return;
                setError(err.message || "Failed to load sections");
            }
        }

        loadSections();
        return () => { isMounted = false; };
    }, [selectedCourses]);

    /* ── Pagination helpers ── */
    const selectedTotalPages  = Math.max(1, Math.ceil(selectedCourses.length  / ITEMS_PER_PAGE));
    const availableTotalPages = Math.max(1, Math.ceil(availableCourses.length / ITEMS_PER_PAGE));

    const paginatedSelected = selectedCourses.slice(
        (selectedCoursesPage - 1) * ITEMS_PER_PAGE,
        selectedCoursesPage * ITEMS_PER_PAGE
    );
    const paginatedAvailable = availableCourses.slice(
        (availableCoursesPage - 1) * ITEMS_PER_PAGE,
        availableCoursesPage * ITEMS_PER_PAGE
    );

    /* ── Register / Unregister handlers ── */
    const handleRegister = (course) => {
        setSelectedCourses((prev) => {
            if (prev.some((c) => c.courseId === course.courseId)) return prev;
            return [...prev, { ...course, isRegistered: false }];
        });
        setAvailableCourses((prev) => prev.filter((c) => c.courseId !== course.courseId));
    };

    const handleUnregister = (course) => {
        if (!course.isRegistered) {
            setSelectedCourses((prev) => prev.filter((c) => c.courseId !== course.courseId));
            setAvailableCourses((prev) => [...prev, { ...course, isRegistered: false }]);
            return;
        }

        setPendingRemovalCourseIds((prev) =>
            prev.includes(course.courseId)
                ? prev.filter((id) => id !== course.courseId)
                : [...prev, course.courseId]
        );
    };

    const handleConfirmRegistration = async () => {
        const pending = selectedCourses.filter((c) => !c.isRegistered);
        const pendingRemovals = selectedCourses.filter(
            (c) => c.isRegistered && pendingRemovalCourseIds.includes(c.courseId)
        );
        if (pending.length === 0 && pendingRemovals.length === 0) return;

        for (const course of pending) {
            const section = selectedSectionByCourseId[course.courseId];
            if (!section?.value) {
                setError(`Please select a section for ${course.title}.`);
                return;
            }
        }

        try {
            for (const course of pendingRemovals) {
                await unregisterFromCourse(course.courseId);
            }
            for (const course of pending) {
                const section = selectedSectionByCourseId[course.courseId];
                await registerForCourse(course.courseId, section.value);
            }
            setPendingRemovalCourseIds([]);
            await loadData();

            const msgs = [];
            if (pending.length > 0) msgs.push(`${pending.length} course(s) registered`);
            if (pendingRemovals.length > 0) msgs.push(`${pendingRemovals.length} course(s) removed`);
            setResultDialogVariant("success");
            setResultDialogMessage(msgs.join(" and ") + " successfully!");
            setShowResultDialog(true);
        } catch (err) {
            setResultDialogVariant("error");
            setResultDialogMessage(err.message || "Failed to confirm registration.");
            setShowResultDialog(true);
        }
    };

    return (
        <>
            <CourseRegistrationHeader deviceType={isDesktop ? "desktop" : "mobile"} selectedCourses={selectedCourses} availableCourses={availableCourses} />

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            )}

            {loading ? (
                <p className="text-center py-10 text-text-secondary-active-light dark:text-text-secondary-active-dark">
                    Loading courses…
                </p>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section>
                    <h3 className="text-md font-semibold">Selected Courses ({selectedCourses.length})</h3>

                    <div className="mt-4">
                        <div className="space-y-4 mb-4">
                            {paginatedSelected.length > 0
                                ? paginatedSelected.map(course => (
                                    <CourseCard
                                        key={course.courseId}
                                        course={course}
                                        cardType="selected"
                                        onAction={() => handleUnregister(course)}
                                        isPendingRemoval={pendingRemovalCourseIds.includes(course.courseId)}
                                        sectionOptions={sectionOptionsByCourseId[course.courseId] || []}
                                        selectedSection={selectedSectionByCourseId[course.courseId]}
                                        onSectionChange={(opt) =>
                                            setSelectedSectionByCourseId((prev) => ({
                                                ...prev,
                                                [course.courseId]: opt,
                                            }))
                                        }
                                    />
                                ))
                                : <p className="text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark">No courses selected yet.</p>
                            }
                        </div>

                        <PaginationButtons totalPages={selectedTotalPages} currentPage={selectedCoursesPage} setCurrentPage={setSelectedCoursesPage} />
                    </div>
                </Section>

                <Section>
                    <h3 className="text-md font-semibold">Available Courses</h3>

                    <div className="mt-4">
                        <div className="space-y-4 mb-4">
                            {paginatedAvailable.length > 0
                                ? paginatedAvailable.map(course => (
                                    <CourseCard
                                        key={course.courseId}
                                        course={course}
                                        cardType="available"
                                        onAction={() => handleRegister(course)}
                                    />
                                ))
                                : <p className="text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark">No available courses.</p>
                            }
                        </div>

                        <PaginationButtons totalPages={availableTotalPages} currentPage={availableCoursesPage} setCurrentPage={setAvailableCoursesPage} />
                    </div>
                </Section>

                {/* <Section className="md:col-span-2">
                    <div>
                        <h3 className="text-md font-semibold">Weekly Schedule Preview</h3>

                        <WeeklySchedule schedule={sampleSchedule} />
                    </div>
                    
                </Section> */}

                <div className="md:col-span-2 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-t-2 border-border-primary-default-light dark:border-border-primary-default-dark pt-6">
                    <CoursesRegistrationActionButtons onConfirm={handleConfirmRegistration} />

                    <CourseRegistrationNote />
                </div>
            </div>
            )}

            <Dialog
                isOpen={showResultDialog}
                variant={resultDialogVariant}
                title={resultDialogVariant === "success" ? "Registration Complete" : "Registration Failed"}
                onClose={() => setShowResultDialog(false)}
                confirmText="OK"
            >
                <p>{resultDialogMessage}</p>
            </Dialog>
        </>
    );
}