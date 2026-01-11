"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { MessageCircle, PackageOpen, HelpCircle } from "lucide-react";

export function NeedHelp() {
    return (
        <section className="py-24 border-t border-zinc-100 bg-white">
            <div className="mx-auto max-w-7xl px-4">
                <Reveal width="100%">
                    <div className="bg-zinc-900 rounded-[40px] p-8 md:p-16 overflow-hidden relative">
                        {/* Decorative Circle */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-zinc-800 rounded-full blur-3xl opacity-50 pointer-events-none" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">
                                    Here to Help
                                </h2>
                                <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-md leading-relaxed mb-8">
                                    Questions about fit? Need to check your order status? Our support team is ready to assist you.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Button asChild href="/contact" size="lg" className="h-14 px-8 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 font-bold text-base">
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="w-5 h-5" />
                                            <span>Contact Us</span>
                                        </div>
                                    </Button>
                                    <Button asChild href="/orders" variant="outline" size="lg" className="h-14 px-8 rounded-full border-zinc-700 text-white hover:bg-zinc-800 hover:text-white font-bold text-base bg-transparent">
                                        <div className="flex items-center gap-2">
                                            <PackageOpen className="w-5 h-5" />
                                            <span>Track Order</span>
                                        </div>
                                    </Button>
                                </div>
                            </div>

                            {/* Feature Grid Right Side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Link href="/faq" className="block cursor-pointer">
                                    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors h-full">
                                        <HelpCircle className="w-8 h-8 text-white mb-4" strokeWidth={1.5} />
                                        <h3 className="text-white font-bold mb-2">FAQ</h3>
                                        <p className="text-zinc-400 text-sm">Quick answers to common questions about shipping and sizing.</p>
                                    </div>
                                </Link>
                                <Link href="/returns" className="block cursor-pointer">
                                    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors h-full">
                                        <PackageOpen className="w-8 h-8 text-white mb-4" strokeWidth={1.5} />
                                        <h3 className="text-white font-bold mb-2">Returns</h3>
                                        <p className="text-zinc-400 text-sm">Hassle-free 30-day return policy on all eligible items.</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
