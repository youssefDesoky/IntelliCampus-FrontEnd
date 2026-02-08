import { useState } from "react";
import { addMonths, subMonths } from "date-fns";

import CalendarHeader from "./calendar/CalendarHeader";
import CalendarDays from "./calendar/CalendarDays";
import CalendarCells from "./calendar/CalendarCells";

export default function CalendarWidget() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div className="bg-bg-light dark:bg-bg-dark p-8 rounded-3xl shadow-2xl border border-border-accent-default-light dark:border-border-accent-default-dark">
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
