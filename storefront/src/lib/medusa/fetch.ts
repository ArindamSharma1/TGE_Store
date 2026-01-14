const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = "pk_fe5c9a3efe63600ecd8e5442857f33d665324907e9ed7e60449d5647d1a0e5df";

export async function medusaFetch(path: string, options: RequestInit = {}) {
    const url = path.startsWith("http") ? path : `${BACKEND_URL}${path}`;

    const headers = new Headers(options.headers);

    if (PUBLISHABLE_KEY) {
        headers.set("x-publishable-api-key", PUBLISHABLE_KEY);
    }

    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    // STRICT: Never allow Authorization header to leak from client
    headers.delete("Authorization");

    // DEBUG: Trace strictly what is being sent
    console.log("[MedusaFetch] URL:", url);
    console.log("[MedusaFetch] Key:", PUBLISHABLE_KEY);
    console.log("[MedusaFetch] Headers:", Object.fromEntries(headers.entries()));

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include", // CRITICAL: Ensures connect.sid cookie is sent/received
        cache: options.cache || "no-store", // Default to no-store
    });

    return response;
}
