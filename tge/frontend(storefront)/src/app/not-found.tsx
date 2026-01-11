import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-zinc-50">
            <h1 className="text-[150px] md:text-[200px] font-black leading-none text-zinc-200 select-none">
                404
            </h1>
            <div className="-mt-12 md:-mt-16 relative z-10 space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-zinc-900">
                    Page Not Found
                </h2>
                <p className="text-zinc-500 max-w-md mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Button asChild size="lg" className="rounded-full px-8">
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        </div>
    );
}
