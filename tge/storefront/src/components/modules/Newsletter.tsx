"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Reveal } from "@/components/ui/Reveal";
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
        <section className="mx-auto max-w-[1400px] px-4 py-32 border-t border-zinc-100/50">
            <Reveal width="100%">
                <div className="max-w-xl mx-auto text-center">

                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 mb-6">
                        Join the Community
                    </h2>

                    <p className="text-zinc-500 text-lg mb-12 leading-relaxed">
                        Get early access to new drops, exclusive offers, and weekly style edits directly to your inbox.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 max-w-sm mx-auto group">
                        <div className="relative w-full">
                            <input
                                id="newsletter-email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full h-12 bg-transparent border-b border-zinc-200 text-zinc-900 text-center placeholder:text-zinc-300 focus:border-zinc-900 focus:outline-none transition-colors duration-300"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            variant="ghost"
                            className="text-xs font-bold uppercase tracking-widest text-zinc-900 hover:bg-transparent hover:opacity-60 transition-opacity"
                        >
                            {loading ? "Joining..." : "Subscribe"}
                        </Button>
                    </form>

                    <p className="text-zinc-300 text-[10px] uppercase tracking-wider mt-12">
                        By subscribing, you agree to our Terms and Privacy Policy.
                    </p>
                </div>
            </Reveal>
        </section>
    );
}
