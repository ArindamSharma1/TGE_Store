import Medusa from "@medusajs/js-sdk";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_dummy";

export const getMedusaServer = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("medusa_jwt")?.value;

    return new Medusa({
        baseUrl: BACKEND_URL,
        debug: process.env.NODE_ENV === "development",
        publishableKey: PUBLISHABLE_KEY,
        globalHeaders: token ? { Authorization: `Bearer ${token}` } : undefined
    });
};
