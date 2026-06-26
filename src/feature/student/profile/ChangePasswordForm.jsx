import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import InputItem from "../../../components/form/InputItem";
import { useError } from "../../../contexts/ErrorContext.jsx";
import { changePassword } from "../services/profileApi";

export default function ChangePasswordForm({ isOpen, onClose }) {
    const navigate = useNavigate();
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
        const oldPassword = formData.get("oldPassword") || "";
        const newPassword = formData.get("newPassword") || "";
        const confirmPassword = formData.get("confirmPassword") || "";

        const newErrors = {};
        if (!oldPassword.trim()) newErrors.oldPassword = "Current password is required.";
        if (!newPassword.trim()) {
            newErrors.newPassword = "New password is required.";
        } else if (newPassword.length < 6) {
            newErrors.newPassword = "Password must be at least 6 characters.";
        }
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your new password.";
        } else if (newPassword && confirmPassword !== newPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setSubmitting(true);
        try {
            await changePassword(oldPassword, newPassword);
            handleClose();
            navigate("/login");
        } catch (err) {
            showError(err?.message || "Failed to change password.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <BaseFormComponent
            isOpen={isOpen}
            title="Change Password"
            description="Enter your current password and choose a new one."
            onClose={handleClose}
            onSubmit={handleSubmit}
            submitText="Change Password"
            submitDisabled={submitting}
            submitLoading={submitting}
            maxWidth="max-w-md"
        >
            <div className="space-y-5">
                <InputItem
                    label="Current Password"
                    type="password"
                    name="oldPassword"
                    placeholder="Enter current password"
                    errorMessage={errors.oldPassword}
                />
                <InputItem
                    label="New Password"
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    errorMessage={errors.newPassword}
                />
                <InputItem
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter new password"
                    errorMessage={errors.confirmPassword}
                />
            </div>
        </BaseFormComponent>
    );
}
