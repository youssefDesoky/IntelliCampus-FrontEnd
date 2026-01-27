import { useEffect, useState } from "react";
import { addMonths, subMonths } from "date-fns";

import CalendarHeader from "./CalendarHeader";
import CalendarDays from "./CalendarDays";
import CalendarCells from "./CalendarCells";

export default function CalendarWidget() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
    console.log("Selected Date:", selectedDate);
    }, [selectedDate]);

    return (
        <div className="bg-page-bg-light dark:bg-page-bg-dark p-8 rounded-3xl shadow-2xl border border-accent-light dark:border-accent-dark">
            <CalendarHeader
                currentMonth={currentMonth}
                onPrev={() => setCurrentMonth(subMonths(currentMonth, 1))}
                onNext={() => setCurrentMonth(addMonths(currentMonth, 1))}
            />

            <CalendarDays />

            <CalendarCells
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />
        </div>
    );
}
