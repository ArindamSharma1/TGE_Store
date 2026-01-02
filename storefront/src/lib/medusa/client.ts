import Medusa from "@medusajs/js-sdk";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_dummy";

// Helper to get token safely
const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("medusa_auth_token");
    }
    return null;
};

// Singleton Default (for non-authenticated or initial load)
export const medusaClient = new Medusa({
    baseUrl: BACKEND_URL,
    debug: process.env.NODE_ENV === "development",
    publishableKey: PUBLISHABLE_KEY,
    customHeaders: getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : undefined
});

// Dynamic Client factory
// Use this when you absolutely need to ensure the latest token is used (e.g., after login or in protected routes)
export const getMedusa = () => {
    const token = getAuthToken();
    return new Medusa({
        baseUrl: BACKEND_URL,
        debug: process.env.NODE_ENV === "development",
        publishableKey: PUBLISHABLE_KEY,
        customHeaders: token ? { Authorization: `Bearer ${token}` } : undefined
    });
};
