import { redirect } from "react-router-dom";
import { logout, unregisterDevice } from "../../api/authService";

export default async function logoutAction() {
    try {
        const endpoint = localStorage.getItem('push_endpoint');
        if (endpoint) {
            await unregisterDevice(endpoint).catch(() => {});
        }
    } catch { /* ignore */ }
    localStorage.removeItem('push_endpoint');

    try {
        await logout();
    } catch {
        // ignore network errors on logout
    }

    return redirect("/login");
}
