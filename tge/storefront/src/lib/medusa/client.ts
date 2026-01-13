import Medusa from "@medusajs/js-sdk";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_92932433455c59ad80b7c71deeab97d0c9cfc0cf7b97a1a1d1e9013d9b4ae94f";

// Singleton Default (Still used for public endpoints like products)
export const medusaClient = new Medusa({
    baseUrl: BACKEND_URL,
    debug: process.env.NODE_ENV === "development",
    publishableKey: PUBLISHABLE_KEY,
});

// Dynamic Client factory - Deprecated for Auth/Profile calls due to Cookie/Credentials limitation
export const getMedusa = () => {
    return new Medusa({
        baseUrl: BACKEND_URL,
        debug: process.env.NODE_ENV === "development",
        publishableKey: PUBLISHABLE_KEY,
    });
};

// Native Fetch Helper for Authenticated Customer Calls
// This bypasses the SDK's inability to set credentials: 'include' easily
// DEPRECATED: We are reverting to standard SDK usage
/*
export const fetchCustomer = async () => {
    const res = await fetch(`${BACKEND_URL}/store/customers/me`, {
        headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": PUBLISHABLE_KEY,
        },
        credentials: "include", // Sends the httpOnly cookie
    });
    if (!res.ok) return null;
    return await res.json();
};

export const updateCustomer = async (data: any) => {
    const res = await fetch(`${BACKEND_URL}/store/customers/me`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": PUBLISHABLE_KEY,
        },
        body: JSON.stringify(data),
        credentials: "include", // Sends the httpOnly cookie
    });
    if (!res.ok) throw new Error("Failed to update customer");
    return await res.json();
};
*/
