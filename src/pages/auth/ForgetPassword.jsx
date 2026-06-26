import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import InputItem from "../../components/form/InputItem";
import Button from "../../components/ui/Button";
import Turnstile from "../../components/ui/Turnstile";
import { forgotPassword } from "../../api/auth";

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState(null);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError("Email is required");
            return;
        }
        setError("");
        setSubmitting(true);
        try {
            await forgotPassword({ email, turnstileToken });
            setSent(true);
        } catch (err) {
            setError(err?.detail || err?.message || "Request failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Forgot Password"
            subtitle="Enter your account email to reset your password"
            bgImageName="FrontLibNoPepole"
        >
            {sent ? (
                <div className="space-y-6 text-center">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6">
                        <p className="text-green-700 dark:text-green-300">
                            If the email exists, a reset link has been sent to your recovery email.
                        </p>
                    </div>
                    <Link to="/login" className="text-blue-500 hover:text-blue-600 text-md block">
                        Back to Login
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5 mb-12">
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</div>
                    )}
                    <InputItem
                        label="Account Email"
                        type="email"
                        name="email"
                        placeholder="student@intellicampus.online"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    >
                    </InputItem>
                    <div className="flex justify-center">
                        <Turnstile onVerify={setTurnstileToken} />
                    </div>
                    <Button type="submit" width="w-full" disabled={submitting} loading={submitting}>
                        Send Reset Link
                    </Button>
                </form>
            )}

            <div className="text-center space-y-2">
                <Link to="/login" className="text-blue-500 hover:text-blue-600 text-md block">
                    Remembered your password? Login
                </Link>
                <Link to="/get-credentials" className="text-gray-500 hover:text-gray-600 text-sm block">
                    Don't know your email? Get Credentials
                </Link>
            </div>
        </AuthLayout>
    );
}
