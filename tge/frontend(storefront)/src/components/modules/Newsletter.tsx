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
        <section className="mx-auto max-w-7xl px-4 py-20 border-t border-zinc-100">
            <Reveal width="100%">
                <div className="bg-zinc-900 rounded-[32px] p-8 md:p-16 text-center overflow-hidden relative">
                    {/* Background pattern */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                        </svg>
                    </div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-6 backdrop-blur-sm">
                            <Mail className="w-6 h-6 text-white" />
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
                            Join the Community
                        </h2>
                        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                            Get early access to new drops, exclusive offers, and weekly style edits directly to your inbox.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 bg-white/10 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-white/20 rounded-full px-6"
                            />
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-12 px-8 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 font-bold whitespace-nowrap"
                            >
                                {loading ? "Subscribing..." : "Subscribe"}
                            </Button>
                        </form>

                        <p className="text-zinc-600 text-xs mt-6">
                            By subscribing, you agree to our Terms and Privacy Policy.
                        </p>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
