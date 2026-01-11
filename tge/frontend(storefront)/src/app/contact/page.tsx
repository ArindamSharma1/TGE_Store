"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                        Have a question regarding your order, sizing, or a general inquiry?
                        We're here to help.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                    {/* Left: Contact Info */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900">
                                Contact Information
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-zinc-100">
                                        <Mail className="w-6 h-6 text-zinc-900" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">Email Us</p>
                                        <p className="text-zinc-500">storetge@gmail.com</p>
                                        <p className="text-xs text-zinc-400 mt-1">Response within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-zinc-100">
                                        <Clock className="w-6 h-6 text-zinc-900" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">Opening Hours</p>
                                        <p className="text-zinc-500">Mon - Fri: 10am - 5pm IST</p>
                                        <p className="text-zinc-500">Sunday: Closed</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-zinc-100">
                                        <MapPin className="w-6 h-6 text-zinc-900" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">HQ</p>
                                        <p className="text-zinc-500">Chintpurni, Una</p>
                                        <p className="text-zinc-500">Himachal Pradesh, India 177110</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-zinc-900 rounded-3xl text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold uppercase mb-2">FAQ</h3>
                                <p className="text-zinc-400 mb-6">
                                    Check our Frequently Asked Questions for quick answers about shipping, returns, and sizing.
                                </p>
                                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-zinc-900 rounded-full">
                                    <a href="/faq">Visit FAQ</a>
                                </Button>
                            </div>
                            {/* Abstract circle decoration */}
                            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
                        </div>
                    </div>

                    {/* Right: Form */}
                    <GlassCard className="p-8 md:p-10 bg-white border-zinc-200 shadow-xl rounded-3xl">
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-900 uppercase">First Name</label>
                                    <Input placeholder="Jane" className="bg-zinc-50 border-zinc-100" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-900 uppercase">Last Name</label>
                                    <Input placeholder="Doe" className="bg-zinc-50 border-zinc-100" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-900 uppercase">Email</label>
                                <Input type="email" placeholder="jane@example.com" className="bg-zinc-50 border-zinc-100" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-900 uppercase">Order Number (Optional)</label>
                                <Input placeholder="#TGE-12345" className="bg-zinc-50 border-zinc-100" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-900 uppercase">Message</label>
                                <textarea
                                    className="w-full min-h-[150px] rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm text-charcoal-black placeholder:text-disabled-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-charcoal-black resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <Button className="w-full h-14 rounded-full text-base font-bold bg-zinc-900 hover:bg-zinc-800 text-white">
                                Send Message
                            </Button>
                        </form>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
