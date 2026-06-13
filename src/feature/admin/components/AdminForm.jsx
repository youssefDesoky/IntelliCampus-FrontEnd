import { useState, useRef } from "react";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import SelectBox from "../../../components/ui/SelectBox";
import InputItem from "../../../components/form/InputItem";
import { UserIcon, CameraIcon } from "../../../components/ui/icons";

const adminRoleOptions = [
    { value: "Post Grad Affairs Admin", label: "Post Grad Affairs Admin" },
    { value: "Under Grad Affairs Admin", label: "Under Grad Affairs Admin" },
];

export default function AdminForm({ onClose, method = "post", onSubmit, initialData = {} }) {
    const isEdit = method === "put";
    const fileInputRef = useRef(null);

    const [photoPreview, setPhotoPreview] = useState(initialData.profileImage || null);
    const [photoFile, setPhotoFile] = useState(null);

    const [selectedRole, setSelectedRole] = useState(() => {
        if (initialData.role) {
            return adminRoleOptions.find(o => o.value === initialData.role) || adminRoleOptions[0];
        }
        return adminRoleOptions[0];
    });

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
            title={isEdit ? "Edit Admin" : "Create New Admin"}
            description={isEdit ? "Update the details below to edit this admin." : "Fill in the details below to add a new admin to the system."}
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText={isEdit ? "Save Changes" : "Create Admin"}
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

                    {/* Employment Info */}
                    <div className="pt-5">
                        <div className="flex items-center gap-3 mb-3">
                            <hr className="flex-1 border-border-primary-default-light dark:border-border-primary-default-dark" />
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary-default-light dark:text-text-secondary-default-dark whitespace-nowrap">Employment</h4>
                            <hr className="flex-1 border-border-primary-default-light dark:border-border-primary-default-dark" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <SelectBox
                                className="w-full"
                                label="Role"
                                name="role"
                                labelDirection="flex-col"
                                options={adminRoleOptions}
                                selectedOption={selectedRole}
                                onChange={setSelectedRole}
                            />
                            <InputItem label="Hire Date" type="date" name="hireDate" defaultValue={(initialData.hireDate || new Date().toISOString()).split("T")[0]} required />
                        </div>
                    </div>
                </div>
            </div>
        </BaseFormComponent>
    );
}
