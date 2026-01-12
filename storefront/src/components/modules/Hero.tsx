import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

interface HeroProps {
    heading?: string;
    subheading?: string;
    ctaText?: string;
    ctaLink?: string;
    imageUrl?: string;
}

export function Hero({
    heading = "THE NEW UNIFORM",
    subheading = "Essential. Deliberate. Forever.",
    ctaText = "Shop Collection",
    ctaLink = "/collections",
    imageUrl = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2674&auto=format&fit=crop"
}: HeroProps) {
    return (
        <section className="relative h-[92vh] w-full bg-zinc-950 overflow-hidden flex items-center justify-center rounded-b-[32px] mb-4">

            {/* Background Typography (Layer 0) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4 z-0 pointer-events-none opacity-[0.03]">
                <Image
                    src="/logo-main-white.svg"
                    alt="TGE Background"
                    width={1000}
                    height={300}
                    className="w-full h-auto brightness-0"
                    priority
                />
            </div>

            {/* Main Image (Layer 1) - Mask Reveal? No, let's keep it immersive but maybe scale it? 
                Actually, let's just keep it simple for now, the revealing text is the hero.
            */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={imageUrl}
                    alt="Campaign Hero"
                    fill
                    className="object-cover object-top"
                    priority
                />
            </div>

            {/* Premium Overlay (Layer 2) */}
            <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />

            {/* Main Content (Layer 3) */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto">

                {/* Headline: Mask & Skew Reveal */}
                <Reveal delay={0.1}>
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tight leading-[0.9] mb-8">
                        {heading}
                    </h1>
                </Reveal>

                {/* Subheadline: Staggered Reveal */}
                {subheading && (
                    <Reveal delay={0.3}>
                        <p className="text-xs md:text-sm tracking-[0.2em] font-bold uppercase text-white/90 mb-10">
                            {subheading}
                        </p>
                    </Reveal>
                )}

                {/* CTAs: Reveal Only */}
                <Reveal delay={0.5}>
                    <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                        <Button
                            asChild
                            href={ctaLink}
                            size="lg"
                            className="rounded-full h-12 px-8 text-sm font-bold bg-white text-zinc-900 hover:bg-zinc-100 border-none min-w-[160px]"
                        >
                            <span>{ctaText}</span>
                        </Button>

                        <Button
                            asChild
                            href="/about"
                            variant="link"
                            className="text-white hover:text-white/80 p-0 h-auto font-medium text-sm underline decoration-1 underline-offset-4 decoration-white/50 hover:decoration-white"
                        >
                            <span>Explore</span>
                        </Button>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
