import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-zinc-50 pt-32 pb-20">
            {/* 1. HERO HEADER */}
            <section className="mx-auto max-w-7xl px-4 mb-16 text-center">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-zinc-900 mb-6">
                    Defining the <br className="hidden md:block" /> New Standard
                </h1>
                <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
                    TGE is built for everyday wear and real use. Clothing that fits into your actual life, not just your feed.
                </p>
            </section>


            {/* 3. MISSION TEXT (Reference Copy) */}
            <section className="mx-auto max-w-7xl px-4 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
                    <div>
                        <h2 className="text-3xl font-bold uppercase tracking-tight text-zinc-900 mb-6 sticky top-32">
                            Built for <br /> Real Life
                        </h2>
                    </div>
                    <div className="space-y-8 text-lg text-zinc-600 leading-relaxed font-medium">
                        <p>
                            We focus on clothing that fits into daily life, whether it’s for college, work, casual outings, or special occasions.
                        </p>
                        <p>
                            Our collections cover dailywear essentials, outerwear, and partywear. Each piece is designed to be easy to wear, easy to style, and comfortable throughout the day. We keep the designs clean and modern so they work across different settings without feeling overdone.
                        </p>
                        <p className="text-zinc-900 font-bold">
                            We believe good clothing should be practical first. That’s why we prioritise fit, fabric, and wearability over trends that don’t last.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. VALUES GRID */}
            <section className="mx-auto max-w-7xl px-4 py-16 bg-white rounded-[32px] mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                    <div className="space-y-4 px-4">
                        <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
                            <span className="font-bold text-lg">01</span>
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-wide">Everyday Utility</h3>
                        <p className="text-zinc-500">Reliable, well-made clothes you can reach for every single morning without hesitation.</p>
                    </div>
                    <div className="space-y-4 px-4 border-t md:border-t-0 md:border-l border-zinc-100 pt-8 md:pt-0">
                        <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
                            <span className="font-bold text-lg">02</span>
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-wide">Clean Design</h3>
                        <p className="text-zinc-500">Modern silhouettes that work across settings without appearing overdone or trying too hard.</p>
                    </div>
                    <div className="space-y-4 px-4 border-t md:border-t-0 md:border-l border-zinc-100 pt-8 md:pt-0">
                        <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
                            <span className="font-bold text-lg">03</span>
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-wide">Lasting Fit</h3>
                        <p className="text-zinc-500">Prioritizing fabric and wearability over fleeting trends. Clothing built to last.</p>
                    </div>
                </div>
            </section>

            {/* 5. BOTTOM CTA */}
            <section className="mx-auto max-w-7xl px-4 text-center">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">
                    Ready to Upgrade?
                </h2>
                <Link href="/collections/all">
                    <Button size="lg" className="rounded-full h-16 px-10 text-lg font-bold">
                        Shop the Collection
                    </Button>
                </Link>
            </section>
        </main>
    );
}
