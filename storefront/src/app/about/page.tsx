import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "The Garment Experiment | TGE",
    description: "TGE is a daily uniform system for creative people moving between work, city, travel, and after-hours culture.",
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-bone text-carbon pt-16">

            {/* Opening Statement */}
            <section className="max-w-[1600px] mx-auto px-spacing-component pt-spacing-editorial pb-spacing-section-gap border-b border-graphite/20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-spacing-section-gap">
                    <div className="lg:col-span-7">
                        <p className="text-mono text-acid mb-spacing-component">TGE / 01</p>
                        <h1 className="text-display-xl uppercase leading-none mb-spacing-section-inner overflow-hidden">
                            The Garment<br/>Experiment
                        </h1>
                        <p className="text-body-large text-graphite max-w-lg">
                            A daily uniform system for creative people moving between work, city, travel, and after-hours culture.
                        </p>
                    </div>
                    <div className="lg:col-span-5 flex flex-col justify-end">
                        <div className="text-mono text-graphite space-y-1">
                            <p>FOUNDED: INDIA</p>
                            <p>CONDITION: DAILY</p>
                            <p>EDITION: 01</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Worldview */}
            <section className="max-w-[1600px] mx-auto px-spacing-component py-spacing-editorial">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-spacing-section-gap">
                    <div>
                        <p className="text-mono text-graphite mb-spacing-component">THE SYSTEM</p>
                        <h2 className="text-display-m uppercase mb-spacing-component leading-none">
                            Not a brand.<br/>A method.
                        </h2>
                    </div>
                    <div className="flex flex-col justify-center gap-8">
                        <p className="text-body-large text-graphite">
                            We don't build seasonal collections. We build a repeating system of garments that perform across the friction points of daily life.
                        </p>
                        <p className="text-body text-graphite">
                            Each object is field-tested for the conditions it claims to address. If it fails under pressure, it doesn't enter the system. If it survives repetition — daily wash, daily wear, daily transition — it earns its code.
                        </p>
                        <p className="text-body text-graphite">
                            We are India-first. We build for heat, transit, humidity, and the particular texture of moving between dense urban environments. We are globally legible, but not globally generic.
                        </p>
                    </div>
                </div>
            </section>

            {/* System Values */}
            <section className="bg-carbon text-bone py-spacing-editorial px-spacing-component">
                <div className="max-w-[1600px] mx-auto">
                    <p className="text-mono text-acid mb-spacing-section-inner">FIELD CONDITIONS</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-component">
                        {[
                            {
                                index: "01",
                                title: "Repetition Over Novelty",
                                body: "The best garment is the one you reach for every morning without deciding. We design for habit, not occasion.",
                            },
                            {
                                index: "02",
                                title: "Utility as Identity",
                                body: "Function is the material of our aesthetic. Nothing decorative without reason. Nothing structural without purpose.",
                            },
                            {
                                index: "03",
                                title: "Material Honesty",
                                body: "We document the composition, weight, and treatment of every object. What it is made from is part of what it means.",
                            },
                        ].map((item) => (
                            <div key={item.index} className="border-t border-bone/10 pt-6">
                                <p className="text-mono text-acid mb-4">{item.index}</p>
                                <h3 className="text-heading uppercase mb-4">{item.title}</h3>
                                <p className="text-body text-bone/70">{item.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-[1600px] mx-auto px-spacing-component py-spacing-editorial text-center">
                <p className="text-mono text-graphite mb-spacing-component">ENTER THE SYSTEM</p>
                <h2 className="text-display-l uppercase mb-spacing-section-gap leading-none">
                    Start with<br/>the daily object.
                </h2>
                <Link
                    href="/collections/new-system"
                    className="inline-block border border-carbon text-carbon px-12 py-5 text-meta uppercase tracking-widest hover:bg-carbon hover:text-bone transition-colors"
                >
                    View New System
                </Link>
            </section>

        </main>
    );
}
