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

// We create a client instance. 
// Note: In a SPA, this module is evaluated once. 
// If the token changes (login/logout), we might need to recreate this or reload the page.
// We will force a page reload on Login/Logout to ensure this is clean.
const token = getAuthToken();

export const medusaClient = new Medusa({
    baseUrl: BACKEND_URL,
    debug: process.env.NODE_ENV === "development",
    publishableKey: PUBLISHABLE_KEY,
    customHeaders: token ? { Authorization: `Bearer ${token}` } : undefined
});
