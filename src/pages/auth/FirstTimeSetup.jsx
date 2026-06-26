import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import InputItem from "../../components/form/InputItem";
import Button from "../../components/ui/Button";
import { useToast } from "../../contexts/ToastContext.jsx";
import { sendVerificationCode, firstTimeSetup } from "../../api/auth";

export default function FirstTimeSetup() {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1 = enter email, 2 = verify + new password
    const [recoveryEmail, setRecoveryEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [codeSent, setCodeSent] = useState(false);

    const handleSendCode = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!recoveryEmail.trim() || !/\S+@\S+\.\S+/.test(recoveryEmail))
            newErrors.recoveryEmail = "Valid recovery email is required";
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setSubmitting(true);
        try {
            await sendVerificationCode({ recoveryEmail });
            setCodeSent(true);
            setStep(2);
            showToast({ type: "success", title: "Code Sent", message: "Check your email for the verification code." });
        } catch (err) {
            setErrors({ form: err?.detail || err?.message || "Failed to send code." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSetup = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!verificationCode.trim()) newErrors.verificationCode = "Verification code is required";
        if (!newPassword.trim()) newErrors.newPassword = "New password is required";
        else if (newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";
        if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setSubmitting(true);
        try {
            await firstTimeSetup({
                recoveryEmail,
                verificationCode,
                newPassword,
                confirmPassword,
            });
            showToast({ type: "success", title: "Setup Complete", message: "Your account is ready. Redirecting..." });
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            setErrors({ form: err?.detail || err?.message || "Setup failed." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title={step === 1 ? "First-Time Setup" : "Verify & Set Password"}
            subtitle={
                step === 1
                    ? "Set up a recovery email to start"
                    : "Enter the code sent to your email and set a new password"
            }
            bgImageName="FullLibNoPeople"
        >
            {step === 1 && (
                <form onSubmit={handleSendCode} className="space-y-5 mb-12">
                    {errors.form && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">{errors.form}</div>
                    )}
                    <InputItem
                        label="Recovery Email"
                        type="email"
                        name="recoveryEmail"
                        placeholder="your@personal-email.com"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        errorMessage={errors.recoveryEmail}
                    />
                    <Button type="submit" width="w-full" disabled={submitting} loading={submitting}>
                        Send Verification Code
                    </Button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleSetup} className="space-y-5 mb-12">
                    {errors.form && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">{errors.form}</div>
                    )}
                    <InputItem
                        label="Verification Code"
                        type="text"
                        name="verificationCode"
                        placeholder="6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        errorMessage={errors.verificationCode}
                    />
                    <InputItem
                        label="New Password"
                        type="password"
                        name="newPassword"
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        errorMessage={errors.newPassword}
                    />
                    <InputItem
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        errorMessage={errors.confirmPassword}
                    />
                    <Button type="submit" width="w-full" disabled={submitting} loading={submitting}>
                        Complete Setup
                    </Button>
                </form>
            )}
        </AuthLayout>
    );
}
