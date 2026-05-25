import { useState, useEffect, useCallback } from "react";
import { addDays, isSameDay, startOfDay } from "date-fns";

import Categories from "../../../feature/student/reminders/Categories";
import RemindersHeader from "../../../feature/student/reminders/RemindersHeader";
import Timeline from "../../../feature/student/reminders/Timeline";
import CalenderWidget from "../../../components/ui/CalendarWidget"
import AddReminderForm from "../../../feature/student/reminders/AddReminderForm";
import { fetchRemindersByDay, createReminder as createReminderApi, updateReminder as updateReminderApi, deleteReminder as deleteReminderApi } from "../../../feature/student/remindersApi";

const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "classes", label: "Classes" },
    { value: "exams", label: "Exams" },
    { value: "assignments", label: "Assignments" },
    { value: "personal", label: "Personal" },
];

export default function Reminders() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingReminder, setEditingReminder] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reminders, setReminders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadReminders = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await fetchRemindersByDay(selectedDate);
            setReminders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load reminders:", err);
            setReminders([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        loadReminders();
    }, [loadReminders]);

    const handleSetIsFormOpen = (isOpen) => {
        if (isOpen) setEditingReminder(null);
        setIsFormOpen(isOpen);
    };

    const handleAddReminder = async (reminder) => {
        try {
            await createReminderApi(reminder);
            await loadReminders();
            setIsFormOpen(false);
        } catch (err) {
            console.error("Failed to create reminder:", err);
        }
    };

    const handleSaveReminder = async (updatedReminder) => {
        try {
            await updateReminderApi(updatedReminder.id, updatedReminder);
            await loadReminders();
            setEditingReminder(null);
            setIsFormOpen(false);
        } catch (err) {
            console.error("Failed to update reminder:", err);
        }
    };

    const handleEditReminder = (reminder) => {
        setEditingReminder(reminder);
        setIsFormOpen(true);
    };

    const handleDeleteReminder = async (reminderToDelete) => {
        try {
            await deleteReminderApi(reminderToDelete.id);
            await loadReminders();
        } catch (err) {
            console.error("Failed to delete reminder:", err);
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

    return (
        <>
            <RemindersHeader setIsFormOpen={handleSetIsFormOpen} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <Timeline
                    className="lg:col-span-3"
                    reminders={groupedReminders}
                    selectedCategory={selectedCategory}
                    selectedDate={selectedDate}
                    onEditReminder={handleEditReminder}
                    onDeleteReminder={handleDeleteReminder}
                />

                <div className="flex flex-col gap-6">
                    <CalenderWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                    <Categories
                        reminders={reminders}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
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