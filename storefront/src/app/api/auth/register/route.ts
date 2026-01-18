import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PK = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export async function POST(req: Request) {
    if (!PK) return NextResponse.json({ ok: false, message: "Missing publishable key" }, { status: 500 });

    const body = await req.json();

    // Use the store endpoint to create the customer inside store scope
    const createRes = await fetch(`${BASE}/store/customers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": PK
        },
        body: JSON.stringify(body)
    });

    const createJson = await createRes.json();

    if (!createRes.ok) {
        return NextResponse.json(createJson, { status: createRes.status });
    }

    // Return success. Important: do NOT attempt to set cookie server-side here.
    // After client receives 200, client must perform client-side login to create connect.sid cookie.
    return NextResponse.json({ ok: true, result: createJson }, { status: 200 });
}
