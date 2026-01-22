import { whoAmI } from "../authApi";

export async function FetchName() {
    return whoAmI();
}