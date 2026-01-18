"use client";

import { Shirt, Layers, Zap } from "lucide-react";

export function WhyTGE() {
    const features = [
        {
            title: "Built for Daily Wear",
            text: "Fabrics that breathe and move with you. Our pieces are engineered for the reality of your day, not just the photo.",
            icon: Shirt
        },
        {
            title: "Versatile Design",
            text: "A modular wardrobe system. Every piece interacts with the next, reducing decision fatigue and maximizing style.",
            icon: Layers
        },
        {
            title: "Modern Comfort",
            text: "We believe structure shouldn't mean stiffness. Experience tailored fits with the ease of loungewear.",
            icon: Zap
        }
    ];

    return (
        <section className="bg-zinc-50 py-32 border-t border-zinc-200">
            <div className="mx-auto max-w-[1400px] px-4">
                <div className="mx-auto max-w-[1400px] px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
                        <div className="max-w-xl">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 block">The TGE Standard</span>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 leading-[0.9]" data-animate="text">
                                Why TGE?
                            </h2>
                        </div>
                        <p className="text-zinc-500 max-w-sm text-lg font-medium leading-relaxed">
                            We design for the modern uniform. Essential, deliberate, and built to last.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12" data-animate="grid">
                        {features.map((feature, i) => (
                            <div key={i} className="flex flex-col items-start pt-8 border-t border-zinc-200">
                                <feature.icon className="w-6 h-6 text-zinc-900 mb-6" strokeWidth={1.5} />
                                <h3 className="text-lg font-bold text-zinc-900 mb-3 uppercase tracking-wide">{feature.title}</h3>
                                <p className="text-zinc-500 leading-relaxed text-base max-w-sm">
                                    {feature.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
