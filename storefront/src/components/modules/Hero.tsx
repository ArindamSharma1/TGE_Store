import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface HeroProps {
    heading?: string;
    subheading?: string;
    kicker?: string;
    ctaText?: string;
    ctaLink?: string;
    imageUrl?: string;
}

export function Hero({
    heading = "THE NEW UNIFORM",
    subheading = "Essential. Deliberate. Forever.",
    kicker = "Engineered Dailywear",
    ctaText = "Shop Collection",
    ctaLink = "/collections",
    imageUrl = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2674&auto=format&fit=crop"
}: HeroProps) {
    return (
        <section className="relative h-[85vh] w-full bg-zinc-950 overflow-hidden flex items-center justify-center rounded-b-[32px] mb-4">

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

            {/* Main Image (Layer 1) */}
            <div className="absolute inset-0 z-0" data-animate="parallax">
                <Image
                    src={imageUrl}
                    alt="Campaign Hero"
                    fill
                    className="object-cover object-top"
                    priority
                />
            </div>

            {/* Premium Overlay (Layer 2) - Darker Gradient for Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 z-10 pointer-events-none" />

            {/* Main Content (Layer 3) */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-12">

                {/* Kicker Micro-line */}
                {kicker && (
                    <span className="block text-xs font-bold uppercase tracking-[0.3em] text-white/80 mb-6" data-animate="text">
                        {kicker}
                    </span>
                )}

                {/* Headline: Mask & Skew Reveal - Slightly Reduced Size */}
                <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tight leading-[0.9] mb-8" data-animate="text">
                    {heading}
                </h1>

                {/* Subheadline: Staggered Reveal */}
                {subheading && (
                    <p className="text-sm md:text-base tracking-wide font-medium text-white/90 mb-10 max-w-md mx-auto leading-relaxed">
                        {subheading}
                    </p>
                )}

                {/* CTAs: Reveal Only */}
                <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                    <Button
                        asChild
                        href={ctaLink}
                        size="lg"
                        className="rounded-full h-12 px-8 text-sm font-bold bg-white text-zinc-900 hover:bg-zinc-100 border-none min-w-[160px]"
                        data-animate="button"
                    >
                        <span>{ctaText}</span>
                    </Button>

                    <Button
                        asChild
                        href="/about"
                        variant="link"
                        className="text-white hover:text-white/80 p-0 h-auto font-medium text-sm underline decoration-1 underline-offset-4 decoration-white/50 hover:decoration-white"
                        data-animate="button"
                    >
                        <span>About Us</span>
                    </Button>
                </div>
            </div>
        </section>
    );
}
