"use client";

import { Reveal } from "@/components/ui/Reveal";
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
        <section className="bg-zinc-50 py-24 border-t border-zinc-200">
            <div className="mx-auto max-w-7xl px-4">
                <Reveal width="100%" className="overflow-visible">
                    <div className="text-center mb-16">
                        <span className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 block">The TGE Standard</span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900">
                            Why TGS?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div key={i} className="group bg-white p-8 md:p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100/50 hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-8 group-hover:bg-zinc-900 transition-colors duration-300">
                                    <feature.icon className="w-6 h-6 text-zinc-900 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-4 uppercase tracking-tight">{feature.title}</h3>
                                <p className="text-zinc-500 leading-relaxed font-medium">
                                    {feature.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
