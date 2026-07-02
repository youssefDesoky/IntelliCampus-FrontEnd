import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import useDeviceType from "../../../hooks/useDeviceType";

import WeeklySchedule, { days } from "../../../components/ui/WeeklySchedule";
import WeeklyScheduleAgenda from "../../../components/ui/schedule/WeeklyScheduleAgenda.phone";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import Dialog from "../../../components/ui/Dialog";
import { FileLinesIcon, CalendarIcon, AngleDownIcon, WarningIcon } from "../../../components/ui/icons";

import CourseCard from "../../../feature/student/courses/courseRegister/CourseCard";
import CourseRegistrationHeader from "../../../feature/student/courses/courseRegister/CourseRegistrationHeader";
import CoursesRegistrationActionButtons from "../../../feature/student/courses/courseRegister/CourseRegistrationActionButtons";
import { RegistrationPageSkeleton } from "../../../feature/student/courses/courseRegister/SkeletonLoader";

import {
    fetchActiveCourses,
    fetchClassesForCourse,
    getMyRegistrations,
    registerForCourse,
    unregisterFromCourse,
    fetchRegistrationSettings,
    changeCourseSection,
} from "../../../feature/student/courses/courseRegister/registrationApi";
import { fetchMySchedule } from "../../../feature/student/schedule/scheduleApi";
import { useError } from '../../../contexts/ErrorContext.jsx';


function mapRegistrationToCard(reg) {
    const scheduleParts = [reg.day, reg.startTime && reg.endTime ? `${reg.startTime} - ${reg.endTime}` : ""].filter(Boolean);
    return {
        id:          reg.courseCode  ?? reg.code ?? reg.courseId ?? "",
        title:       reg.courseName  ?? "",
        code:        reg.courseCode  ?? reg.code ?? "",
        creditHours: reg.creditHours ?? "",
        professor:   reg.professorName ?? reg.professor ?? "",
        avatar:      reg.professorAvatar ?? reg.instructorAvatar ?? reg.avatar ?? null,
        schedule:    reg.schedule ?? scheduleParts.join(" ") ?? "",
        room:    reg.room ?? "",
        courseId:     reg.courseId,
        classId:      reg.classId,
        isProject:    reg.isProject ?? false,
        isRegistered: true,
    };
}

function mapActiveCourseToCard(course) {
    return {
        id:            course.courseCode  ?? course.code ?? course.courseId ?? course.id ?? "",
        title:         course.courseName  ?? course.title   ?? "",
        code:          course.courseCode  ?? course.code ?? "",
        creditHours:   course.creditHours ?? "",
        professor:     course.professorName ?? course.professor ?? course.instructor ?? "",
        avatar:        course.professorAvatar ?? course.instructorAvatar ?? course.avatar ?? null,
        schedule:      course.schedule    ?? "",
        room:          course.room        ?? "",
        preRequisites: course.prerequisites ?? course.preRequisites ?? null,
        courseId:       course.courseId    ?? course.id,
        classId:       course.classId,
        isElective:    course.isElective ?? false,
        isProject:     course.isProject ?? false,
        isRegistered: false,
    };
}

const ITEMS_PER_PAGE = 3;

/* ── Time utilities ── */
function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const match12 = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match12) {
        let h = parseInt(match12[1], 10);
        const m = parseInt(match12[2], 10);
        if (match12[3].toUpperCase() === 'PM' && h !== 12) h += 12;
        if (match12[3].toUpperCase() === 'AM' && h === 12) h = 0;
        return h * 60 + m;
    }
    const parts = timeStr.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1] || '0', 10);
}

function normalizeDay(day) {
    if (!day) return '';
    return day.toLowerCase().slice(0, 3);
}

function isOverlapping(a, b) {
    const dayA = normalizeDay(a.day ?? a.dayName ?? '');
    const dayB = normalizeDay(b.day ?? b.dayName ?? '');
    if (dayA !== dayB) return false;
    const sA = parseTimeToMinutes(a.startTime ?? a.start ?? '');
    const eA = parseTimeToMinutes(a.endTime ?? a.end ?? '');
    const sB = parseTimeToMinutes(b.startTime ?? b.start ?? '');
    const eB = parseTimeToMinutes(b.endTime ?? b.end ?? '');
    return sA < eB && sB < eA;
}

function formatTimeOption(timeStr) {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    const h = parseInt(parts[0], 10);
    const m = parts[1] || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m} ${ampm}`;
}

function detectTimeConflicts(registeredEvents, lecture, selectedSection, courseTitle, courseId) {
    const conflicts = [];
    const candidates = [];
    if (lecture) candidates.push({ type: 'Lecture', courseId, ...lecture });
    if (selectedSection) candidates.push({ type: 'Section', courseId, ...selectedSection });

    for (const candidate of candidates) {
        for (const event of registeredEvents) {
            if (isOverlapping(candidate, event)) {
                conflicts.push({
                    type: candidate.type,
                    courseTitle,
                    courseId: candidate.courseId,
                    conflictWith: event.title || event.courseName || 'Another course',
                    day: candidate.dayName ?? candidate.day ?? '',
                    time: `${formatTimeOption(candidate.startTime)} – ${formatTimeOption(candidate.endTime)}`,
                });
            }
        }
    }
    return conflicts;
}

export default function CoursesRegistration() {
    const { isDesktop, isMobile } = useDeviceType();

    const [locallyAddedCourses, setLocallyAddedCourses] = useState([]);
    const [sectionOptionsByCourseId, setSectionOptionsByCourseId] = useState({});
    const [selectedSectionByCourseId, setSelectedSectionByCourseId] = useState({});
    const [courseClassesData, setCourseClassesData] = useState({});
    const [registrationSettings, setRegistrationSettings] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [conflicts, setConflicts] = useState([]);
    const [showConflictDialog, setShowConflictDialog] = useState(false);
    const [conflictDialogData, setConflictDialogData] = useState({});
    const { showError } = useError();
    const queryClient = useQueryClient();

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchValue), 400);
        return () => clearTimeout(timer);
    }, [searchValue]);

    const { data: registrationData, isLoading: loading } = useQuery({
        queryKey: ["coursesRegistration", debouncedSearch],
        queryFn: async () => {
            const params = { pageSize: 100, ...(debouncedSearch ? { searchQuery: debouncedSearch } : {}) };
            const [registrationsResult, coursesResult] = await Promise.all([
                getMyRegistrations(),
                fetchActiveCourses(params),
            ]);
            const registrations = registrationsResult?.data ?? (Array.isArray(registrationsResult) ? registrationsResult : []);
            const courses = coursesResult?.data ?? (Array.isArray(coursesResult) ? coursesResult : []);
            return { registrations, courses };
        },
        staleTime: 0,
    });

    const { data: scheduleData = [], isLoading: schedulePreviewLoading } = useQuery({
        queryKey: ["studentSchedule", "registration"],
        queryFn: fetchMySchedule,
        staleTime: 2 * 60 * 1000,
    });

    const { data: settingsData } = useQuery({
        queryKey: ["registrationSettings"],
        queryFn: fetchRegistrationSettings,
        staleTime: 2 * 60 * 1000,
    });

    useEffect(() => {
        if (settingsData) setRegistrationSettings(settingsData);
    }, [settingsData]);

    /* ── Existing registered events for conflict checking ── */
    const existingScheduleEvents = useMemo(() => {
        const events = Array.isArray(scheduleData) ? scheduleData : [];
        return events;
    }, [scheduleData]);

    /* ── Detect conflicts within the existing schedule itself ── */
    const existingScheduleConflicts = useMemo(() => {
        const events = existingScheduleEvents;
        const result = [];
        for (let i = 0; i < events.length; i++) {
            for (let j = i + 1; j < events.length; j++) {
                if (isOverlapping(events[i], events[j])) {
                    result.push({
                        type: events[i].type || 'Event',
                        courseTitle: events[i].title || events[i].courseName || 'Course',
                        courseId: events[i].courseId || `existing-${i}`,
                        conflictWith: events[j].title || events[j].courseName || 'Another course',
                        day: events[i].day,
                        time: `${formatTimeOption(events[i].startTime)} – ${formatTimeOption(events[i].endTime)}`,
                    });
                }
            }
        }
        return result;
    }, [existingScheduleEvents]);

    /* ── Detect time conflicts whenever selected section changes ── */
    useEffect(() => {
        const courseIds = locallyAddedCourses.map(c => c.courseId).filter(Boolean);
        const found = [];

        for (const courseId of courseIds) {
            const course = locallyAddedCourses.find(c => c.courseId === courseId);
            if (!course) continue;

            const classes = courseClassesData[courseId];
            if (!classes) continue;

            const lecture = classes.lecture ?? null;

            const selectedSectionOpt = selectedSectionByCourseId[courseId];
            let selectedSection = null;
            if (selectedSectionOpt && classes.sections?.length > 0) {
                selectedSection = classes.sections.find(
                    s => (s.classId ?? s.id) === selectedSectionOpt.value
                ) ?? null;
            }

            /* ── Build pending events from other locally-added courses ── */
            const otherPendingEvents = [];
            for (const otherCourse of locallyAddedCourses) {
                if (otherCourse.courseId === courseId) continue;
                const otherClasses = courseClassesData[otherCourse.courseId];
                if (!otherClasses) continue;

                if (otherClasses.lecture) {
                    otherPendingEvents.push({
                        ...otherClasses.lecture,
                        title: otherCourse.title,
                        courseName: otherCourse.title,
                    });
                }

                const otherSectionOpt = selectedSectionByCourseId[otherCourse.courseId];
                if (otherSectionOpt && otherClasses.sections?.length > 0) {
                    const otherSection = otherClasses.sections.find(
                        s => (s.classId ?? s.id) === otherSectionOpt.value
                    );
                    if (otherSection) {
                        otherPendingEvents.push({
                            ...otherSection,
                            title: otherCourse.title,
                            courseName: otherCourse.title,
                        });
                    }
                }
            }

            const courseConflicts = detectTimeConflicts(
                [...existingScheduleEvents, ...otherPendingEvents],
                lecture,
                selectedSection,
                course.title,
                courseId
            );
            found.push(...courseConflicts);
        }

        setConflicts(found);
    }, [selectedSectionByCourseId, locallyAddedCourses, courseClassesData, existingScheduleEvents]);

    const allConflicts = useMemo(() => {
        return [...existingScheduleConflicts, ...conflicts];
    }, [existingScheduleConflicts, conflicts]);

    const selectedCourses = useMemo(() => {
        const serverSelected = (registrationData?.registrations || []).map(mapRegistrationToCard);
        return [...serverSelected, ...locallyAddedCourses];
    }, [registrationData, locallyAddedCourses]);

    const availableCourses = useMemo(() => {
        const registeredIds = new Set((registrationData?.registrations || []).map(r => r.courseId));
        const serverAvailable = (registrationData?.courses
            ? (Array.isArray(registrationData.courses) ? registrationData.courses : [])
                .filter(c => !registeredIds.has(c.courseId ?? c.id))
                .map(mapActiveCourseToCard)
            : []);
        const addedIds = new Set(locallyAddedCourses.map(c => c.courseId));
        const withoutLocallyAdded = serverAvailable.filter(c => !addedIds.has(c.courseId));

        let filtered = withoutLocallyAdded;

        if (activeFilter === "required") {
            filtered = filtered.filter(c => !c.isElective);
        } else if (activeFilter === "elective") {
            filtered = filtered.filter(c => c.isElective);
        }

        return filtered;
    }, [registrationData, locallyAddedCourses, activeFilter]);

    const [selectedCoursesPage, setSelectedCoursesPage]   = useState(1);
    const [availableCoursesPage, setAvailableCoursesPage] = useState(1);

    const [showResultDialog, setShowResultDialog]   = useState(false);
    const [resultDialogVariant, setResultDialogVariant] = useState("success");
    const [resultDialogMessage, setResultDialogMessage] = useState("");
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const schedulePreview = Array.isArray(scheduleData) ? scheduleData : [];

    const mergedSchedulePreview = useMemo(() => {
        const serverEvents = Array.isArray(scheduleData) ? scheduleData : [];
        const pendingEvents = [];

        locallyAddedCourses.forEach((course) => {
            const classes = courseClassesData[course.courseId];
            if (!classes) return;

            const toDayKey = (dayStr) => {
                if (!dayStr) return null;
                const d = dayStr.toLowerCase().slice(0, 3);
                return d === "sat" ? "sat" : d === "sun" ? "sun" : d === "mon" ? "mon"
                    : d === "tue" ? "tue" : d === "wed" ? "wed" : d === "thu" ? "thu"
                    : d === "fri" ? "fri" : d;
            };

            const formatTime = (time) => {
                if (!time) return null;
                if (typeof time === "string") return time;
                const h = time.hours ?? time.hour ?? 0;
                const m = time.minutes ?? time.minute ?? 0;
                const period = h >= 12 ? "PM" : "AM";
                const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                return `${hour12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
            };

            if (classes.lecture) {
                const lec = classes.lecture;
                const dayKey = toDayKey(lec.dayName ?? lec.day ?? "");
                if (dayKey) {
                    pendingEvents.push({
                        day: dayKey,
                        startTime: formatTime(lec.startTime),
                        endTime: formatTime(lec.endTime),
                        title: course.title,
                        location: lec.room ?? "",
                        type: "lecture",
                        instructor: lec.instructorName ?? "",
                    });
                }
            }

            const selectedSectionOpt = selectedSectionByCourseId[course.courseId];
            if (selectedSectionOpt) {
                const sectionClass = classes.sections.find((s) => (s.classId ?? s.id) === selectedSectionOpt.value);
                if (sectionClass) {
                    const dayKey = toDayKey(sectionClass.dayName ?? sectionClass.day ?? "");
                    if (dayKey) {
                        pendingEvents.push({
                            day: dayKey,
                            startTime: formatTime(sectionClass.startTime),
                            endTime: formatTime(sectionClass.endTime),
                            title: course.title,
                            location: sectionClass.room ?? "",
                            type: "section",
                            instructor: sectionClass.instructorName ?? "",
                        });
                    }
                }
            }
        });

        return [...serverEvents, ...pendingEvents];
    }, [scheduleData, locallyAddedCourses, courseClassesData, selectedSectionByCourseId]);

    const selectedCredits = selectedCourses.reduce(
        (sum, c) => sum + (typeof c.creditHours === 'number' ? c.creditHours : 0),
        0
    );

    /* ── Load sections & class data for selected courses ── */
    useEffect(() => {
        let isMounted = true;

        async function loadSections() {
            const projectCourseIds = new Set(
                selectedCourses.filter(c => c.isProject).map(c => c.courseId).filter(Boolean)
            );
            const courseIds = selectedCourses
                .map((c) => c.courseId)
                .filter((id) => id !== undefined && id !== null && !projectCourseIds.has(id));

            if (courseIds.length === 0) {
                setSectionOptionsByCourseId({});
                setCourseClassesData({});
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
                        const lecture = list.find((cls) => {
                            const type = (cls.classTypeName ?? cls.classType ?? cls.type ?? "").toString().toLowerCase();
                            return type === "lecture";
                        });

                        const options = sections.map((cls) => {
                            const day = cls.dayName ?? "";
                            const start = formatTimeOption(cls.startTime);
                            const end = formatTimeOption(cls.endTime);
                            const room = cls.room ?? "";
                            const taName = cls.instructorName ?? cls.taName ?? "";
                            const classId = cls.classId ?? cls.id ?? "";
                            const timeStr = start && end ? `${start}–${end}` : "";
                            const scheduleStr = [day, timeStr].filter(Boolean).join(" ");
                            const label = `${scheduleStr} — ${room}${taName ? ` (${taName})` : ""}`;
                            return {
                                value: classId,
                                label,
                            };
                        });

                        return { courseId, options, lecture, sections, allClasses: list };
                    })
                );

                if (!isMounted) return;

                const optionsMap = {};
                const classesMap = {};
                results.forEach(({ courseId, options, lecture, sections, allClasses }) => {
                    optionsMap[courseId] = options;
                    classesMap[courseId] = { lecture, sections, allClasses };
                });

                setSectionOptionsByCourseId(optionsMap);
                setCourseClassesData(classesMap);

                setSelectedSectionByCourseId((prev) => {
                    const next = { ...prev };
                    selectedCourses.forEach((course) => {
                        if (course.isProject) {
                            next[course.courseId] = null;
                            return;
                        }
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
                showError(err.message || "Failed to load sections");
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

    /* ── Section change handler with conflict side-effect (useEffect) ── */
    const handleSectionChange = (courseId, option) => {
        setSelectedSectionByCourseId((prev) => ({
            ...prev,
            [courseId]: option,
        }));
    };

    /* ── Register / Unregister handlers ── */
    const handleRegister = (course) => {
        setLocallyAddedCourses((prev) => {
            if (prev.some((c) => c.courseId === course.courseId)) return prev;
            return [...prev, { ...course, isRegistered: false }];
        });
        if (course.isProject) {
            setSelectedSectionByCourseId((prev) => ({
                ...prev,
                [course.courseId]: null,
            }));
        }
    };

    const handleUnregister = async (course) => {
        if (!course.isRegistered) {
            setLocallyAddedCourses((prev) => prev.filter((c) => c.courseId !== course.courseId));
            setSelectedSectionByCourseId((prev) => {
                const next = { ...prev };
                delete next[course.courseId];
                return next;
            });
            return;
        }

        try {
            await unregisterFromCourse(course.courseId);
            await queryClient.invalidateQueries({ queryKey: ["coursesRegistration"] });
        } catch (err) {
            showError(err.message || "Failed to unregister from course");
        }
    };

    const handleConfirmRegistration = async () => {
        const pending = selectedCourses.filter((c) => !c.isRegistered);
        if (pending.length === 0 && selectedCourses.length === 0) return;

        for (const course of pending) {
            if (course.isProject) continue;
            const section = selectedSectionByCourseId[course.courseId];
            if (!section?.value) {
                showError(`Please select a section for ${course.title}.`);
                return;
            }
        }

        if (allConflicts.length > 0) {
            setConflictDialogData({
                message: `Cannot confirm registration due to time conflict${allConflicts.length > 1 ? 's' : ''}.`,
                conflicts: [...allConflicts],
            });
            setShowConflictDialog(true);
            return;
        }

        const settings = registrationSettings;
        if (settings) {
            const totalCredits = selectedCourses.reduce(
                (sum, c) => sum + (typeof c.creditHours === 'number' ? c.creditHours : 0),
                0
            );
            const isSummer = settings.semester?.toLowerCase().startsWith("summer") ?? false;
            if (settings.effectiveMaxCreditHours != null && totalCredits > settings.effectiveMaxCreditHours) {
                showError(`Total credits (${totalCredits}) exceed the maximum of ${settings.effectiveMaxCreditHours}.`);
                return;
            }
            if (!isSummer && settings.minCreditHoursPerSemester != null && totalCredits < settings.minCreditHoursPerSemester) {
                showError(`Total credits (${totalCredits}) are below the minimum of ${settings.minCreditHoursPerSemester}.`);
                return;
            }
            if (settings.isOnProbation) {
                if (settings.probationRegistrationLimit != null && totalCredits > settings.probationRegistrationLimit) {
                    showError(`You are on academic probation (GPA: ${settings.currentGpa?.toFixed(2)}). Maximum credits limited to ${settings.probationRegistrationLimit}.`);
                    return;
                }
            }
        }

        const successMsgs = [];
        const failureMsgs = [];

        for (const course of pending) {
            const section = course.isProject ? null : selectedSectionByCourseId[course.courseId];
            try {
                await registerForCourse(course.courseId, section?.value ?? null);
                successMsgs.push(`Registered ${course.title}`);
            } catch (err) {
                const msg = err?.message || err?.toString() || "Unknown error";
                failureMsgs.push(`Failed to register ${course.title}: ${msg}`);
            }
        }

        const registeredCourses = selectedCourses.filter((c) => c.isRegistered);
        for (const course of registeredCourses) {
            if (course.isProject) continue;
            const newSection = selectedSectionByCourseId[course.courseId];
            if (newSection && newSection.value !== course.classId) {
                try {
                    await changeCourseSection(course.courseId, newSection.value);
                    successMsgs.push(`Changed section for ${course.title}`);
                } catch (err) {
                    const msg = err?.message || err?.toString() || "Unknown error";
                    failureMsgs.push(`Failed to change section for ${course.title}: ${msg}`);
                }
            }
        }

        setLocallyAddedCourses([]);
        await queryClient.invalidateQueries({ queryKey: ["coursesRegistration"] });
        await queryClient.invalidateQueries({ queryKey: ["studentSchedule", "registration"] });

        if (failureMsgs.length === 0 && successMsgs.length === 0) {
            setResultDialogVariant("info");
            setResultDialogMessage("No changes were made.");
        } else if (failureMsgs.length === 0) {
            setResultDialogVariant("success");
            setResultDialogMessage(successMsgs.join(", ") + " successfully!");
        } else if (successMsgs.length === 0) {
            setResultDialogVariant("error");
            setResultDialogMessage(failureMsgs.join(", "));
        } else {
            setResultDialogVariant("warning");
            setResultDialogMessage(
                "Partial success:\n" + successMsgs.join(", ") + "\n\nFailures:\n" + failureMsgs.join(", ")
            );
        }
        setShowResultDialog(true);
    };

    return (
        <>
            <CourseRegistrationHeader
                deviceType={isDesktop ? "desktop" : "mobile"}
                selectedCourses={selectedCourses}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                registrationSettings={registrationSettings}
            />

            {loading ? (
                <RegistrationPageSkeleton />
            ) : (
            <div className="flex flex-col gap-6">
                {/* Available / Selected columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Available Courses — LEFT */}
                    <div className="flex flex-col rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light/50 dark:bg-bg-surface-secondary-default-dark/50">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark" />
                                <h3 className="text-sm font-semibold text-text-primary-active-light dark:text-text-primary-active-dark">Available Courses</h3>
                            </div>
                            <span className="text-xs font-medium text-text-secondary-active-light dark:text-text-secondary-active-dark">{availableCourses.length}</span>
                        </div>

                        <div className="flex-1 p-4 space-y-4 min-h-[420px]">
                            {paginatedAvailable.length > 0 ? (
                                paginatedAvailable.map((course, idx) => (
                                    <CourseCard
                                        key={course.courseId}
                                        index={(availableCoursesPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                        course={course}
                                        cardType="available"
                                        onAction={() => handleRegister(course)}
                                    />
                                ))
                            ) : (
                                <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-text-secondary-active-light dark:text-text-secondary-active-dark">
                                    <FileLinesIcon className="w-12 h-12 mb-3 opacity-40" />
                                    <p className="text-sm">No available courses.</p>
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light/30 dark:bg-bg-surface-secondary-default-dark/30">
                            <PaginationButtons totalPages={availableTotalPages} currentPage={availableCoursesPage} setCurrentPage={setAvailableCoursesPage} />
                        </div>
                    </div>

                    {/* Selected Courses — RIGHT */}
                    <div className="flex flex-col rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-success-default-light/10 dark:bg-bg-surface-success-default-dark/10">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-bg-fill-success-default-light dark:bg-bg-fill-success-default-dark" />
                                <h3 className="text-sm font-semibold text-text-primary-active-light dark:text-text-primary-active-dark">Selected Courses</h3>
                            </div>
                            <span className="text-xs font-medium text-text-secondary-active-light dark:text-text-secondary-active-dark">{selectedCredits}</span>
                        </div>

                        <div className="flex-1 p-4 space-y-4 min-h-[420px]">
                            {paginatedSelected.length > 0 ? (
                                paginatedSelected.map((course, idx) => (
                                    <CourseCard
                                        key={course.courseId}
                                        index={(selectedCoursesPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                        course={course}
                                        cardType="selected"
                                        onAction={() => handleUnregister(course)}
                                        sectionOptions={sectionOptionsByCourseId[course.courseId] || []}
                                        selectedSection={selectedSectionByCourseId[course.courseId]}
                                        onSectionChange={(opt) =>
                                            handleSectionChange(course.courseId, opt)
                                        }
                                        conflicts={allConflicts.filter(c => c.courseId === course.courseId)}
                                    />
                                ))
                            ) : (
                                <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-text-secondary-active-light dark:text-text-secondary-active-dark">
                                    <FileLinesIcon className="w-12 h-12 mb-3 opacity-40" />
                                    <p className="text-sm">No courses selected yet.</p>
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light/30 dark:bg-bg-surface-secondary-default-dark/30">
                            <PaginationButtons totalPages={selectedTotalPages} currentPage={selectedCoursesPage} setCurrentPage={setSelectedCoursesPage} />
                        </div>
                    </div>
                </div>

                {/* Weekly Schedule Preview — Collapsible */}
                <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setScheduleOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-bg-surface-secondary-default-light/50 dark:hover:bg-bg-surface-secondary-default-dark/50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-text-secondary-active-light dark:text-text-secondary-active-dark" />
                            <h3 className="text-sm font-semibold text-text-primary-active-light dark:text-text-primary-active-dark">Weekly Schedule Preview</h3>
                        </div>
                        <AngleDownIcon className={`w-4 h-4 text-text-secondary-active-light dark:text-text-secondary-active-dark transition-transform duration-200 ${scheduleOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {scheduleOpen && (
                        <div className="px-4 pb-4">
                            {schedulePreviewLoading ? (
                                <div className="animate-pulse bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-xl h-48 w-full" />
                            ) : isMobile ? (
                                <WeeklyScheduleAgenda days={days} schedule={mergedSchedulePreview} variant="default" />
                            ) : (
                                <WeeklySchedule schedule={mergedSchedulePreview} />
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom action bar */}
                <div className="flex flex-col gap-4 border-t-2 border-border-primary-default-light dark:border-border-primary-default-dark pt-6">
                    {allConflicts.length > 0 && (
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-bg-surface-danger-default-light dark:bg-bg-surface-danger-default-dark border border-border-danger-default-light dark:border-border-danger-default-dark">
                            <WarningIcon className="w-5 h-5 text-text-danger-default-light dark:text-text-danger-default-dark shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-text-danger-default-light dark:text-text-danger-default-dark">
                                    {allConflicts.length} time conflict{allConflicts.length > 1 ? 's' : ''} detected
                                </p>
                                <ul className="mt-1 text-xs text-text-danger-default-light/80 dark:text-text-danger-default-dark/80 space-y-0.5">
                                    {allConflicts.map((c, i) => (
                                        <li key={i}>
                                            {c.courseTitle} {c.type} — overlaps with "{c.conflictWith}" on {c.day} at {c.time}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end">
                        <CoursesRegistrationActionButtons onConfirm={handleConfirmRegistration} />
                    </div>
                </div>
            </div>
            )}

            <Dialog
                isOpen={showResultDialog}
                variant={resultDialogVariant}
                title={resultDialogVariant === "success" ? "Registration Complete" : resultDialogVariant === "warning" ? "Partial Completion" : "Registration Failed"}
                onClose={() => setShowResultDialog(false)}
                confirmText="OK"
            >
                <p>{resultDialogMessage}</p>
            </Dialog>

            <Dialog
                isOpen={showConflictDialog}
                variant="error"
                title="Time Conflict Detected"
                onClose={() => setShowConflictDialog(false)}
                confirmText="OK"
            >
                <div className="space-y-3">
                    <p>{conflictDialogData.message}</p>
                    {conflictDialogData.conflicts?.length > 0 && (
                        <ul className="text-left space-y-2 mt-2">
                            {conflictDialogData.conflicts.map((c, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="text-text-danger-default-light dark:text-text-danger-default-dark shrink-0 mt-0.5">•</span>
                                    <span>
                                        <strong>{c.courseTitle}</strong> ({c.type}) — <strong>{c.day}</strong> at <strong>{c.time}</strong>
                                        <br />
                                        <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                            Conflicts with: {c.conflictWith}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Dialog>
        </>
    );
}