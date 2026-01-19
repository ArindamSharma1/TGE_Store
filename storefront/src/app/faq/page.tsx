"use client";

import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export default function FAQPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 mb-4">
                        FAQ
                    </h1>
                    <p className="text-zinc-500 text-lg">
                        Common questions about our products and services.
                    </p>
                </div>

                <div className="space-y-4">
                    <FAQItem
                        question="How do I find my size?"
                        answer="We include a detailed size guide on every product page. We recommend comparing the measurements of a similar item you already own to our size chart."
                    />
                    <FAQItem
                        question="How much is shipping?"
                        answer="We offer free standard shipping on all domestic orders over ₹999. For orders under ₹999, a flat rate of ₹99 applies."
                    />
                    <FAQItem
                        question="What is your return policy?"
                        answer="We accept returns within 30 days of delivery. Items must be unworn, unwashed and with tags attached."
                    />
                    <FAQItem
                        question="Do you ship internationally?"
                        answer="Currently, we only ship within India. We are working on expanding our shipping capabilities to serve international customers soon."
                    />
                    <FAQItem
                        question="Can I change or cancel my order?"
                        answer="Orders can be modified or cancelled within 1 hour of placement. Please contact our support team immediately if you need to make changes."
                    />
                    <FAQItem
                        question="Where are your clothes sourced?"
                        answer="We are a proud 100% Indian brand. We do not manufacture in-house; instead, we source premium surplus and factory-direct inventory from top manufacturers across India and Internationally available outlets. This allows us to offer high-quality garments at exceptional value."
                    />
                </div>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white hover:border-zinc-300 transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="font-bold text-zinc-900 text-lg">{question}</span>
                <span className="flex-shrink-0 ml-4">
                    {isOpen ? (
                        <Minus className="w-5 h-5 text-zinc-400" />
                    ) : (
                        <Plus className="w-5 h-5 text-zinc-900" />
                    )}
                </span>
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out px-6",
                    isOpen ? "max-h-48 pb-6 opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <p className="text-zinc-500 leading-relaxed">{answer}</p>
            </div>
        </div>
    );
}
