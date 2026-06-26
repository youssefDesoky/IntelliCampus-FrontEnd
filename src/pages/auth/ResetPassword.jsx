import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import InputItem from "../../components/form/InputItem";
import Button from "../../components/ui/Button";
import { useToast } from "../../contexts/ToastContext.jsx";
import { resetPassword } from "../../api/auth";

export default function ResetPassword() {
    const { showToast } = useToast();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }
        const newErrors = {};
        if (!newPassword.trim() || newPassword.length < 6)
            newErrors.newPassword = "Password must be at least 6 characters";
        if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        if (Object.keys(newErrors).length > 0) {
            setError(Object.values(newErrors).join(". "));
            return;
        }
        setError("");
        setSubmitting(true);
        try {
            await resetPassword({ token, newPassword, confirmPassword });
            setDone(true);
            showToast({ type: "success", title: "Password Reset", message: "You can now login with your new password." });
        } catch (err) {
            setError(err?.detail || err?.message || "Reset failed. The link may have expired.");
        } finally {
            setSubmitting(false);
        }
    };

    if (done) {
        return (
            <AuthLayout title="Password Reset" subtitle="Your password has been reset" bgImageName="FullLibNoPeople">
                <div className="text-center space-y-4">
                    <p className="text-green-700 dark:text-green-300">Password reset successful!</p>
                    <Link to="/login" className="text-blue-500 hover:text-blue-600 text-md block">
                        Go to Login
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Reset Password" subtitle="Set a new password for your account" bgImageName="FullLibNoPeople">
            <form onSubmit={handleSubmit} className="space-y-5 mb-12">
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</div>
                )}
                <InputItem
                    label="New Password"
                    type="password"
                    name="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <InputItem
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button type="submit" width="w-full" disabled={submitting} loading={submitting}>
                    Reset Password
                </Button>
            </form>

            <div className="text-center space-y-2">
                <Link to="/login" className="text-blue-500 hover:text-blue-600 text-md block">
                    Back to Login
                </Link>
            </div>
        </AuthLayout>
    );
}
