import { useState } from "react";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import InputItem from "../../../components/form/InputItem";
import Button from "../../../components/ui/Button";
import { API_URL } from "../../../config/api";
import { useError } from "../../../contexts/ErrorContext.jsx";
import { useToast } from "../../../contexts/ToastContext.jsx";

export default function ChangeRetrievalMailForm({ isOpen, onClose }) {
    const { showError } = useError();
    const { showToast } = useToast();
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [newEmail, setNewEmail] = useState("");

    const handleClose = () => {
        setErrors({});
        setCodeSent(false);
        setNewEmail("");
        onClose();
    };

    const validateEmailFields = (currentPassword, newEmail, confirmEmail) => {
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
        return newErrors;
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        const formData = new FormData(form);
        const currentPassword = formData.get("currentPassword") || "";
        const confirmEmail = formData.get("confirmEmail") || "";

        const newErrors = validateEmailFields(currentPassword, newEmail, confirmEmail);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setSendingCode(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/change-recovery-email/send-code`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newEmail }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                const message = body?.detail || body?.message || body?.title || `Failed to send code (${res.status})`;
                throw new Error(message);
            }

            setCodeSent(true);
            setErrors({});
            showToast({ type: "success", title: "Code Sent", message: "Check your new email for the 6-digit code." });
        } catch (err) {
            showError(err?.message || "Failed to send verification code.");
        } finally {
            setSendingCode(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const currentPassword = formData.get("currentPassword") || "";
        const confirmEmail = formData.get("confirmEmail") || "";
        const verificationCode = (formData.get("verificationCode") || "").trim();

        let newErrors = validateEmailFields(currentPassword, newEmail, confirmEmail);
        if (!codeSent) {
            newErrors.form = "Please send a verification code to your new email first.";
        }
        if (codeSent && !verificationCode) {
            newErrors.verificationCode = "Verification code is required.";
        } else if (verificationCode && !/^\d{6}$/.test(verificationCode)) {
            newErrors.verificationCode = "Enter the 6-digit code.";
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
                    verificationCode,
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                const message = body?.detail || body?.message || body?.title || `Failed to change recovery email (${res.status})`;
                throw new Error(message);
            }

            showToast({ type: "success", title: "Email Updated", message: "Your recovery email has been changed." });
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
            description="Verify your new recovery email with a 6-digit code sent to it."
            onClose={handleClose}
            onSubmit={handleSubmit}
            submitText="Change Email"
            submitDisabled={submitting || !codeSent}
            submitLoading={submitting}
            maxWidth="max-w-md"
        >
            <div className="space-y-5">
                {errors.form && (
                    <div className="rounded-lg bg-red-50 dark:bg-red-950/40 px-3 py-2 text-xs font-semibold text-red-700 dark:text-red-300">
                        {errors.form}
                    </div>
                )}
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
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    errorMessage={errors.newEmail}
                />
                <InputItem
                    label="Confirm New Email"
                    type="email"
                    name="confirmEmail"
                    placeholder="Re-enter new email"
                    errorMessage={errors.confirmEmail}
                />

                <div className="flex flex-col gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        width="w-full"
                        disabled={sendingCode}
                        loading={sendingCode}
                        onClick={handleSendCode}
                    >
                        {codeSent ? "Resend Verification Code" : "Send Verification Code"}
                    </Button>
                    {codeSent && (
                        <p className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                            A 6-digit code was sent to <strong>{newEmail || "your new email"}</strong>.
                        </p>
                    )}
                </div>

                <InputItem
                    label="Verification Code"
                    type="text"
                    name="verificationCode"
                    placeholder="6-digit code"
                    maxLength={6}
                    errorMessage={errors.verificationCode}
                />
            </div>
        </BaseFormComponent>
    );
}