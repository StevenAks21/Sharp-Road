import { apiFetch } from "../apiFetch";

export async function GetAll() {
    return apiFetch("/inventory/getall");
}