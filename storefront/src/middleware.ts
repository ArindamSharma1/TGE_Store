import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const isAccount = req.nextUrl.pathname.startsWith("/account");

    if (!isAccount) return NextResponse.next();

    // "connect.sid" is the default session cookie name for many Express/Medusa setups.
    // We check for its existence as a soft guard.
    const hasSession = req.cookies.get("connect.sid");

    if (!hasSession) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/account/:path*"],
};
