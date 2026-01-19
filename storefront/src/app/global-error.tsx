"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 text-zinc-900">
                <h2 className="text-4xl font-black uppercase mb-4">Something went wrong!</h2>
                <p className="text-zinc-500 mb-8">We apologize for the inconvenience.</p>
                <Button onClick={() => reset()} className="rounded-full">
                    Try again
                </Button>
            </body>
        </html>
    );
}
