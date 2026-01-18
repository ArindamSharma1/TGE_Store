const BASE = (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000").replace(/\/+$/, '');
const PK = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export async function medusaFetch(path: string, options: RequestInit = {}) {
    const url = path.startsWith("http") ? path : `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;

    const headers = new Headers(options.headers);

    // Standard Medusa Headers
    headers.set("Content-Type", "application/json");
    if (PK) headers.set("x-publishable-api-key", PK);

    // STRICT: Remove Authorization if present (we use cookies)
    if (headers.has("Authorization")) headers.delete("Authorization");
    if (headers.has("authorization")) headers.delete("authorization");

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include", // The most important part for Sessions
    });

    return response;
}

export default medusaFetch;
