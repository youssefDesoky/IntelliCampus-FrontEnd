import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import useDeviceType from "../../../hooks/useDeviceType";

import Section from "../../../components/ui/Section";
import WeeklySchedule, { days } from "../../../components/ui/WeeklySchedule";
import WeeklyScheduleAgenda from "../../../components/ui/schedule/WeeklyScheduleAgenda.phone";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import Dialog from "../../../components/ui/Dialog";

import CourseCard from "../../../feature/student/courses/courseRegister/CourseCard";
import CourseRegistrationNote from "../../../feature/student/courses/courseRegister/CourseRegistrationNote";
import CourseRegistrationHeader from "../../../feature/student/courses/courseRegister/CourseRegistrationHeader";
import CoursesRegistrationActionButtons from "../../../feature/student/courses/courseRegister/CourseRegistrationActionButtons";
import { RegistrationPageSkeleton } from "../../../feature/student/courses/courseRegister/SkeletonLoader";

import {
    fetchActiveCourses,
    fetchClassesForCourse,
    getMyRegistrations,
    registerForCourse,
    unregisterFromCourse,
} from "../../../feature/student/courses/courseRegister/registrationApi";
import { fetchMySchedule } from "../../../feature/student/schedule/scheduleApi";
import { useError } from '../../../contexts/ErrorContext.jsx';


function mapRegistrationToCard(reg) {
    return {
        id:          reg.courseCode  ?? reg.code ?? reg.courseId ?? "",
        title:       reg.courseName  ?? "",
        code:        reg.courseCode  ?? reg.code ?? "",
        creditHours: reg.creditHours ?? "",
        professor:   reg.professorName ?? reg.professor ?? "",
        schedule:    reg.schedule    ?? "",
        room:        reg.room        ?? "",
        courseId:     reg.courseId,
        classId:      reg.classId,
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
        schedule:      course.schedule    ?? "",
        room:          course.room        ?? "",
        preRequisites: course.prerequisites ?? course.preRequisites ?? null,
        courseId:       course.courseId    ?? course.id,
        classId:       course.classId,
        isRegistered: false,
    };
}

const ITEMS_PER_PAGE = 3;

export default function CoursesRegistration() {
    const { isDesktop, isMobile } = useDeviceType();

    const [locallyAddedCourses, setLocallyAddedCourses] = useState([]);
    const [sectionOptionsByCourseId, setSectionOptionsByCourseId] = useState({});
    const [selectedSectionByCourseId, setSelectedSectionByCourseId] = useState({});
    const [pendingRemovalCourseIds, setPendingRemovalCourseIds] = useState([]);
    const { showError } = useError();
    const queryClient = useQueryClient();

    const { data: registrationData, isLoading: loading } = useQuery({
        queryKey: ["coursesRegistration"],
        queryFn: async () => {
            const [registrations, courses] = await Promise.all([getMyRegistrations(), fetchActiveCourses()]);
            return { registrations, courses };
        },
        staleTime: 2 * 60 * 1000,
    });

    const { data: scheduleData = [], isLoading: schedulePreviewLoading } = useQuery({
        queryKey: ["studentSchedule"],
        queryFn: fetchMySchedule,
        staleTime: 5 * 60 * 1000,
    });

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
        return serverAvailable.filter(c => !addedIds.has(c.courseId));
    }, [registrationData, locallyAddedCourses]);

    const [selectedCoursesPage, setSelectedCoursesPage]   = useState(1);
    const [availableCoursesPage, setAvailableCoursesPage] = useState(1);

    const [showResultDialog, setShowResultDialog]   = useState(false);
    const [resultDialogVariant, setResultDialogVariant] = useState("success");
    const [resultDialogMessage, setResultDialogMessage] = useState("");
    const schedulePreview = Array.isArray(scheduleData) ? scheduleData : [];

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
                            const groupName = cls.groupCode ?? cls.group ?? cls.groupName ?? cls.className ?? "";
                            const taName = cls.instructorName ?? cls.taName ?? "";
                            const classId = cls.classId ?? cls.id ?? "";
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

    /* ── Register / Unregister handlers ── */
    const handleRegister = (course) => {
        setLocallyAddedCourses((prev) => {
            if (prev.some((c) => c.courseId === course.courseId)) return prev;
            return [...prev, { ...course, isRegistered: false }];
        });
    };

    const handleUnregister = (course) => {
        if (!course.isRegistered) {
            setLocallyAddedCourses((prev) => prev.filter((c) => c.courseId !== course.courseId));
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
                showError(`Please select a section for ${course.title}.`);
                return;
            }
        }

        const successMsgs = [];
        const failureMsgs = [];

        for (const course of pendingRemovals) {
            try {
                await unregisterFromCourse(course.courseId);
                successMsgs.push(`Removed ${course.title}`);
            } catch {
                failureMsgs.push(`Failed to remove ${course.title}`);
            }
        }
        for (const course of pending) {
            const section = selectedSectionByCourseId[course.courseId];
            try {
                await registerForCourse(course.courseId, section.value);
                successMsgs.push(`Registered ${course.title}`);
            } catch {
                failureMsgs.push(`Failed to register ${course.title}`);
            }
        }

        setPendingRemovalCourseIds([]);
        setLocallyAddedCourses([]);
        await queryClient.invalidateQueries({ queryKey: ["coursesRegistration"] });

        if (failureMsgs.length === 0) {
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
            <CourseRegistrationHeader deviceType={isDesktop ? "desktop" : "mobile"} selectedCourses={selectedCourses} />

            {loading ? (
                <RegistrationPageSkeleton />
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

                <Section className="md:col-span-2">
                    <div>
                        <h3 className="text-md font-semibold">Weekly Schedule Preview</h3>

                        {schedulePreviewLoading ? (
                            <div className="animate-pulse bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-xl h-48 w-full" />
                        ) : isMobile ? (
                            <WeeklyScheduleAgenda days={days} schedule={schedulePreview} variant="default" />
                        ) : (
                            <WeeklySchedule schedule={schedulePreview} />
                        )}
                    </div>
                </Section>

                <div className="md:col-span-2 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-t-2 border-border-primary-default-light dark:border-border-primary-default-dark pt-6">
                    <CoursesRegistrationActionButtons onConfirm={handleConfirmRegistration} />

                    <CourseRegistrationNote />
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
        </>
    );
}