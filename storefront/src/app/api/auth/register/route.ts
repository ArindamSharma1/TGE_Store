import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Use the backend URL strictly (no public var if possible, but fallback is fine)
        const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
        // We can use the publishable key here or a private token if needed, but publishable is standard for store endpoints
        // Actually, store/customers usually requires a publishable key.
        const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_92932433455c59ad80b7c71deeab97d0c9cfc0cf7b97a1a1d1e9013d9b4ae94f";

        const res = await fetch(`${BACKEND_URL}/store/customers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key": PUBLISHABLE_KEY,
            },
            body: JSON.stringify(body),
            // We usually don't need credentials for registration unless setting a session immediately, 
            // but the user's snippet included it. Medusa creates the customer but session creation is separate (login).
            // However, we will follow the user's snippet style where possible, but 'credentials: include' 
            // from server-to-server fetch means sending THIS server's cookies, which is irrelevant.
            // I will omit credentials for the proxy call as it's a fresh request.
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { message: data.message || "Registration failed" },
                { status: res.status }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Registration Proxy Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
