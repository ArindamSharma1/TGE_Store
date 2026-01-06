import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { FadeIn } from "@/components/ui/FadeIn";

interface HeroProps {
    heading?: string;
    subheading?: string;
    ctaText?: string;
    ctaLink?: string;
    imageUrl?: string;
}

export function Hero({
    heading = "SUMMER EDIT",
    subheading = "The new rules of style.",
    ctaText = "Shop Collection",
    ctaLink = "/collections",
    imageUrl = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2674&auto=format&fit=crop"
}: HeroProps) {
    return (
        <section className="relative h-[95vh] w-full bg-zinc-100 overflow-hidden flex items-end justify-center rounded-b-[40px] mb-4">
            {/* Background Typography (Layer 1) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4 z-0 pointer-events-none opacity-[0.05]">
                <Image
                    src="/logo-main-white.svg"
                    alt="TGE Background"
                    width={1000}
                    height={300}
                    className="w-full h-auto brightness-0"
                />
            </div>

            {/* Main Image (Layer 2) */}
            <Image
                src={imageUrl}
                alt="Campaign Hero"
                fill
                className="object-cover object-top z-10"
                priority
            />

            {/* Main Content (Centered) */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                <FadeIn delay={0.1} direction="up">
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6 drop-shadow-lg max-w-4xl">
                        {heading}
                    </h1>
                </FadeIn>
                {subheading && (
                    <FadeIn delay={0.2} direction="up">
                        <p className="text-lg md:text-xl text-white/90 font-medium mb-8 max-w-lg drop-shadow-md mx-auto">
                            {subheading}
                        </p>
                    </FadeIn>
                )}
                <FadeIn delay={0.3} direction="up">
                    <div className="flex gap-4 justify-center">
                        <Button asChild href={ctaLink} size="lg" className="rounded-full h-14 px-8 text-base">
                            {ctaText}
                        </Button>
                        <Button asChild href="/about" variant="secondary" size="lg" className="rounded-full h-14 px-8 text-base bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-md">
                            About Us
                        </Button>
                    </div>
                </FadeIn>
            </div>


        </section>
    );
}
