import { whoAmI } from "../authApi";

export async function GetInfo() {
    return whoAmI();
}