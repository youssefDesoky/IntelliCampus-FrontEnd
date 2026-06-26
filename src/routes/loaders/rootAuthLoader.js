import { redirect } from "react-router-dom";
import { verifyAuth } from "../../api/authService";

export default async function rootAuthLoader() {
    try {
        return await verifyAuth();
    } catch (err) {
        if (err instanceof Response) throw err;
        throw redirect("/login");
    }
}
