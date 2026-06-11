import { useState, useEffect } from "react";
import InputItem from "../../../components/form/InputItem";
import SelectBox from "../../../components/ui/SelectBox";
import RadioToggle from "../../../components/form/RadioToggle";
import UserForm from "./UserForm";
import { fetchBylaws } from "../services/adminApi";

const programs = [
    { value: 'General', label: 'General' },
    { value: 'Credit', label: 'Credit' },
];

const departments = [
    { value: 'CS', label: 'Computer Science' },
    { value: 'IS', label: 'Information Systems' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'AI', label: 'Artificial Intelligence' },
];

const levels = [
    { value: 1, label: 'First Year' },
    { value: 2, label: 'Second Year' },
    { value: 3, label: 'Third Year' },
    { value: 4, label: 'Fourth Year' },
];

export default function StudentForm({ onClose, method = "post", onSubmit, initialData = {} }) {
    const [bylaws, setBylaws] = useState([]);

    const [selectedProgram, setSelectedProgram] = useState(() => {
        if (initialData.program) {
            return programs.find(p => p.value === initialData.program || p.label === initialData.program) || programs[0];
        }
        return programs[0];
    });

    const [selectedDepartment, setSelectedDepartment] = useState(() => {
        if (initialData.department) {
            return departments.find(d => d.value === initialData.department || d.label === initialData.department) || departments[0];
        }
        return departments[0];
    });

    const [selectedLevel, setSelectedLevel] = useState(() => {
        if (initialData.level) {
            return levels.find(l => l.value === initialData.level || l.label === initialData.level) || levels[0];
        }
        return levels[0];
    });

    const [selectedBylaw, setSelectedBylaw] = useState(null);

    useEffect(() => {
        fetchBylaws()
            .then(data => {
                const options = data.map(b => ({ value: b.baylawId, label: b.name }));
                setBylaws(options);
                if (initialData.baylawId) {
                    const match = options.find(o => o.value === initialData.baylawId);
                    if (match) setSelectedBylaw(match);
                }
            })
            .catch(console.error);
    }, [initialData.baylawId]);

    const handleDepartmentChange = (option) => {
        setSelectedDepartment(option);
    };

    const handleLevelChange = (option) => {
        setSelectedLevel(option);
    };

    const handleBylawChange = (option) => {
        setSelectedBylaw(option);
    };

    return (
        <UserForm role="student" method={method} onClose={onClose} onSubmit={onSubmit} initialData={initialData}>
            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className="block mb-2">Program</label>

                    <RadioToggle
                        name="program"
                        options={programs}
                        value={selectedProgram.value}
                        onChange={(value) => {
                            const selected = programs.find((program) => program.value === value) || programs[0];
                            setSelectedProgram(selected);
                        }}
                    />
                </div>
                
                <SelectBox
                    className="w-full"
                    label="Department"
                    name="department"
                    labelDirection="flex-col"
                    options={departments}
                    selectedOption={selectedDepartment}
                    onChange={handleDepartmentChange}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <SelectBox
                    className="w-full"
                    label="Level"
                    name="level"
                    labelDirection="flex-col"
                    options={levels}
                    selectedOption={selectedLevel}
                    onChange={handleLevelChange}
                />

                <SelectBox
                    className="w-full"
                    label="Bylaw"
                    name="baylawId"
                    labelDirection="flex-col"
                    options={bylaws}
                    selectedOption={selectedBylaw}
                    onChange={handleBylawChange}
                />

                <InputItem label="Enrollment Date" type="date" id="enrollmentDate" name="enrollmentDate" defaultValue={(initialData.enrollmentDate || new Date().toISOString()).split('T')[0]} required />
            </div>
        </UserForm>
    );
}
