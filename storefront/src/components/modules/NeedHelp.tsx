"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MessageCircle, PackageOpen, HelpCircle } from "lucide-react";

export function NeedHelp() {
    return (
        <section className="py-24 border-t border-zinc-100 bg-white">
            <div className="mx-auto max-w-[1400px] px-4">
                <div className="bg-zinc-900 rounded-[24px] p-8 md:p-20 overflow-hidden relative">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                        <div className="flex flex-col items-start">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6" data-animate="text">
                                Here to Help
                            </h2>
                            <p className="text-zinc-400 text-lg font-medium max-w-md leading-relaxed mb-10">
                                Questions about fit? Need to check your order status? Our support team is ready to assist you.
                            </p>
                            <div className="flex flex-wrap items-center gap-6">
                                <Button asChild href="/contact" variant="outline" size="lg" className="h-12 px-8 rounded-full border-white/20 text-white hover:bg-white hover:text-zinc-900 font-bold text-sm uppercase tracking-wide" data-animate="button">
                                    <span>Contact Us</span>
                                </Button>
                                <Button asChild href="/orders" variant="link" className="text-white hover:text-white/80 font-bold text-sm uppercase tracking-wide p-0 h-auto decoration-white/30 underline-offset-4 decoration-1" data-animate="button">
                                    <span>Track Order</span>
                                </Button>
                            </div>
                        </div>

                        {/* Feature List Right Side */}
                        <div className="flex flex-col gap-8">
                            <Link href="/faq" className="group flex gap-6 items-start border-b border-white/10 pb-8 hover:border-white/30 transition-colors">
                                <HelpCircle className="w-6 h-6 text-white/50 group-hover:text-white transition-colors mt-1" />
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-2">FAQ</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed max-w-sm group-hover:text-zinc-300 transition-colors">
                                        Quick answers to common questions about shipping, sizing, and product care.
                                    </p>
                                </div>
                            </Link>
                            <Link href="/returns" className="group flex gap-6 items-start border-b border-white/10 pb-8 hover:border-white/30 transition-colors">
                                <PackageOpen className="w-6 h-6 text-white/50 group-hover:text-white transition-colors mt-1" />
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-2">Returns</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed max-w-sm group-hover:text-zinc-300 transition-colors">
                                        Hassle-free 30-day return policy on all eligible items. We make it easy.
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
