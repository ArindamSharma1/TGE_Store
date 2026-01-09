"use server";

import { medusaClient } from "@/lib/medusa/client";
import { cookies } from "next/headers";

export async function registerAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, error: "Missing fields" };
    }

    try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
        const envPK = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
        // Fallback to hardcoded key from .env.local if process.env misses it
        const pk = envPK || "pk_92932433455c59ad80b7c71deeab97d0c9cfc0cf7b97a1a1d1e9013d9b4ae94f";

        console.log("Registering via /auth/customer/emailpass/register...");

        const fetchResponse = await fetch(`${backendUrl}/auth/customer/emailpass/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key": pk
            },
            body: JSON.stringify({
                email,
                password,
            })
        });

        const registerResponse = await fetchResponse.json();

        if (!fetchResponse.ok) {
            console.error("Fetch Registration Failed:", registerResponse);
            throw new Error(registerResponse.message || "Registration endpoint failed");
        }

        return { success: true };

    } catch (error: any) {
        console.error("Registration Server Action Failed:", {
            message: error?.message,
            stack: error?.stack
        });

        let msg = error?.message || "Registration failed";
        return { success: false, error: msg };
    }
}

export async function logoutAction() {
    (await cookies()).delete("medusa_jwt");
    return { success: true };
}
