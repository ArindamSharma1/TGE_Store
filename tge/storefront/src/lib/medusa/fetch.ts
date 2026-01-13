const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
// Hardcoded valid key as per audit
const PUBLISHABLE_KEY = "pk_92932433455c59ad80b7c71deeab97d0c9cfc0cf7b97a1a1d1e9013d9b4ae94f";

type MedusaFetchOptions = RequestInit & {
    fullUrl?: boolean; // If true, don't prepend BACKEND_URL
};

export async function medusaFetch(path: string, options: MedusaFetchOptions = {}) {
    const url = options.fullUrl ? path : `${BACKEND_URL}${path}`;

    const headers = new Headers(options.headers);
    headers.set("x-publishable-api-key", PUBLISHABLE_KEY);

    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    // STRICT: Never allow Authorization header to leak from client
    headers.delete("Authorization");

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include", // CRITICAL: Ensures connect.sid cookie is sent/received
        cache: options.cache || "no-store", // Default to no-store for dynamic data
    });

    return response;
}
