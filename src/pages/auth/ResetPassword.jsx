import { Form } from "react-router-dom";

import AuthLayout from "../../layout/AuthLayout";

import InputItem from "../../components/form/InputItem";
import { LockIconLight } from "../../components/ui/icons";

export default function ChangePassword() {
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
                    name="password"
                    placeholder="Enter your new password"
                >
                    <LockIconLight className="w-5 h-5 text-gray-400" />
                </InputItem>

                <InputItem
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your new password"
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