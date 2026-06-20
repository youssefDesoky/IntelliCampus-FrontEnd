import { useState } from "react";
import { Form } from "react-router-dom";

import ModelOverlay from "../../../components/ui/ModelOverlay";
import InputItem from "../../../components/form/InputItem";
import DateTimeInput from "../../../components/form/DateTimeInput";
import Button from "../../../components/ui/Button";
import { XIcon } from "../../../components/ui/icons";

const toLocalDatetimeValue = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function AddReminderForm({ setIsFormOpen, onAddReminder, onSaveReminder, initialReminder = null }) {
    const isEditing = Boolean(initialReminder?.id);

    const [title, setTitle] = useState(initialReminder?.title || "");
    const [datetime, setDatetime] = useState(toLocalDatetimeValue(initialReminder?.dueAt));
    const [location, setLocation] = useState(initialReminder?.location || "");
    const [submitted, setSubmitted] = useState(false);

    const now = new Date();
    const minDatetime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const isPastDate = datetime && new Date(datetime) < new Date();

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (!title || !datetime || isPastDate) return;

        const reminderPayload = {
            title: title.trim(),
            dueAt: new Date(datetime).toISOString(),
            location: location.trim(),
            category: "personal",
            priority: "medium",
        };

        if (isEditing) {
            onSaveReminder?.({
                ...initialReminder,
                ...reminderPayload,
            });
        } else {
            onAddReminder?.(reminderPayload);
        }
        
        setIsFormOpen(false);
    };

    return (
        <ModelOverlay onClose={() => setIsFormOpen(false)}>
            <Form className="relative bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-6 space-y-6 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark w-full max-w-md" onSubmit={handleSubmit}>
                <button type="button" className="absolute top-6 right-6" onClick={() => setIsFormOpen(false)}>
                    <XIcon size={20} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                </button>
                
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {isEditing ? "Edit Reminder" : "Add New Reminder"}
                </h2>

                <div className="flex flex-col gap-4">
                    <InputItem 
                        label="Title" 
                        name="title"
                        placeholder="Enter reminder title"
                        errorMessage={submitted && !title ? "Title is required" : ""}
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />

                    <InputItem
                        label={<>Location <span className="font-normal">(Optional)</span></>}
                        name="location"
                        type="text"
                        placeholder="Room, hall, link, or note"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />

                    <DateTimeInput 
                        label="Date & Time" 
                        name="datetime" 
                        min={minDatetime}
                        errorMessage={
                            submitted && !datetime
                                ? "Date and time are required"
                                : isPastDate
                                    ? "Date and time cannot be in the past"
                                    : ""
                        }
                        value={datetime} 
                        onChange={(e) => setDatetime(e.target.value)} 
                    />
                </div>

                <Button type="submit" width="w-[75%]" className="mx-auto">
                    {isEditing ? "Save Changes" : "Save Reminder"}
                </Button>
            </Form>
        </ModelOverlay>
    );
}