"use server";

import { cookies } from "next/headers";
import Medusa from "@medusajs/js-sdk";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_92932433455c59ad80b7c71deeab97d0c9cfc0cf7b97a1a1d1e9013d9b4ae94f";

// Helper to instantiate SDK to get around singleton issues in server environment if needed
const getMedusaClient = () => {
    return new Medusa({
        baseUrl: BACKEND_URL,
        publishableKey: PUBLISHABLE_KEY,
        debug: process.env.NODE_ENV === "development",
    });
};

async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set("medusa_jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

export async function loginAction(_prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, error: "Email and password are required" };
    }

    try {
        const medusa = getMedusaClient();
        console.log("Attempting login via SDK...");
        const loginRes = await medusa.auth.login("customer", "emailpass", {
            email,
            password
        });
        console.log("Login SDK Response:", JSON.stringify(loginRes, null, 2));

        // @ts-ignore - The SDK types might be incomplete or strict
        const token = loginRes.token || loginRes.access_token;

        if (token) {
            await setAuthCookie(token);
            return { success: true };
        } else {
            console.error("Login succeeded but no token found in response:", loginRes);
            return { success: false, error: "Authentication failed. No token received." };
        }
    } catch (error: any) {
        console.error("Login Action Error:", error);
        return {
            success: false,
            error: error?.message || "Invalid credentials"
        };
    }
}

export async function registerAction(_prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password || !name) {
        return { success: false, error: "All fields are required" };
    }

    if (password.length < 8) {
        return { success: false, error: "Password must be at least 8 characters" };
    }

    try {
        const medusa = getMedusaClient();

        console.log("Attempting registration via SDK...");
        // 1. Register
        await medusa.auth.register("customer", "emailpass", {
            email,
            password,
        });

        console.log("Registration successful. Attempting login...");
        // 2. Login immediately to get token
        const loginRes = await medusa.auth.login("customer", "emailpass", {
            email,
            password
        });
        console.log("Registration Follow-up Login Response:", JSON.stringify(loginRes, null, 2));

        // @ts-ignore
        const token = loginRes.token || loginRes.access_token;

        if (!token) {
            console.error("Account created but login failed. Response:", loginRes);
            return { success: false, error: "Account created but login failed." };
        }

        await setAuthCookie(token);

        // 3. Update Profile (Name)
        // We need to use the token for the update call. 
        // The SDK instance doesn't persist the token automatically in this scope unless we set it?
        // Actually, we can pass custom headers or Authorization: Bearer token?
        // Medusa SDK v2 usually handles auth via headers if we set the token on the client?
        // Or we can just use the token in the headers for a manual update fetch or look for `customHeaders` option.
        // Wait, for `medusa.store.customer.update`, we usually need the token.
        // Let's create a new client or use fetch with the token for the update to be safe, 
        // OR try setting custom headers on the existing client if possible.
        // The simplest reliable way for server actions is to pass the token in headers manually for the update.

        // However, `medusa-js-sdk` allows setting global custom headers?
        // Let's rely on a manual fetch for the update to be 100% sure we use the token we just got.

        try {
            await fetch(`${BACKEND_URL}/store/customers/me`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-publishable-api-key": PUBLISHABLE_KEY,
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    first_name: name.split(" ")[0],
                    last_name: name.split(" ").slice(1).join(" ") || "",
                }),
            });
        } catch (e) {
            console.warn("Profile update failed during registration", e);
        }

        return { success: true };

    } catch (error: any) {
        console.error("Register Error:", error);
        if (error?.message?.includes("already exists") || error?.status === 422) {
            return { success: false, error: "An account with this email already exists. Please sign in instead." };
        }
        return { success: false, error: error?.message || "Registration failed" };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("medusa_jwt");
    return { success: true };
}

// getCustomerAction removed - use client-side fetch instead
