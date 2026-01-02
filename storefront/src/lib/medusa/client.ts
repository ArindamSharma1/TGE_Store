import Medusa from "@medusajs/js-sdk";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_dummy";

// Singleton instance might be stale if token changes without reload.
// However, the standard pattern in this project seems to be importing `medusaClient`.
// We can use a Proxy to intercept calls and inject headers, OR we can just rely on the hard reload we added in Login.

// BUT, to be safer and support SPA navigation (if we remove hard reload later), let's try to make the client dynamic.
// Since we can't easily change the export type without breaking all imports (which expect an instance),
// we will stick to the instance but maybe use a custom fetch? Medusa SDK doesn't expose that easily.

// So, we will keep the hard reload strategy in Login but update this file to be cleaner.
// Actually, `window.location.href` reload IS reliable.
// The failure was likely just the `access_token` variable name.

// I will just re-write this file to be clean and minimal.

const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("medusa_auth_token");
    }
    return null;
};

const token = getAuthToken();

export const medusaClient = new Medusa({
    baseUrl: BACKEND_URL,
    debug: process.env.NODE_ENV === "development",
    publishableKey: PUBLISHABLE_KEY,
    customHeaders: token ? { Authorization: `Bearer ${token}` } : undefined
});
