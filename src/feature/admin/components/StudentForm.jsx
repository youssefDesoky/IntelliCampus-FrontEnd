import { useState } from "react";
import InputItem from "../../../components/form/InputItem";
import SelectBox from "../../../components/ui/SelectBox";
import UserForm from "./UserForm";

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

    const handleDepartmentChange = (option) => {
        setSelectedDepartment(option);
    };

    const handleLevelChange = (option) => {
        setSelectedLevel(option);
    };

    return (
        <UserForm role="student" method={method} onClose={onClose} onSubmit={onSubmit} initialData={initialData}>
            <div className="grid grid-cols-2 gap-6">
                <InputItem label="Faculty" type="text" id="faculty" name="faculty" placeholder="Enter faculty" defaultValue={initialData.faculty || ""} required />
                
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

                <InputItem label="Enrollment Date" type="date" id="enrollmentDate" name="enrollmentDate" defaultValue={(initialData.enrollmentDate || new Date().toISOString()).split('T')[0]} required />
            </div>
        </UserForm>
    );
}
