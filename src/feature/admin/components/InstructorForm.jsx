import { useState } from "react";
import InputItem from "../../../components/form/InputItem";
import SelectBox from "../../../components/ui/SelectBox";
import UserForm from "./UserForm";
import RadioToggle from "../../../components/form/RadioToggle";

const departments = [
    { value: 'CS', label: 'Computer Science' },
    { value: 'IS', label: 'Information Systems' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'AI', label: 'Artificial Intelligence' },
];

const employmentStatuses = [
    { value: 'Permanent', label: 'Permanent' },
    { value: 'On Loan', label: 'On Loan' },
];

export default function InstructorForm({ onClose, method = "post", onSubmit, initialData = {} }) {
    const [selectedRole, setSelectedRole] = useState(initialData.role || "Professor");

    const [selectedDepartment, setSelectedDepartment] = useState(() => {
        if (initialData.department) {
            return departments.find(d => d.value === initialData.department || d.label === initialData.department) || departments[0];
        }
        return departments[0];
    });

    const [selectedEmploymentStatus, setSelectedEmploymentStatus] = useState(() => {
        const status = initialData.employmentStatus || initialData.professorStatus;
        if (status) {
            return employmentStatuses.find(option => option.value === status) || employmentStatuses[0];
        }
        return employmentStatuses[0];
    });

    const handleDepartmentChange = (option) => {
        setSelectedDepartment(option);
    };

    const handleRoleChange = (val) => {
        setSelectedRole(val);
    };

    const handleEmploymentStatusChange = (val) => {
        const status = employmentStatuses.find(e => e.value === val);
        setSelectedEmploymentStatus(status || employmentStatuses[0]);
    };

    const isProfessor = selectedRole === "Professor";

    return (
        <UserForm role="instructor" method={method} onClose={onClose} onSubmit={onSubmit} initialData={initialData}>
            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className="block mb-2">Role</label>

                    <RadioToggle
                        name="role"
                        options={[{ value: 'Professor', label: 'Professor' }, { value: 'Technical Assistant', label: 'Technical Assistant' }]}
                        value={selectedRole}
                        onChange={handleRoleChange}
                    />
                </div>
                
                {isProfessor ? (
                    <div className="flex flex-col">
                        <label className="block mb-2">Professor Status</label>
                        <RadioToggle
                            name="employmentStatus"
                            options={employmentStatuses}
                            value={selectedEmploymentStatus.value}
                            onChange={handleEmploymentStatusChange}
                        />
                    </div>
                ) : (
                    <SelectBox
                        className="w-full"
                        label="Department"
                        name="departmentId"
                        labelDirection="flex-col"
                        options={departments}
                        selectedOption={selectedDepartment}
                        onChange={handleDepartmentChange}
                    />
                )}
            </div>

            {isProfessor && (
                <div className="grid grid-cols-2 gap-6">
                    <SelectBox
                        className="w-full"
                        label="Department"
                        name="departmentId"
                        labelDirection="flex-col"
                        options={departments}
                        selectedOption={selectedDepartment}
                        onChange={handleDepartmentChange}
                    />
                    <InputItem label="Hire Date" type="date" id="hireDate" name="hireDate" defaultValue={(initialData.hireDate || new Date().toISOString()).split('T')[0]} required />
                </div>
            )}

            {!isProfessor && (
                <div className="grid grid-cols-1 gap-6">
                    <InputItem label="Hire Date" type="date" id="hireDate" name="hireDate" defaultValue={(initialData.hireDate || new Date().toISOString()).split('T')[0]} required />
                </div>
            )}
        </UserForm>
    );
}
