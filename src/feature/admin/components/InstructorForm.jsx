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

const specializations = [
    { value: 'software', label: 'Software Engineering' },
    { value: 'networking', label: 'Networking' },
    { value: 'databases', label: 'Databases' },
    { value: 'ai', label: 'Artificial Intelligence' },
];

export default function InstructorForm({ onClose, method = "post", onSubmit, initialData = {} }) {
    const [selectedDepartment, setSelectedDepartment] = useState(() => {
        if (initialData.department) {
            return departments.find(d => d.value === initialData.department || d.label === initialData.department) || departments[0];
        }
        return departments[0];
    });

    const [selectedSpecialization, setSelectedSpecialization] = useState(() => {
        if (initialData.specialization) {
            return specializations.find(s => s.value === initialData.specialization || s.label === initialData.specialization) || specializations[0];
        }
        return specializations[0];
    });

    const handleDepartmentChange = (option) => {
        setSelectedDepartment(option);
    };

    const handleSpecializationChange = (option) => {
        setSelectedSpecialization(option);
    };

    return (
        <UserForm role="instructor" method={method} onClose={onClose} onSubmit={onSubmit} initialData={initialData}>
            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className="block mb-2">Role</label>

                    <div className="flex items-center">
                        <input type="radio" id="professor" name="role" value="Professor" className="ml-4 mr-1" defaultChecked={!initialData.role || initialData.role === "Professor"} />
                        <label htmlFor="professor" className="mr-4">Professor</label>
                        <input type="radio" id="lecturer" name="role" value="Technical Assistant" className="ml-4 mr-1" defaultChecked={initialData.role === "Technical Assistant"} />
                        <label htmlFor="lecturer">Technical Assistant</label>
                    </div>
                </div>
                
                <SelectBox
                    className="w-full"
                    label="Department"
                    name="departmentId"
                    labelDirection="flex-col"
                    options={departments}
                    selectedOption={selectedDepartment}
                    onChange={handleDepartmentChange}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <SelectBox
                    className="w-full"
                    label="Specialization"
                    name="specialization"
                    labelDirection="flex-col"
                    options={specializations}
                    selectedOption={selectedSpecialization}
                    onChange={handleSpecializationChange}
                />

                <InputItem label="Hire Date" type="date" id="hireDate" name="hireDate" defaultValue={(initialData.hireDate || new Date().toISOString()).split('T')[0]} required />
            </div>
        </UserForm>
    );
}
