import LoginForm from "../components/LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-500 to-blue-400 p-12">
                <div className="max-w-md text-center text-white">
                    <div className="mx-auto w-56 h-56 rounded-xl bg-white/10 flex items-center justify-center mb-8 shadow-lg">
                        <img src="/images/IntelliCampus.png" alt="Welcome" className="w-40 h-40 object-contain" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-3">Welcome to IntelliCampus</h2>
                    <p className="text-sm opacity-90">
                        Your intelligent campus companion for seamless academic excellence
                    </p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}