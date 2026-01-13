import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Config
        const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
        // Force the valid key confirmed by user admin screenshot
        const PUBLISHABLE_KEY = "pk_92932433455c59ad80b7c71deeab97d0c9cfc0cf7b97a1a1d1e9013d9b4ae94f";

        // 2. Strict Headers (Allowlist Only)
        // We explicitly construct the headers object to ensure NO Authorization header leaks
        const medusaHeaders = {
            "Content-Type": "application/json",
            "x-publishable-api-key": PUBLISHABLE_KEY,
        };

        // 3. Log for verification (Server-side logs)
        console.log("Register Proxy: [POST]", `${BACKEND_URL}/auth/customer/emailpass/register`);
        console.log("Register Proxy: Headers", JSON.stringify(medusaHeaders, null, 2));

        // 4. Execute Fetch
        // V2 Auth: Use the auth endpoint which handles identity creation
        const res = await fetch(`${BACKEND_URL}/auth/customer/emailpass/register`, {
            method: "POST",
            headers: medusaHeaders,
            body: JSON.stringify(body),
            cache: "no-store", // Ensure no caching
        });

        // 5. Handle Response
        const data = await res.json();

        if (!res.ok) {
            console.error("Register Proxy: Medusa Failure", res.status, JSON.stringify(data));
            return NextResponse.json(
                { message: data.message || "Registration denied by backend" },
                { status: res.status }
            );
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Register Proxy: Internal Error", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
