import { redirect } from "react-router-dom";
import { API_URL } from "../../config/api";

export default async function logoutAction() {
    try {
        const token = localStorage.getItem('fcm_token');
        if (token) {
            await fetch(`${API_URL}/api/devices/unregister`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ token }),
            });
        }
    } catch { /* ignore */ }
    localStorage.removeItem('fcm_token');

    try {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
    } catch {
        // ignore network errors on logout
    }

    return redirect("/login");
}
