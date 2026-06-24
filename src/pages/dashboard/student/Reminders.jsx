import { useState, useEffect, useRef } from "react";
import { addDays, subDays, isSameDay, startOfDay, format } from "date-fns";

import Categories from "../../../feature/student/reminders/Categories";
import RemindersHeader from "../../../feature/student/reminders/RemindersHeader";
import Timeline from "../../../feature/student/reminders/Timeline";
import CalenderWidget from "../../../components/ui/CalendarWidget";
import AddReminderForm from "../../../feature/student/reminders/AddReminderForm";
import { RemindersSkeleton } from "../../../feature/student/reminders/SkeletonLoader";
import { fetchRemindersByDay, createReminder as createReminderApi, updateReminder as updateReminderApi, deleteReminder as deleteReminderApi } from "../../../feature/student/remindersApi";
import { useError } from '../../../contexts/ErrorContext.jsx';

const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "classes", label: "Classes" },
    { value: "exams", label: "Exams" },
    { value: "assignments", label: "Assignments" },
    { value: "personal", label: "Personal" },
];

const MobileDateStrip = ({ selectedDate, onDateSelect }) => {
    const containerRef = useRef(null);
    const selectedRef = useRef(null);
    const dates = Array.from({ length: 22 }).map((_, i) => addDays(subDays(selectedDate, 7), i));

    useEffect(() => {
        if (selectedRef.current && containerRef.current) {
            const container = containerRef.current;
            const element = selectedRef.current;
            const scrollLeft = element.offsetLeft - (container.clientWidth / 2) + (element.offsetWidth / 2);
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }, [selectedDate]);

    return (
        <div
            ref={containerRef}
            className="flex overflow-x-auto gap-3 py-2 mb-4 lg:hidden snap-x scroll-smooth [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {dates.map(date => {
                const isSelected = isSameDay(date, selectedDate);
                return (
                    <button
                        key={date.toISOString()}
                        ref={isSelected ? selectedRef : null}
                        onClick={() => onDateSelect(date)}
                        className={`flex flex-col items-center justify-center min-w-[70px] h-[85px] rounded-2xl border transition-all snap-center ${
                            isSelected
                                ? 'bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark border-border-accent-default-light dark:border-border-accent-default-dark shadow-md scale-105'
                                : 'bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-bg-surface-secondary-hover-light dark:hover:bg-bg-surface-secondary-hover-dark'
                        }`}
                    >
                        <span className="text-2xl font-semibold leading-none mb-1">{format(date, 'd')}</span>
                        <span className="text-sm font-medium">{format(date, 'EEE')}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default function Reminders() {
    const { showError } = useError();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingReminder, setEditingReminder] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reminders, setReminders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        async function load() {
            try {
                const data = await fetchRemindersByDay(selectedDate);
                if (!cancelled) setReminders(Array.isArray(data) ? data : []);
            } catch (err) {
                if (!cancelled) {
                    showError(err.message);
                    setReminders([]);
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [selectedDate, showError]);

    const reloadReminders = async () => {
        try {
            const data = await fetchRemindersByDay(selectedDate);
            setReminders(Array.isArray(data) ? data : []);
        } catch (err) {
            showError(err.message);
            setReminders([]);
        }
    };

    const handleSetIsFormOpen = (isOpen) => {
        if (isOpen) setEditingReminder(null);
        setIsFormOpen(isOpen);
    };

    const handleAddReminder = async (reminder) => {
        try {
            await createReminderApi(reminder);
            await reloadReminders();
            setIsFormOpen(false);
        } catch (err) {
            showError(err.message);
        }
    };

    const handleSaveReminder = async (updatedReminder) => {
        try {
            await updateReminderApi(updatedReminder.id, updatedReminder);
            await reloadReminders();
            setEditingReminder(null);
            setIsFormOpen(false);
        } catch (err) {
            showError(err.message);
        }
    };

    const handleEditReminder = (reminder) => {
        setEditingReminder(reminder);
        setIsFormOpen(true);
    };

    const handleDeleteReminder = async (reminderToDelete) => {
        try {
            await deleteReminderApi(reminderToDelete.id);
            await reloadReminders();
        } catch (err) {
            showError(err.message);
        }
    };

    const getReminderDay = (reminderDate) => startOfDay(new Date(reminderDate));
    const selectedDay = startOfDay(selectedDate);
    const nextDay = addDays(selectedDay, 1);
    const weekEnd = addDays(selectedDay, 7);

    const isInSelectedWeek = (reminderDate) => {
        const reminderDay = getReminderDay(reminderDate);
        return reminderDay >= selectedDay && reminderDay <= weekEnd;
    };

    const visibleReminders = reminders.filter((reminder) => {
        const isCategoryMatch = selectedCategory?.value === "all" || reminder.category === selectedCategory?.value;
        return isCategoryMatch && isInSelectedWeek(reminder.dueAt);
    });

    const groupedReminders = {
        selectedDay: visibleReminders.filter((reminder) => isSameDay(new Date(reminder.dueAt), selectedDay)),
        nextDay: visibleReminders.filter((reminder) => isSameDay(new Date(reminder.dueAt), nextDay)),
        week: visibleReminders.filter((reminder) => {
            const reminderDay = getReminderDay(reminder.dueAt);
            return reminderDay > nextDay && reminderDay <= weekEnd;
        }),
    };

    if (isLoading) {
        return <RemindersSkeleton />;
    }

    return (
        <>
            <RemindersHeader setIsFormOpen={handleSetIsFormOpen} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} reminders={reminders} />

            {/* Mobile Date Ribbon */}
            <MobileDateStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <Timeline
                    className="lg:col-span-3 min-h-dvh md:min-h-0"
                    reminders={groupedReminders}
                    selectedCategory={selectedCategory}
                    selectedDate={selectedDate}
                    onEditReminder={handleEditReminder}
                    onDeleteReminder={handleDeleteReminder}
                />

                <div className="flex flex-col gap-6">
                    {/* Desktop Calendar Widget */}
                    <div className="hidden lg:block">
                        <CalenderWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                    </div>
                    <div className="hidden lg:block">
                        <Categories
                            reminders={reminders}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />
                    </div>
                </div>
            </div>

            {isFormOpen && (
                <AddReminderForm
                    setIsFormOpen={setIsFormOpen}
                    onAddReminder={handleAddReminder}
                    onSaveReminder={handleSaveReminder}
                    initialReminder={editingReminder}
                />
            )}
        </>
    );
}