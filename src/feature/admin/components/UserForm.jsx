import { Form } from "react-router-dom";
import { useState } from "react";
import Button from "../../../components/ui/Button";
import { PlusIcon, FilePenIcon, XIcon } from "../../../components/ui/icons";
import InputItem from "../../../components/form/InputItem";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import SelectBox from "../../../components/ui/SelectBox";

const nationalities = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'in', label: 'India' },
];

export default function UserForm({ role, method = "post", action, onClose, initialData = {}, children }) {
    const roleLabel = role === "admin" ? "Admin" : role === "student" ? "Student" : "Instructor";
    const isEdit = method === "put";
    const roleIdField = `${role}ID`;

    const [selectedNationality, setSelectedNationality] = useState(() => {
        if (initialData.nationality) {
            return nationalities.find(n => n.value === initialData.nationality || n.label === initialData.nationality) || nationalities[0];
        }
        return nationalities[0];
    });

    const handleNationalityChange = (option) => {
        setSelectedNationality(option);
    };

    return (
        <ModelOverlay onClose={onClose}>
            <Form className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark w-full p-6 rounded-lg shadow-md" method={method} action={action}>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1 mb-6">
                        <h2 className="text-2xl font-semibold">{isEdit ? "Edit" : "Create New"} {roleLabel}</h2>
                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            {isEdit 
                                ? `Update the details below to edit this ${roleLabel.toLowerCase()}.` 
                                : `Fill in the details below to add a new ${roleLabel.toLowerCase()} to the system.`
                            }
                        </p>
                    </div>

                    <button type="button" onClick={onClose} className="p-2 place-self-start rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 hover:text-gray-800">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6 mb-6">
                    <div className="grid grid-cols-2 gap-6">
                        <InputItem label="Full Name" type="text" id="fullName" name="fullName" placeholder="Enter full name" defaultValue={initialData.fullName || ""} required />

                        <InputItem label={`${roleLabel} ID`} type="text" id={roleIdField} name={roleIdField} placeholder={`Enter ${roleLabel.toLowerCase()} ID`} defaultValue={initialData[roleIdField] || ""} required />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <InputItem label="National ID" type="text" id="nationalID" name="nationalID" placeholder="Enter national ID" defaultValue={initialData.nationalID || ""} required />

                        <SelectBox
                            className="w-full"
                            label="Nationality"
                            labelDirection="flex-col"
                            options={nationalities}
                            selectedOption={selectedNationality}
                            onChange={handleNationalityChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <InputItem label="Email Address" type="email" id="email" name="email" placeholder="Enter email address" defaultValue={initialData.email || ""} required />

                        <InputItem label="Phone Number" type="tel" id="phone" name="phone" placeholder="Enter phone number" defaultValue={initialData.phone || ""} required />
                    </div>

                    {children}

                    <div>
                        <label htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            rows="4"
                            className="mt-1 block w-full px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark focus:border-border-primary-active-light dark:focus:border-border-primary-active-dark rounded-md focus:outline-none"
                            placeholder="Enter address"
                            defaultValue={initialData.address || ""}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Button 
                        variant="secondary"
                        type="reset"
                    >
                        Reset Form
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                    >
                        {isEdit 
                            ? <><FilePenIcon className="w-5 h-5" /> Edit {roleLabel}</>
                            : <><PlusIcon className="w-6 h-6" /> Create {roleLabel}</>
                        }
                    </Button>
                </div>
            </Form>
        </ModelOverlay>
    );
}
