import {useState} from "react";
import { Form, Link } from "react-router-dom";
import InputItem from "../../ui/InputItem";
import Button from "../../ui/Button";
import { LockIconLight , MailIconLight } from "../../ui/icons";
import AuthLayout from "../auth/components/AuthLayout";

export default function LoginPage() {
    const [password, setPassword] = useState("");

    return (
        <AuthLayout 
            title="Welcome Back" 
            subtitle="Sign in to access your academic dashboard" 
            fahimImgSrc="/images/fahimLogin.png"
        >
            <Form className="space-y-5 mb-12">
                <InputItem
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="student@university.edu"
                    required
                >
                    <MailIconLight className="w-5 h-5 text-gray-400" />
                </InputItem>

                <InputItem
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => {setPassword(event.target.value)}}
                    required
                >
                    <LockIconLight className="w-5 h-5 text-gray-400" />
                </InputItem>

                <Button type="submit">
                    Login
                </Button>
            </Form>

            <div className="text-center space-y-2">
                <Link to="/forgot-password" className="text-blue-500 hover:text-blue-600 text-md block">
                    Forgot password?
                </Link>
                <p className="text-gray-400 text-sm">Accounts are created by administration</p>
            </div>
        </AuthLayout>
    );
}