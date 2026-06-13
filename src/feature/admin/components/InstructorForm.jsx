import { useState, useRef } from "react";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import SelectBox from "../../../components/ui/SelectBox";
import RadioToggle from "../../../components/form/RadioToggle";
import InputItem from "../../../components/form/InputItem";
import { UserIcon, CameraIcon } from "../../../components/ui/icons";

const departments = [
    { value: "CS", label: "Computer Science" },
    { value: "IS", label: "Information Systems" },
    { value: "IT", label: "Information Technology" },
    { value: "AI", label: "Artificial Intelligence" },
];

const employmentStatuses = [
    { value: "Permanent", label: "Permanent" },
    { value: "On Loan", label: "On Loan" },
];

const nationalities = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "au", label: "Australia" },
    { value: "in", label: "India" },
];

export default function InstructorForm({ onClose, method = "post", onSubmit, initialData = {} }) {
    const isEdit = method === "put";
    const fileInputRef = useRef(null);

    const [photoPreview, setPhotoPreview] = useState(initialData.profileImage || null);
    const [photoFile, setPhotoFile] = useState(null);

    const [selectedNationality, setSelectedNationality] = useState(() => {
        if (initialData.nationality) {
            return nationalities.find(n => n.value === initialData.nationality || n.label === initialData.nationality) || nationalities[0];
        }
        return nationalities[0];
    });

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

    const isProfessor = selectedRole === "Professor";

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        setPhotoFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRoleChange = (val) => {
        setSelectedRole(val);
    };

    const handleEmploymentStatusChange = (val) => {
        const status = employmentStatuses.find(e => e.value === val);
        setSelectedEmploymentStatus(status || employmentStatuses[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = Object.fromEntries(new FormData(form));
        formData.profileImage = photoPreview;
        onSubmit?.(formData);
    };

    return (
        <BaseFormComponent
            isOpen={true}
            title={isEdit ? "Edit Instructor" : "Create New Instructor"}
            description={isEdit ? "Update the details below to edit this instructor." : "Fill in the details below to add a new instructor to the system."}
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText={isEdit ? "Save Changes" : "Create Instructor"}
        >
            <div className="flex gap-6 items-start">
                {/* Left: Photo */}
                <div className="flex flex-col items-center shrink-0">
                    <div className="relative">
                        <div
                            onClick={handlePhotoClick}
                            className="w-32 h-36 rounded-xl overflow-hidden cursor-pointer ring-2 ring-border-primary-default-light dark:ring-border-primary-default-dark hover:ring-border-accent-active-light dark:hover:ring-border-accent-active-dark transition-all group"
                        >
                            {photoPreview ? (
                                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                                    <UserIcon className="w-10 h-10 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                <CameraIcon className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        {photoPreview && (
                            <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark flex items-center justify-center shadow-sm hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M18.3 5.71 12 12.01l-6.29-6.3-1.42 1.42 6.3 6.29-6.3 6.29 1.42 1.42 6.29-6.3 6.29 6.3 1.42-1.42-6.3-6.29 6.3-6.29z"/></svg>
                            </button>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                    />
                    <p className="mt-2 text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark text-center">
                        Click to {photoPreview ? "change" : "upload"}<br />profile photo
                    </p>
                </div>

                {/* Right: Fields */}
                <div className="flex-1 min-w-0 space-y-5">
                    {/* Personal Info */}
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <hr className="flex-1 border-border-primary-default-light dark:border-border-primary-default-dark" />
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark whitespace-nowrap">Personal Information</h4>
                            <hr className="flex-1 border-border-primary-default-light dark:border-border-primary-default-dark" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputItem label="Full Name" type="text" name="fullName" placeholder="Enter full name" defaultValue={initialData.fullName || ""} required />
                            <InputItem label="National ID" type="text" name="nationalId" placeholder="Enter national ID" defaultValue={initialData.nationalId || ""} required />
                            <InputItem label="Email Address" type="email" name="email" placeholder="Enter email address" defaultValue={initialData.email || ""} required />
                            <InputItem label="Phone Number" type="tel" name="phoneNumber" placeholder="Enter phone number" defaultValue={initialData.phoneNumber || initialData.phone || ""} required />
                            <div className="col-span-2">
                                <SelectBox
                                    className="w-full"
                                    label="Nationality"
                                    name="nationality"
                                    labelDirection="flex-col"
                                    options={nationalities}
                                    selectedOption={selectedNationality}
                                    onChange={setSelectedNationality}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block mb-2 text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Address</label>
                                <textarea
                                    name="address"
                                    rows={2}
                                    placeholder="Enter address"
                                    defaultValue={initialData.address || ""}
                                    className="w-full px-4 py-2.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark focus:ring-2 focus:ring-border-accent-active-light dark:focus:ring-border-accent-active-dark focus:border-border-accent-active-light outline-none transition-all placeholder:text-text-secondary-default-light dark:placeholder:text-text-secondary-default-dark resize-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="pt-5">
                        <div className="flex items-center gap-3 mb-3">
                            <hr className="flex-1 border-border-primary-default-light dark:border-border-primary-default-dark" />
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark whitespace-nowrap">Professional Information</h4>
                            <hr className="flex-1 border-border-primary-default-light dark:border-border-primary-default-dark" />
                        </div>
                        {isProfessor ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="block mb-2 text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Role</label>
                                    <RadioToggle
                                        name="role"
                                        options={[
                                            { value: "Professor", label: "Professor" },
                                            { value: "Technical Assistant", label: "Technical Assistant" },
                                        ]}
                                        value={selectedRole}
                                        onChange={handleRoleChange}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block mb-2 text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Professor Status</label>
                                    <RadioToggle
                                        name="employmentStatus"
                                        options={employmentStatuses}
                                        value={selectedEmploymentStatus.value}
                                        onChange={handleEmploymentStatusChange}
                                    />
                                </div>
                                <SelectBox
                                    className="w-full"
                                    label="Department"
                                    name="departmentId"
                                    labelDirection="flex-col"
                                    options={departments}
                                    selectedOption={selectedDepartment}
                                    onChange={setSelectedDepartment}
                                />
                                <InputItem label="Hire Date" type="date" name="hireDate" defaultValue={(initialData.hireDate || new Date().toISOString()).split("T")[0]} required />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="block mb-2 text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Role</label>
                                    <RadioToggle
                                        name="role"
                                        options={[
                                            { value: "Professor", label: "Professor" },
                                            { value: "Technical Assistant", label: "Technical Assistant" },
                                        ]}
                                        value={selectedRole}
                                        onChange={handleRoleChange}
                                    />
                                </div>
                                <SelectBox
                                    className="w-full"
                                    label="Department"
                                    name="departmentId"
                                    labelDirection="flex-col"
                                    options={departments}
                                    selectedOption={selectedDepartment}
                                    onChange={setSelectedDepartment}
                                />
                                <InputItem label="Hire Date" type="date" name="hireDate" defaultValue={(initialData.hireDate || new Date().toISOString()).split("T")[0]} className="col-span-2" required />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BaseFormComponent>
    );
}
