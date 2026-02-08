import { 
    Form, 
    Link,
    useActionData, 
    useNavigate, 
    useNavigation 
} from "react-router-dom";

import { useEffect, useState, useRef } from "react";

import AuthLayout from "../../layout/AuthLayout";

import Button from "../../components/ui/Button";
import InputItem from "../../components/form/InputItem";
import { LockIconLight , MailIconLight } from "../../components/ui/icons";

export default function LoginPage() {
    // const emailRef = useRef(null);
    // const passwordRef = useRef(null);

    // const [emptyFields, setEmptyFields] = useState([]);

    const data = useActionData();
    // const navigate = useNavigate();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    // useEffect(() => {
    //     if (!data) return;

    //     const userRole = data.role;

    //     localStorage.setItem("token", data.token);
    //     localStorage.setItem("user-role", userRole);

    //     if (userRole === "student") navigate("/");
    //     else if (userRole === "instructor") navigate("/instructor");
    //     else if (userRole === "admin") navigate("/admin");
    // }, [data, navigate]);

    // const handelOnSubmit = (event) => {
    //     event.preventDefault();

    //     setEmptyFields([]);

    //     if (!emailRef.current.value) {
    //         setEmptyFields((prev) => [...prev, "email"]);    
    //     }
    //     if (!passwordRef.current.value) {
    //         setEmptyFields((prev) => [...prev, "password"]);    
    //     }

    //     if (!emailRef.current.value || !passwordRef.current.value) return;
        
    //     // Let React Router handle the form submission naturally
    //     event.currentTarget.submit();
    // }

    return (
        <AuthLayout 
            title="Welcome Back" 
            subtitle="Sign in to access your academic dashboard" 
            fahimImgSrc="/images/fahimLogin.png"
        >
            <Form
                method="post"
                className="space-y-5 mb-12"
                // onSubmit={handelOnSubmit}
            >
                {data?.message && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">
                        {data.message}
                    </div>
                )}

                {/* {emptyFields.length > 0 && (
                    <ul className="bg-red-100 text-red-700 p-3 rounded-md text-sm list-disc list-inside space-y-1">
                        {emptyFields.includes("email") && <li>Email is required</li>}
                        {emptyFields.includes("password") && <li>Password is required</li>}
                    </ul>
                )} */}

                <InputItem
                    // ref={emailRef}
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="student@university.edu"
                >
                    <MailIconLight className="w-5 h-5 text-gray-400" />
                </InputItem>

                <InputItem
                    // ref={passwordRef}
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                >
                    <LockIconLight className="w-5 h-5 text-gray-400" />
                </InputItem>

                <Button 
                    type="submit" 
                    width="w-full"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                >
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