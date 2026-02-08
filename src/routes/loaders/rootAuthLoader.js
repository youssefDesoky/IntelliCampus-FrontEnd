import { redirect } from "react-router-dom";
import { API_URL } from "../../config/api";

export default async function rootAuthLoader() {
    try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
            credentials: "include",
        });

        if (res.status === 401) {
            throw redirect("/login");
        }

        return await res.json();
    } catch (err) {
        if (err instanceof Response) throw err; // re-throw redirects
        console.error("Root auth loader error:", err);
        throw redirect("/login");
    }
}
