"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { ArrowRight, Package, RefreshCw, Truck, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ReturnsPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleReturnSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            toast.success("Return initiated successfully");
        }, 1500);
    };
    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 mb-4">
                        Shipping & Returns
                    </h1>
                    <p className="text-zinc-500 text-lg">
                        Everything you need to know about delivery and our guarantee.
                    </p>
                </div>

                {/* Highlights Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-20">
                    <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Truck className="w-6 h-6 text-zinc-900" />
                        </div>
                        <h3 className="font-bold text-zinc-900 uppercase mb-2">Free Shipping</h3>
                        <p className="text-sm text-zinc-500">On all orders over ₹999</p>
                    </div>
                    <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <RefreshCw className="w-6 h-6 text-zinc-900" />
                        </div>
                        <h3 className="font-bold text-zinc-900 uppercase mb-2">30-Day Returns</h3>
                        <p className="text-sm text-zinc-500">No questions asked return policy</p>
                    </div>
                    <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Package className="w-6 h-6 text-zinc-900" />
                        </div>
                        <h3 className="font-bold text-zinc-900 uppercase mb-2">Secure Packing</h3>
                        <p className="text-sm text-zinc-500">Eco-friendly & damage proof</p>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-16">
                    {/* Shipping Policy */}
                    <section>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900 mb-6 border-b border-zinc-100 pb-4">
                            Shipping Policy
                        </h2>
                        <div className="prose prose-zinc max-w-none text-zinc-600">
                            <p className="mb-4">
                                We aim to process all orders within 1-2 business days. Once shipped, you will receive an email with your tracking information.
                            </p>
                            <h4 className="font-bold text-zinc-900 mt-6 mb-2">Domestic Shipping (India)</h4>
                            <p className="mb-4">
                                Standard delivery takes 5-7 business days. Express shipping is available at checkout for delivery within 1-2 business days in major metros.
                            </p>
                            <h4 className="font-bold text-zinc-900 mt-6 mb-2">International Shipping</h4>
                            <p>
                                {/* We ship appropriately to over 15 countries. International delivery times vary between 7-14 business days depending on customs clearance. Duties and taxes are calculated at checkout. */}
                                Right now we only ship all over India but we are working on adding International shipping options for our International customers.
                            </p>
                        </div>
                    </section>

                    {/* Return Policy */}
                    <section>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900 mb-6 border-b border-zinc-100 pb-4">
                            Returns & Exchanges
                        </h2>
                        <div className="prose prose-zinc max-w-none text-zinc-600">
                            <p className="mb-4">
                                We want you to be completely satisfied with your purchase. If for any reason you are not, we accept returns within 30 days of delivery.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li>Items must be unworn, unwashed, and in original condition with tags attached.</li>
                                <li>Footwear must be returned in the original box.</li>
                                <li>Refunds are processed within 5-7 business days after we receive your return.</li>
                                <li>Sale items are final sale and cannot be returned.</li>
                                <li className="decoration-2 underline">Failing to follow these instructions may result in cancellation of your refund.</li>
                            </ul>

                            <div className="bg-zinc-900 text-white p-8 rounded-3xl mt-8">
                                <h3 className="text-xl font-bold uppercase mb-4">Start a Return</h3>

                                {!isSuccess ? (
                                    <>
                                        <p className="text-zinc-400 mb-6 max-w-lg">
                                            Ready to send something back? Enter your order details below to verify eligibility and print your prepaid shipping label.
                                        </p>
                                        <form onSubmit={handleReturnSubmit} className="max-w-md space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label htmlFor="orderNumber" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Order Number</label>
                                                    <Input
                                                        id="orderNumber"
                                                        placeholder="TGE1001"
                                                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-white"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Email</label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-white"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full bg-white text-zinc-900 hover:bg-zinc-200 rounded-lg font-bold h-12"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                                                    </span>
                                                ) : (
                                                    "Find Order"
                                                )}
                                            </Button>
                                        </form>
                                    </>
                                ) : (
                                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 animate-in fade-in zoom-in duration-300">
                                        <div className="flex items-center gap-3 mb-2 text-emerald-400">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                <Package className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-lg">Return Requested</span>
                                        </div>
                                        <p className="text-zinc-300 mb-4">
                                            We've sent a return shipping label to your email. Please print it and attach it to your package.
                                        </p>
                                        <Button
                                            onClick={() => setIsSuccess(false)}
                                            variant="outline"
                                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                                        >
                                            Process Another Return
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
