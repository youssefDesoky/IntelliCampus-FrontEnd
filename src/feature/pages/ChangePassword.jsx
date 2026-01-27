import { LockIconLight } from "../../ui/icons";
import { Form } from "react-router-dom";
import InputItem from "../../ui/InputItem";
import { useState } from "react";
import AuthLayout from "../auth/components/AuthLayout";

export default function ChangePassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <AuthLayout
            title="Change Password" 
            subtitle="Set a new password for your account" 
            fahimImgSrc="/images/fahimLogin.png"
        >
            <Form className="space-y-5 mb-12">
                <InputItem
                    label="New Password"
                    type="password"
                    name="newPassword"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                >
                    <LockIconLight className="w-5 h-5 text-gray-400" />
                </InputItem>

                <InputItem
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                >
                    <LockIconLight className="w-5 h-5 text-gray-400" />
                </InputItem>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                    Change Password
                </button>
            </Form>
        </AuthLayout>
    );
}