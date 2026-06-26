import { useState } from "react";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import InputItem from "../../../components/form/InputItem";
import { API_URL } from "../../../config/api";
import { useError } from "../../../contexts/ErrorContext.jsx";

export default function ChangeRetrievalMailForm({ isOpen, onClose }) {
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
        const currentPassword = formData.get("currentPassword") || "";
        const newEmail = formData.get("newEmail") || "";
        const confirmEmail = formData.get("confirmEmail") || "";

        const newErrors = {};
        if (!currentPassword.trim()) newErrors.currentPassword = "Current password is required.";
        if (!newEmail.trim()) {
            newErrors.newEmail = "New email is required.";
        } else if (!/\S+@\S+\.\S+/.test(newEmail)) {
            newErrors.newEmail = "Please enter a valid email address.";
        }
        if (!confirmEmail.trim()) {
            newErrors.confirmEmail = "Please confirm your new email.";
        } else if (newEmail && confirmEmail !== newEmail) {
            newErrors.confirmEmail = "Emails do not match.";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/change-recovery-email`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword,
                    newEmail,
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                const message = body?.detail || body?.message || body?.title || `Failed to change recovery email (${res.status})`;
                throw new Error(message);
            }

            handleClose();
        } catch (err) {
            showError(err?.message || "Failed to change recovery email.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <BaseFormComponent
            isOpen={isOpen}
            title="Change Retrieval Mail"
            description="Enter your current password and a new recovery email address."
            onClose={handleClose}
            onSubmit={handleSubmit}
            submitText="Change Email"
            submitDisabled={submitting}
            submitLoading={submitting}
            maxWidth="max-w-md"
        >
            <div className="space-y-5">
                <InputItem
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    placeholder="Enter current password"
                    errorMessage={errors.currentPassword}
                />
                <InputItem
                    label="New Recovery Email"
                    type="email"
                    name="newEmail"
                    placeholder="Enter new email"
                    errorMessage={errors.newEmail}
                />
                <InputItem
                    label="Confirm New Email"
                    type="email"
                    name="confirmEmail"
                    placeholder="Re-enter new email"
                    errorMessage={errors.confirmEmail}
                />
            </div>
        </BaseFormComponent>
    );
}
