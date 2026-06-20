import { Form } from "react-router-dom";

import AuthLayout from "../../layout/AuthLayout";

import InputItem from "../../components/form/InputItem";
import { LockIconLight } from "../../components/ui/icons";
import Button from "../../components/ui/Button";

export default function ChangePassword() {
    return (
        <AuthLayout
            title="Reset Password" 
            subtitle="Set a new password for your account" 
            bgImageName="FullLibNoPeople"
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

                <Button 
                    type="submit" 
                    width="w-full"
                >
                    Reset Password
                </Button>
            </Form>
        </AuthLayout>
    );
}