import { json, redirect } from "react-router-dom";
import { login } from "../../api/authService";

export default async function authAction({ request }) {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const data = await login(email, password);
        const roles = (data.roles || []).map(r => r.toLowerCase());

        if (roles.some(r => r.startsWith('student'))) {
            return redirect('/');
        } else if (roles.some(r => r === 'instructor')) {
            return redirect('/instructor');
        } else if (roles.some(r => r.startsWith('admin') || r === 'superadmin')) {
            return redirect('/admin');
        }
        return json({ message: "Unknown role" }, { status: 403 });
    } catch (err) {
        return json({ message: "Invalid email or password" }, { status: 401 });
    }
}
