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

export default function ClassForm({ onClose, onSubmit, initialData = null }) {
    const isEdit = !!initialData;

    const [instructorOptions, setInstructorOptions] = useState([]);
    const [selectedType, setSelectedType] = useState(
        classTypeOptions.find((o) => o.value === initialData?.type) || classTypeOptions[0]
    );
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [schedule, setSchedule] = useState(initialData?.schedule || "");
    const [room, setRoom] = useState(initialData?.room || "");
    const [group, setGroup] = useState(initialData?.group || "");

    useEffect(() => {
        async function loadInstructors() {
            try {
                const data = await fetchInstructors();
                const list = Array.isArray(data) ? data : [];
                const opts = list.map((i) => ({
                    value: i.name,
                    label: `${i.name} — ${i.role} — ${i.department}`,
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
        onSubmit({
            type: selectedType.value,
            instructor: selectedInstructor?.value || "",
            schedule,
            room,
            group: group || undefined,
        });
    };

    return (
        <ModelOverlay onClose={onClose}>
            <form
                className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark w-full p-6 rounded-lg shadow-md"
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
                    {/* Class Type */}
                    <SelectBox
                        className="w-full"
                        label="Class Type"
                        labelDirection="flex-col"
                        options={classTypeOptions}
                        selectedOption={selectedType}
                        onChange={setSelectedType}
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

                    {/* Schedule & Room */}
                    <div className="grid grid-cols-2 gap-5">
                        <InputItem
                            label="Schedule"
                            type="text"
                            name="schedule"
                            placeholder="e.g. Sun 10:00 AM, Tue 11:30 AM"
                            value={schedule}
                            onChange={(e) => setSchedule(e.target.value)}
                            required
                        />

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

                    {/* Group (optional — useful for sections) */}
                    {selectedType.value === "Section" && (
                        <InputItem
                            label="Group / Section Number"
                            type="text"
                            name="group"
                            placeholder="e.g. Group 1"
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                        />
                    )}
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
