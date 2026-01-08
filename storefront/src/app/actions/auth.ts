"use server";

import { medusaClient } from "@/lib/medusa/client";
import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, error: "Missing credentials" };
    }

    try {
        // Medusa V2 SDK uses .login() and returns { access_token } directly or as a string depending on config
        const response: any = await medusaClient.auth.login("customer", "emailpass", {
            email,
            password,
        });

        const access_token = response?.access_token || (typeof response === 'string' ? response : null);

        if (access_token) {
            (await cookies()).set("medusa_jwt", access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
            });
            // Fetch customer details to return
            const { customer } = await medusaClient.store.customer.retrieve(
                {},
                { Authorization: `Bearer ${access_token}` }
            );
            return { success: true, customer, access_token };
        } else {
            console.error("Login Error: No access_token found in response", response);
            return { success: false, error: "Authentication failed. Server received invalid token." };
        }
    } catch (error: any) {
        console.error("Login Server Action Failed:", {
            message: error?.message,
            response: error?.response?.data
        });
        return { success: false, error: error?.response?.data?.message || "Login failed" };
    }
}

export async function registerAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    if (!email || !password || !firstName) {
        return { success: false, error: "Missing fields" };
    }

    try {
        // Debug: Check if PK is available
        const pk = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
        console.log("Register Action - PK Check:", pk ? `Present (${pk.substring(0, 4)}...)` : "Missing");

        // Instantiate a fresh client for this server action to ensure env vars are fresh
        const Medusa = require("@medusajs/js-sdk").default;
        const client = new Medusa({
            baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
            publishableKey: pk || "pk_dummy",
            debug: true
        });

        // 1. Register via Auth Module (Medusa V2)
        // Endpoint: POST /auth/customer/emailpass/register
        // This creates an identity AND triggers customer creation via workflows.

        console.log("Registering via /auth/customer/emailpass/register...");

        const registerResponse: any = await client.fetch("/auth/customer/emailpass/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                email,
                password,
                // Pass profile info in data/user_metadata if supported, or update later.
                // Standard emailpass register body is { email, password }.
                // But we often want to set first/last name. 
                // In many V2 setups, you must update the customer AFTER registration or pass it in 'user_metadata' if configured.
                // Let's try passing basic info.
            }
        });

        // If register succeeds, it usually returns an auth token or just success.
        // Let's check if we get a token directly.
        let access_token = registerResponse?.access_token || (typeof registerResponse === 'string' ? registerResponse : null);

        // If no token, standard Login to get it
        if (!access_token) {
            const loginResponse: any = await client.auth.login("customer", "emailpass", {
                email,
                password,
            });
            access_token = loginResponse?.access_token || (typeof loginResponse === 'string' ? loginResponse : null);
        }

        if (access_token) {
            (await cookies()).set("medusa_jwt", access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
            });

            // 2. Update Customer Profile (Name)
            // Now that we have a token, we can update the customer profile.
            // The customer is created by the auth flow (linked).
            try {
                await client.store.customer.update({
                    first_name: firstName,
                    last_name: lastName || "",
                }, { Authorization: `Bearer ${access_token}` });
            } catch (updateError) {
                console.warn("Failed to update customer name after registration:", updateError);
                // Non-critical, proceed.
            }

            // Fetch customer to return full object
            const { customer } = await client.store.customer.retrieve(
                {},
                { Authorization: `Bearer ${access_token}` }
            );

            return { success: true, customer, access_token };
        }
        return { success: false, error: "Registration successful but auto-login failed" };

    } catch (error: any) {
        console.error("Registration Server Action Failed:", {
            message: error?.message,
            response: error?.response?.data,
            stack: error?.stack
        });

        // Improve error message readability
        let msg = error?.response?.data?.message || error?.message || "Registration failed";
        if (msg.includes("Identity with email")) msg = "Email already exists.";

        return { success: false, error: msg };
    }
}

export async function logoutAction() {
    (await cookies()).delete("medusa_jwt");
    return { success: true };
}
