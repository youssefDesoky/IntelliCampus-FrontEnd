import { useState, useEffect, useMemo } from "react";
import Button from "../../../components/ui/Button";
import TextArea from "../../../components/ui/TextArea";
import { PlusIcon, FilePenIcon } from "../../../components/ui/icons";
import InputItem from "../../../components/form/InputItem";
import Select from 'react-select'; // react-select for better country list
import countryList from 'react-select-country-list';
import { EXCLUDED_COUNTRIES } from "../utils/validation";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";

const adminRoleOptions = [
    { value: 'Post Grad Affairs Admin', label: 'Post Grad Affairs Admin' },
    { value: 'Under Grad Affairs Admin', label: 'Under Grad Affairs Admin' },
];

export default function UserForm({ role, method = "post", onClose, onSubmit, initialData = {}, children, isOpen = true }) {
    const roleLabel = role === "admin" ? "Admin" : role === "student" ? "Student" : "Instructor";
    const isEdit = method === "put";
    const roleIdField = `${role}Id`;

    const options = useMemo(() => countryList().getData().filter(c => !EXCLUDED_COUNTRIES.includes(c.value)), []);

    const [selectedNationality, setSelectedNationality] = useState(() => {
        const initialNationality = initialData.nationality;
        if (initialNationality) {
            const match = options.find(n => n.value === initialNationality || n.label === initialNationality);
            return match || options[0];
        }
        return options[0];
    });

    useEffect(() => {
        const initialNationality = initialData.nationality;
        if (initialNationality) {
            const match = options.find(n => n.value === initialNationality || n.label === initialNationality);
            if (match) setSelectedNationality(match);
        } else if (options.length > 0) {
            setSelectedNationality(options[0]);
        }
    }, [initialData.nationality, options]);

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
        // Add selected nationality to formData
        if (selectedNationality) {
            formData.nationality = selectedNationality.value;
        }
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputItem label="Full Name" type="text" id="fullName" name="fullName" placeholder="Enter full name" defaultValue={initialData.fullName || ""} required />

                    {role !== "student" && role !== "admin" && (
                        <InputItem label={`${roleLabel} ID`} type="text" id={roleIdField} name={roleIdField} placeholder={`Enter ${roleLabel.toLowerCase()} ID`} defaultValue={initialData[roleIdField] || ""} required />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputItem label="National ID" type="text" id="nationalId" name="nationalId" placeholder="Enter national ID" defaultValue={initialData.nationalId || ""} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {role === "admin" ? (
                        <div className="flex flex-col w-full">
                            <label className="block font-semibold text-sm text-text-primary-active-light dark:text-text-primary-active-dark mb-1" htmlFor="role">
                                Role
                            </label>
                            <Select
                                id="role"
                                name="role"
                                options={adminRoleOptions}
                                value={selectedAdminRole}
                                onChange={handleAdminRoleChange}
                                classNamePrefix="react-select"
                                placeholder="Select role"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full">
                            <label className="block font-semibold text-sm text-text-primary-active-light dark:text-text-primary-active-dark mb-1" htmlFor="nationality">
                                Nationality
                            </label>
                            <Select
                                id="nationality"
                                name="nationality"
                                options={options}
                                value={selectedNationality}
                                onChange={handleNationalityChange}
                                classNamePrefix="react-select"
                                placeholder="Select nationality"
                            />
                        </div>
                    )}

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
