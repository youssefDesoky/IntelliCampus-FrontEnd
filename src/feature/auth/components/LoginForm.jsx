import InputGroup from "../../../ui/Input";

export default function LoginForm() {
    return (
        <form className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col items-center mb-6">
                <div className="w-18 h-18 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-9 h-9 text-blue-500">
                        <path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9l0 28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5l0-24.6c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"/>
                    </svg>
                </div>
                <h1 className="text-2xl font-semibold text-gray-800">Sign In</h1>
                <p className="text-xs text-gray-500 mt-1">Welcome back to IntelliCampus</p>
            </div>

            <div className="space-y-4">
                <InputGroup
                    label="Email"
                    inputId="email"
                    inputType="email"
                    name="email"
                    placeholder="Enter your email"
                />

                <InputGroup
                    label="Password"
                    inputId="password"
                    inputType="password"
                    name="password"
                    placeholder="Enter your password"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                    Sign In
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-100" />
                    <div className="text-xs text-gray-400">Or continue with</div>
                    <div className="flex-1 h-px bg-gray-100" />
                </div>

                <button
                    type="button"
                    className="w-full border border-gray-200 rounded-lg py-2 flex items-center justify-center gap-2 text-sm hover:bg-gray-50 transition"
                >
                    <span className="text-red-500 font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="w-4 h-4">
                            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                        </svg>
                    </span>
                    <span>Sign in with Google</span>
                </button>
            </div>
        </form>
    );
}