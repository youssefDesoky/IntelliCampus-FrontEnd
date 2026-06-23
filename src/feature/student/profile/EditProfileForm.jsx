import { useRef, useState } from "react";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import InputItem from "../../../components/form/InputItem";
import TextArea from "../../../components/ui/TextArea";
import { API_URL } from "../../../config/api";
import { useError } from "../../../contexts/ErrorContext.jsx";
import { UserIcon, CameraIcon } from "../../../components/ui/icons";

export default function EditProfileForm({ isOpen, onClose, user, onSaved }) {
    const { showError } = useError();
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(user?.avatar || null);

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const fullName = formData.get("fullName") || "";
        const phoneNumber = formData.get("phoneNumber") || "";
        const address = formData.get("address") || "";

        const newErrors = {};
        if (!fullName.trim()) newErrors.fullName = "English name is required.";
        if (!address.trim()) newErrors.address = "Address is required.";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/profile`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: fullName.trim() || null,
                    phoneNumber: phoneNumber.trim() || null,
                    address: address.trim() || null,
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                const message = body?.detail || body?.message || body?.title || `Failed to update profile (${res.status})`;
                throw new Error(message);
            }

            if (photoPreview !== (user?.avatar || null)) {
                const imgRes = await fetch(`${API_URL}/api/auth/profile/image`, {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(photoPreview || ""),
                });

                if (!imgRes.ok) {
                    const imgBody = await imgRes.json().catch(() => null);
                    const imgMessage = imgBody?.detail || imgBody?.message || "Failed to update profile image";
                    showError(imgMessage);
                }
            }

            onSaved?.();
            handleClose();
        } catch (err) {
            showError(err?.message || "Failed to update profile.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <BaseFormComponent
            isOpen={isOpen}
            title="Edit Profile"
            description="Update your personal details below."
            onClose={handleClose}
            onSubmit={handleSubmit}
            submitText="Save Changes"
            submitDisabled={submitting}
            submitLoading={submitting}
            maxWidth="max-w-md"
        >
            <div className="space-y-5">
                <div className="flex flex-col items-center shrink-0">
                    <div className="relative">
                        <div
                            onClick={handlePhotoClick}
                            className="w-24 h-24 rounded-xl overflow-hidden ring-2 ring-border-primary-default-light dark:ring-border-primary-default-dark hover:ring-border-accent-active-light dark:hover:ring-border-accent-active-dark transition-all group"
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
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M18.3 5.71 12 12.01l-6.29-6.3-1.42 1.42 6.3 6.29-6.3 6.29 1.42 1.42 6.29-6.3 6.29 6.3 1.42-1.42-6.3-6.29 6.3-6.29z" /></svg>
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

                <InputItem
                    label="Full Name (English)"
                    type="text"
                    name="fullName"
                    placeholder="Enter English name"
                    defaultValue={user?.name || user?.fullName || ""}
                    errorMessage={errors.fullName}
                />
                <InputItem
                    label="Phone Number"
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    defaultValue={user?.phone || user?.phoneNumber || ""}
                    errorMessage={errors.phoneNumber}
                />
                <div>
                    <label htmlFor="address" className="block mb-2 font-bold text-sm text-text-primary-default-light dark:text-text-primary-default-dark">Address</label>
                    <TextArea
                        name="address"
                        placeholder="Enter address"
                        defaultValue={user?.address || ""}
                        className="w-full px-4 py-2.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark focus:ring-2 focus:ring-border-accent-active-light dark:focus:ring-border-accent-active-dark focus:border-border-accent-active-light outline-none transition-all placeholder:text-text-secondary-default-light dark:placeholder:text-text-secondary-default-dark"
                    />
                    {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                </div>
            </div>
        </BaseFormComponent>
    );
}
