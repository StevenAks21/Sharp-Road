import { apiFetch } from "./apiFetch";

export async function whoAmI() {
    const data = await apiFetch("/auth/whoami");
    return data.user;
}