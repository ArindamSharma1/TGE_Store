"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function Newsletter() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setEmail("");
            toast.success("Subscribed successfully!", {
                description: "You've been added to our newsletter."
            });
        }, 1000);
    };

    return (
        <section className="mx-auto max-w-[1400px] px-4 py-32 border-t border-zinc-100">
            <div className="max-w-xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-zinc-100 border border-zinc-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-900">Intel & Updates</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900 mb-6" data-animate="text">
                    Join the Inner Circle
                </h2>

                <p className="text-zinc-500 text-lg mb-12 leading-relaxed max-w-sm mx-auto font-medium">
                    Secure access to new drops, archive sales, and design notes. No spam. Pure signal.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 max-w-sm mx-auto group w-full">
                    <div className="relative w-full">
                        <input
                            id="newsletter-email"
                            name="email"
                            type="email"
                            placeholder="ENTER YOUR EMAIL"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-14 bg-zinc-50 border border-zinc-200 rounded-xl text-center placeholder:text-zinc-400 text-zinc-900 font-bold uppercase tracking-wider focus:border-zinc-900 focus:bg-white focus:outline-none transition-all duration-300"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold uppercase tracking-widest transition-transform hover:scale-[1.02]"
                        data-animate="button"
                    >
                        {loading ? "AUTHENTICATING..." : "INITIATE SEQUENCE"}
                    </Button>
                </form>

                <p className="text-zinc-400 text-[10px] uppercase tracking-wider mt-8 font-medium">
                    By joining, you acknowledge our data policies.
                </p>
            </div>
        </section>
    );
}
