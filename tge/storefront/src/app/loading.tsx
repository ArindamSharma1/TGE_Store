import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex w-full h-screen items-center justify-center bg-zinc-50">
            <div className="flex flex-col items-center gap-4">
                {/* Simple TGE Logo */}
                <div className="flex items-center gap-2 animate-pulse">
                    <span className="font-black text-4xl tracking-tighter">TGE</span>
                </div>
                <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            </div>
        </div>
    );
}
