import { useState, useEffect, useMemo } from "react";
import Button from "../../../components/ui/Button";
import InputItem from "../../../components/form/InputItem";
import SelectBox from "../../../components/ui/SelectBox";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import { PlusIcon, XIcon } from "../../../components/ui/icons";
import { fetchInstructors, fetchRooms } from "../services/adminApi";

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
    return schedule.split(",").map((s) => {
        const trimmed = s.trim();
        const spaceIdx = trimmed.indexOf(" ");
        if (spaceIdx === -1) return { day: trimmed, time: "" };
        const rawTime = trimmed.slice(spaceIdx + 1);
        const match = rawTime.match(/(\d{1,2}:\d{2})/);
        return { day: trimmed.slice(0, spaceIdx), time: match ? match[1] : rawTime };
    }).filter((s) => s.day);
}

export default function ClassForm({ onClose, onSubmit, initialData = null, isOpen = true, courseDepartment = "" }) {
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

    const [roomOptions, setRoomOptions] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomText, setRoomText] = useState(initialData?.room || "");

    const [capacity, setCapacity] = useState(initialData?.capacity ?? "");

    const maxSlots = isEdit ? 1 : (selectedType.value === "Section" ? 1 : 2);

    useEffect(() => {
        async function loadData() {
            try {
                const [instructorsData, roomsData] = await Promise.all([
                    fetchInstructors(),
                    fetchRooms(),
                ]);

                const instList = Array.isArray(instructorsData) ? instructorsData : [];
                const instOpts = instList.map((i) => ({
                    value: i.fullName,
                    label: i.fullName,
                    instructorId: i.instructorId,
                    role: i.role,
                    departmentName: i.departmentName || i.department || "",
                }));
                setInstructorOptions(instOpts);

                if (initialData?.instructor) {
                    const match = instOpts.find((o) => o.value === initialData.instructor);
                    if (match) setSelectedInstructor(match);
                    else setSelectedInstructor(instOpts[0] || null);
                } else if (instOpts.length > 0) {
                    setSelectedInstructor(instOpts[0]);
                }

                const roomList = Array.isArray(roomsData) ? roomsData : [];
                const roomOpts = roomList.map((r) => ({
                    value: r.name || r.roomName || r.id,
                    label: `${r.name || r.roomName || r.id}${r.building ? ` — ${r.building}` : ""}`,
                }));
                setRoomOptions(roomOpts);
                if (initialData?.room && roomOpts.length > 0) {
                    const match = roomOpts.find((o) => o.value === initialData.room);
                    if (match) setSelectedRoom(match);
                }
            } catch (err) {
                console.error("Failed to load form data:", err);
            }
        }
        loadData();
    }, [initialData]);

    const filteredInstructorOptions = useMemo(() => {
        const isLecture = selectedType.value === "Lecture";
        const roleMatch = (opt) => {
            const role = (opt.role || "").toLowerCase();
            return isLecture ? role.includes("professor") : role.includes("ta") || role.includes("assistant");
        };
        const deptMatch = (opt) => {
            if (!courseDepartment) return true;
            return (opt.departmentName || "").toLowerCase() === courseDepartment.toLowerCase();
        };

        const byRole = instructorOptions.filter(roleMatch);
        const byBoth = byRole.filter(deptMatch);

        if (byBoth.length > 0) return byBoth;
        if (byRole.length > 0) {
            console.warn(
                `[ClassForm] No instructors matched department "${courseDepartment}". ` +
                `Showing all ${byRole.length} matching instructor(s) by role only.`
            );
            return byRole;
        }
        return [];
    }, [selectedType, instructorOptions, courseDepartment]);

    useEffect(() => {
        if (filteredInstructorOptions.length === 0) {
            if (selectedInstructor !== null) setSelectedInstructor(null);
        } else if (!selectedInstructor || !filteredInstructorOptions.some((o) => o.value === selectedInstructor.value)) {
            setSelectedInstructor(filteredInstructorOptions[0]);
        }
    }, [filteredInstructorOptions, selectedInstructor]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const room = selectedRoom?.value || roomText;
        if (!room) { alert("Please select a room."); return; }
        if (!capacity || Number(capacity) < 1) { alert("Please enter a valid capacity."); return; }
        if (!selectedInstructor) { alert("Please select an instructor."); return; }

        const validSlots = scheduleSlots.filter((s) => s.day && s.time);
        if (validSlots.length === 0) { alert("Please add at least one schedule slot with a time."); return; }

        const payloads = validSlots.map((slot) => ({
            type: selectedType.value,
            instructorName: selectedInstructor.value,
            schedule: `${slot.day} ${slot.time.padStart(5, "0")}:00`,
            room,
            capacity: Number(capacity),
        }));
        console.log("[ClassForm] Submitting:", JSON.stringify(payloads, null, 2));
        onSubmit(payloads);
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
        <BaseFormComponent
            isOpen={isOpen}
            title={isEdit ? "Edit Class" : "Add Class"}
            description={isEdit ? "Update this class details." : "Add a new lecture or section to this course."}
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText={isEdit ? "Save Changes" : "Add Class"}
        >
            <div className="space-y-5 mb-6">
                {/* Row 1: Type + Instructor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectBox
                        className="w-full"
                        label="Class Type"
                        labelDirection="flex-col"
                        options={classTypeOptions}
                        selectedOption={selectedType}
                        onChange={handleTypeChange}
                    />

                    {filteredInstructorOptions.length > 0 ? (
                        <SelectBox
                            className="w-full"
                            label={selectedType.value === "Lecture" ? "Professor" : "Teaching Assistant"}
                            labelDirection="flex-col"
                            options={filteredInstructorOptions}
                            selectedOption={selectedInstructor}
                            onChange={setSelectedInstructor}
                        />
                    ) : (
                        <div className="self-end pb-1">
                            <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                {courseDepartment
                                    ? `No ${selectedType.value === "Lecture" ? "professors" : "TAs"} available for ${courseDepartment}`
                                    : `No ${selectedType.value === "Lecture" ? "professors" : "TAs"} available`}
                            </p>
                        </div>
                    )}
                </div>

                {/* Row 2: Schedule */}
                <div className="border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl p-4 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                    <div className="flex items-center justify-between mb-3">
                        <label className="font-semibold text-sm text-text-primary-active-light dark:text-text-primary-active-dark">
                            Schedule
                        </label>

                        {!isEdit && scheduleSlots.length < maxSlots && (
                            <Button type="button" variant="text" size="sm" onClick={addSlot}>
                                <PlusIcon className="w-4 h-4" />
                                Add day
                            </Button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {scheduleSlots.map((slot, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 p-3 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark"
                            >
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

                                {!isEdit && scheduleSlots.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSlot(idx)}
                                        className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors shrink-0"
                                        title="Remove slot"
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Row 3: Room + Capacity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {roomOptions.length > 0 ? (
                        <SelectBox
                            className="w-full"
                            label="Room"
                            labelDirection="flex-col"
                            options={roomOptions}
                            selectedOption={selectedRoom}
                            onChange={(opt) => {
                                setSelectedRoom(opt);
                                setRoomText(opt?.value || "");
                            }}
                        />
                    ) : (
                        <InputItem
                            label="Room"
                            type="text"
                            name="room"
                            placeholder="e.g. Hall A-201"
                            value={roomText}
                            onChange={(e) => {
                                setRoomText(e.target.value);
                                setSelectedRoom(null);
                            }}
                            required
                        />
                    )}

                    <InputItem
                        label="Capacity"
                        type="number"
                        name="capacity"
                        placeholder="e.g. 30"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        min="1"
                        required
                    />
                </div>
            </div>
        </BaseFormComponent>
    );
}
