import { useState } from "react";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import InputItem from "../../../components/form/InputItem";
import TextArea from "../../../components/ui/TextArea";
import { useError } from "../../../contexts/ErrorContext.jsx";
import { updateProfile } from "../services/profileApi";

export default function EditProfileForm({ isOpen, onClose, user, onSaved }) {
    const { showError } = useError();
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const fullName = formData.get("fullName") || "";
        const phoneNumber = formData.get("phoneNumber") || "";
        const address = formData.get("address") || "";

        const egyptianPhoneRegex = /^01[0125]\d{8}$/;

        const newErrors = {};
        if (!fullName.trim()) newErrors.fullName = "English name is required.";
        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required.";
        } else if (!egyptianPhoneRegex.test(phoneNumber.trim())) {
            newErrors.phoneNumber = "Enter a valid Egyptian phone number (e.g. 010XXXXXXXX).";
        }
        if (!address.trim()) newErrors.address = "Address is required.";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setSubmitting(true);
        try {
            await updateProfile({
                fullName: fullName.trim() || null,
                phoneNumber: phoneNumber.trim() || null,
                address: address.trim() || null,
            });

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
