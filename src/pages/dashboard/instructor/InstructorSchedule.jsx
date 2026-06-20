import { useState, useEffect, useCallback } from "react";
import useDeviceType from "../../../hooks/useDeviceType";

import WeeklySchedule from "../../../components/ui/WeeklySchedule";
import ScheduleHeader from "../../../feature/student/schedule/ScheduleHeader";
import ExamSchedule from "../../../feature/student/schedule/ExamSchedule";
import { fetchMySchedule, exportSchedulePdf } from "../../../feature/instructor/schedule/scheduleApi";
import { fetchMyExams, exportExamSchedulePdf } from "../../../feature/instructor/schedule/examScheduleApi";
import { useError } from '../../../contexts/ErrorContext.jsx';

const allowedTypeFilters = ["lecture", "section", "activity"];

export default function InstructorSchedule() {
    const [currSchedule, setCurrSchedule] = useState("weekly");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [scheduleData, setScheduleData] = useState([]);
    const [examsData, setExamsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isMobile } = useDeviceType();
    const { showError } = useError();

    const loadScheduleData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [schedule, exams] = await Promise.all([
                fetchMySchedule(),
                fetchMyExams(),
            ]);
            setScheduleData(Array.isArray(schedule) ? schedule : []);
            setExamsData(Array.isArray(exams) ? exams : []);
        } catch (err) {
            showError(err.message);
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

    const handleExport = async () => {
        try {
            if (currSchedule === "weekly") {
                await exportSchedulePdf(selectedTypes);
            } else {
                await exportExamSchedulePdf();
            }
        } catch (err) {
            showError("Failed to export PDF. Please try again.");
        }
    };

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

    return (
        <>        
            <ScheduleHeader
                currSchedule={currSchedule}
                setCurrSchedule={setCurrSchedule}
                isMobile={isMobile}
                selectedTypes={selectedTypes}
                onToggleType={toggleTypeFilter}
                onClearTypes={clearTypeFilters}
                onExport={handleExport}
            />

            {currSchedule === "weekly" ? (
                <WeeklySchedule
                    schedule={filteredSchedule}
                    isMobile={isMobile}
                    onEventClick={(event) => showError(`Clicked on event: ${event.title}`)}
                />
            ) : (
                <ExamSchedule exams={examsData} />
            )}
        </>
    );
}
