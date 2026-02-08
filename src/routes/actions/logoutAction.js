import { redirect } from "react-router-dom";
import { API_URL } from "../../config/api";

export default async function logoutAction() {
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
