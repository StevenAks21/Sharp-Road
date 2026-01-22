import { apiFetch } from "../apiFetch";

export async function GetAll() {
    const data = await apiFetch("/employees/getall");
    return data.result;
}