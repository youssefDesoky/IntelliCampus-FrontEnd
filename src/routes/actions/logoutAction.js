import { redirect } from "react-router-dom";
import { API_URL } from "../../config/api";

export default async function logoutAction() {
    try {
        const endpoint = localStorage.getItem('push_endpoint');
        if (endpoint) {
            await fetch(`${API_URL}/api/devices/unregister`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ endpoint }),
            });
        }
    } catch { /* ignore */ }
    localStorage.removeItem('push_endpoint');

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
