import { useState, useEffect, useCallback } from "react";
import useDeviceType from "../../../hooks/useDeviceType";

import WeeklySchedule from "../../../components/ui/WeeklySchedule";
import ScheduleHeader from "../../../feature/student/schedule/ScheduleHeader";
import ExamSchedule from "../../../feature/student/schedule/ExamSchedule";
import { fetchMySchedule } from "../../../feature/student/schedule/scheduleApi";
import { fetchMyExams } from "../../../feature/student/schedule/examScheduleApi";

const scheduleStorageKey = "studentCurrSchedule";
const allowedTypeFilters = ["lecture", "section", "activity"];

export default function Schedule() {
    const [currSchedule, setCurrSchedule] = useState(localStorage.getItem(scheduleStorageKey) || "weekly");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [scheduleData, setScheduleData] = useState([]);
    const [examsData, setExamsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isMobile } = useDeviceType();

    const loadScheduleData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [schedule, exams] = await Promise.all([
                fetchMySchedule(),
                fetchMyExams(),
            ]);
            setScheduleData(Array.isArray(schedule) ? schedule : []);
            setExamsData(Array.isArray(exams) ? exams : []);
        } catch (err) {
            console.error("Failed to load schedule data:", err);
            setError(err.message);
            setScheduleData([]);
            setExamsData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadScheduleData();
    }, [loadScheduleData]);

    const getTypeGroup = (eventType) => {
        if (eventType === "lecture") return "lecture";
        if (eventType === "section") return "section";
        return "activity";
    };

    const toggleTypeFilter = (type) => {
        if (!allowedTypeFilters.includes(type)) return;

        setSelectedTypes((prev) => {
            if (prev.includes(type)) {
                return prev.filter((item) => item !== type);
            }

            return [...prev, type];
        });
    };

    const clearTypeFilters = () => setSelectedTypes([]);

    const filteredSchedule = selectedTypes.length === 0
        ? scheduleData
        : scheduleData.filter((event) => selectedTypes.includes(getTypeGroup(event.type)));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">Loading schedule...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Failed to load schedule: {error}</p>
                    <button
                        onClick={loadScheduleData}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>        
            <ScheduleHeader
                currSchedule={currSchedule}
                setCurrSchedule={setCurrSchedule}
                isMobile={isMobile}
                selectedTypes={selectedTypes}
                onToggleType={toggleTypeFilter}
                onClearTypes={clearTypeFilters}
            />

            {currSchedule === "weekly" ? (
                <WeeklySchedule
                    schedule={filteredSchedule}
                    isMobile={isMobile}
                    onEventClick={(event) => alert(`Clicked on event: ${event.title}`)}
                />
            ) : (
                <ExamSchedule exams={examsData} />
            )}
        </>
    );
}