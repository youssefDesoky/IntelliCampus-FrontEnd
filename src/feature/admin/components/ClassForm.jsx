import { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";
import InputItem from "../../../components/form/InputItem";
import SelectBox from "../../../components/ui/SelectBox";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import { CheckIcon, XIcon } from "../../../components/ui/icons";
import { fetchInstructors } from "../services/adminApi";

const classTypeOptions = [
    { value: "Lecture", label: "Lecture" },
    { value: "Section", label: "Section" },
];

const dayOptions = [
    { value: "Sun", label: "Sunday" },
    { value: "Mon", label: "Monday" },
    { value: "Tue", label: "Tuesday" },
    { value: "Wed", label: "Wednesday" },
    { value: "Thu", label: "Thursday" },
    { value: "Fri", label: "Friday" },
    { value: "Sat", label: "Saturday" },
];

function parseSchedule(schedule) {
    if (!schedule) return [];
    // Parse "Sun 10:00 AM, Tue 11:30 AM" → [{day, time}]
    return schedule.split(",").map((s) => {
        const trimmed = s.trim();
        const spaceIdx = trimmed.indexOf(" ");
        if (spaceIdx === -1) return { day: trimmed, time: "" };
        return { day: trimmed.slice(0, spaceIdx), time: trimmed.slice(spaceIdx + 1) };
    }).filter((s) => s.day);
}

export default function ClassForm({ onClose, onSubmit, initialData = null }) {
    const isEdit = !!initialData;

    const [instructorOptions, setInstructorOptions] = useState([]);
    const [selectedType, setSelectedType] = useState(
        classTypeOptions.find((o) => o.value === initialData?.type) || classTypeOptions[0]
    );
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [scheduleSlots, setScheduleSlots] = useState(() => {
        const parsed = parseSchedule(initialData?.schedule);
        return parsed.length > 0 ? parsed : [{ day: "Sun", time: "" }];
    });
    const [room, setRoom] = useState(initialData?.room || "");

    const maxSlots = selectedType.value === "Section" ? 1 : 2;

    useEffect(() => {
        async function loadInstructors() {
            try {
                const data = await fetchInstructors();
                const list = Array.isArray(data) ? data : [];
                const opts = list.map((i) => ({
                    value: i.fullName,
                    label: `${i.fullName} — ${i.role || "Instructor"} — ${i.departmentName || ""}`,
                    instructorId: i.instructorId,
                }));
                setInstructorOptions(opts);

                if (initialData?.instructor) {
                    const match = opts.find((o) => o.value === initialData.instructor);
                    if (match) setSelectedInstructor(match);
                    else setSelectedInstructor(opts[0] || null);
                } else if (opts.length > 0) {
                    setSelectedInstructor(opts[0]);
                }
            } catch (err) {
                console.error("Failed to load instructors:", err);
            }
        }
        loadInstructors();
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const schedule = scheduleSlots
            .filter((s) => s.day && s.time)
            .map((s) => `${s.day} ${s.time}`)
            .join(", ");
        const classData = {
            type: selectedType.value,
            instructor: selectedInstructor?.value || "",
            schedule,
            room,
        };
        console.log("[ClassForm] Submitting:", JSON.stringify(classData, null, 2));
        onSubmit(classData);
    };

    const handleTypeChange = (option) => {
        setSelectedType(option);
        const nextMax = option.value === "Section" ? 1 : 2;
        setScheduleSlots((prev) => prev.slice(0, nextMax));
    };

    const updateSlot = (index, field, value) => {
        setScheduleSlots((prev) =>
            prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
        );
    };

    const addSlot = () => {
        setScheduleSlots((prev) => {
            if (prev.length >= maxSlots) return prev;
            return [...prev, { day: "Sun", time: "" }];
        });
    };

    const removeSlot = (index) => {
        setScheduleSlots((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <ModelOverlay onClose={onClose}>
            <form
                className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark w-full p-6 rounded-lg shadow-md overflow-hidden"
                onSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-semibold">
                            {isEdit ? "Edit Class" : "Add Class"}
                        </h2>
                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            {isEdit
                                ? "Update this class details."
                                : "Add a new lecture or section to this course."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 place-self-start rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 hover:text-gray-800"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Class Type */}
                        <SelectBox
                            className="w-full"
                            label="Class Type"
                            labelDirection="flex-col"
                            options={classTypeOptions}
                            selectedOption={selectedType}
                            onChange={handleTypeChange}
                        />

                        {/* Instructor */}
                        {instructorOptions.length > 0 && (
                            <SelectBox
                                className="w-full"
                                label="Instructor"
                                labelDirection="flex-col"
                                options={instructorOptions}
                                selectedOption={selectedInstructor}
                                onChange={setSelectedInstructor}
                            />
                        )}
                    </div>

                    {/* Schedule */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block mb-2 font-bold text-sm text-text-primary-default-light dark:text-text-primary-default-dark">
                                Schedule
                            </label>

                            {scheduleSlots.length < maxSlots && (
                                <button
                                    type="button"
                                    onClick={addSlot}
                                    className="text-sm text-text-accent-active-light dark:text-text-accent-active-dark hover:underline"
                                >
                                    + Add another day
                                </button>
                            )}
                        </div>
                        <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {scheduleSlots.map((slot, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <select
                                        value={slot.day}
                                        onChange={(e) => updateSlot(idx, "day", e.target.value)}
                                        className="px-3 py-2 rounded-md border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark focus:outline-none text-sm"
                                    >
                                        {dayOptions.map((d) => (
                                            <option key={d.value} value={d.value}>{d.label}</option>
                                        ))}
                                    </select>

                                    <input
                                        type="time"
                                        value={slot.time}
                                        onChange={(e) => updateSlot(idx, "time", e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-md border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark focus:outline-none text-sm"
                                        required
                                    />

                                    {scheduleSlots.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSlot(idx)}
                                            className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                                            title="Remove slot"
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Room */}
                    <InputItem
                        label="Room"
                        type="text"
                        name="room"
                        placeholder="e.g. Hall A-201"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        required
                    />
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Button variant="secondary" type="button" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button variant="primary" type="submit">
                        <CheckIcon className="w-5 h-5" />{" "}
                        {isEdit ? "Save Changes" : "Add Class"}
                    </Button>
                </div>
            </form>
        </ModelOverlay>
    );
}
