import { json, redirect } from "react-router-dom";
import { API_URL } from "../../config/api";

export default async function authAction({ request }) {
    const formData = await request.formData();
    const authData = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',  // Add this to send/receive cookies
        body: JSON.stringify(authData),
    });

    if (response.ok) {
        const data = await response.json();
        const roles = (data.roles || []).map(r => r.toLowerCase());
        // Redirect based on role
        if (roles.some(r => r.startsWith('student'))) {
            return redirect('/');
        } else if (roles.some(r => r === 'instructor')) {
            return redirect('/instructor');
        } else if (roles.some(r => r.startsWith('admin') || r === 'superadmin')) {
            return redirect('/admin');
        }
        return json({ message: "Unknown role" }, { status: 403 });
    } else {
        return json({ message: "Invalid email or password" }, { status: 401 });
    }
}