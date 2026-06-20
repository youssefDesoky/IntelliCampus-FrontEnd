import { Form, Link } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import InputItem from "../../components/form/InputItem";
import { MailIconLight } from "../../components/ui/icons";
import Button from "../../components/ui/Button";

export default function ForgetPassword() {
    return (
        <AuthLayout
            title="Forgot Password" 
            subtitle="Enter your email to reset your password" 
            bgImageName="FrontLibNoPepole"
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

                <Button 
                    type="submit" 
                    width="w-full"
                >
                    Send Reset Link
                </Button>
            </Form>

            <div className="text-center space-y-2">
                <Link to="/login" className="text-blue-500 hover:text-blue-600 text-md block">
                    Remembered your password? Login
                </Link>
            </div>
        </AuthLayout>
    );
}
