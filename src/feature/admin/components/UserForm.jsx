import { useState } from "react";
import Button from "../../../components/ui/Button";
import TextArea from "../../../components/ui/TextArea";
import { PlusIcon, FilePenIcon } from "../../../components/ui/icons";
import InputItem from "../../../components/form/InputItem";
import SelectBox from "../../../components/ui/SelectBox";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";

const nationalities = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'in', label: 'India' },
];

const adminRoleOptions = [
    { value: 'Post Grad Affairs Admin', label: 'Post Grad Affairs Admin' },
    { value: 'Under Grad Affairs Admin', label: 'Under Grad Affairs Admin' },
];

export default function UserForm({ role, method = "post", onClose, onSubmit, initialData = {}, children, isOpen = true }) {
    const roleLabel = role === "admin" ? "Admin" : role === "student" ? "Student" : "Instructor";
    const isEdit = method === "put";
    const roleIdField = `${role}Id`;

    const [selectedNationality, setSelectedNationality] = useState(() => {
        if (initialData.nationality) {
            return nationalities.find(n => n.value === initialData.nationality || n.label === initialData.nationality) || nationalities[0];
        }
        return nationalities[0];
    });

    const [selectedAdminRole, setSelectedAdminRole] = useState(() => {
        if (initialData.role) {
            return adminRoleOptions.find(o => o.value === initialData.role) || adminRoleOptions[0];
        }
        return adminRoleOptions[0];
    });

    const handleNationalityChange = (option) => {
        setSelectedNationality(option);
    };

    const handleAdminRoleChange = (option) => {
        setSelectedAdminRole(option);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = Object.fromEntries(new FormData(form));
        if (formData.level) formData.level = Number(formData.level);
        console.log(`[UserForm] Submitting ${roleLabel}:`, JSON.stringify(formData, null, 2));
        if (onSubmit) onSubmit(formData);
    };

    return (
        <BaseFormComponent
            isOpen={isOpen}
            title={`${isEdit ? "Edit" : "Create New"} ${roleLabel}`}
            description={isEdit ? `Update the details below to edit this ${roleLabel.toLowerCase()}.` : `Fill in the details below to add a new ${roleLabel.toLowerCase()} to the system.`}
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText={isEdit ? `Edit ${roleLabel}` : `Create ${roleLabel}`}
        >
            <div className="space-y-6 mb-6">
                <div className="grid grid-cols-2 gap-6">
                    <InputItem label="Full Name" type="text" id="fullName" name="fullName" placeholder="Enter full name" defaultValue={initialData.fullName || ""} required />

                    {role !== "student" && role !== "admin" && (
                        <InputItem label={`${roleLabel} ID`} type="text" id={roleIdField} name={roleIdField} placeholder={`Enter ${roleLabel.toLowerCase()} ID`} defaultValue={initialData[roleIdField] || ""} required />
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <InputItem label="National ID" type="text" id="nationalId" name="nationalId" placeholder="Enter national ID" defaultValue={initialData.nationalId || ""} required />

                    {role === "admin" ? (
                        <SelectBox
                            className="w-full"
                            label="Role"
                            name="role"
                            labelDirection="flex-col"
                            options={adminRoleOptions}
                            selectedOption={selectedAdminRole}
                            onChange={handleAdminRoleChange}
                        />
                    ) : (
                        <SelectBox
                            className="w-full"
                            label="Nationality"
                            name="nationality"
                            labelDirection="flex-col"
                            options={nationalities}
                            selectedOption={selectedNationality}
                            onChange={handleNationalityChange}
                        />
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <InputItem label="Email Address" type="email" id="email" name="email" placeholder="Enter email address" defaultValue={initialData.email || ""} required />

                    <InputItem label="Phone Number" type="tel" id="phoneNumber" name="phoneNumber" placeholder="Enter phone number" defaultValue={initialData.phoneNumber || initialData.phone || ""} required />
                </div>

                {children}

                <div>
                    <label htmlFor="address">Address</label>
                    <TextArea
                        id="address"
                        name="address"
                        className="mt-1 block w-full px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark rounded-md focus:outline-none"
                        placeholder="Enter address"
                        defaultValue={initialData.address || ""}
                        required
                    />
                </div>
            </div>
        </BaseFormComponent>
    );
}
