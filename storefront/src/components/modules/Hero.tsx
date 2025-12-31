import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

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
    ctaLink = "/collections/new-arrivals",
    imageUrl = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2674&auto=format&fit=crop"
}: HeroProps) {
    return (
        <section className="relative h-[95vh] w-full bg-zinc-100 overflow-hidden flex items-end justify-center rounded-b-[40px] mb-4">
            {/* Background Typography (Layer 1) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none">
                <h1 className="font-black text-[15vw] leading-[0.8] tracking-tighter text-zinc-900/5 uppercase">
                    TGE STORE
                </h1>
            </div>

            {/* Main Image (Layer 2) */}
            <Image
                src={imageUrl}
                alt="Campaign Hero"
                fill
                className="object-cover object-top z-10"
                priority
            />

            {/* Floating Content (Layer 3 - Glass) */}
            <div className="relative z-20 container mx-auto px-4 pb-12 flex flex-col md:flex-row items-end justify-between gap-6">

                {/* Left: Heading Card */}
                <div className="max-w-xl">
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6 drop-shadow-sm">
                        {heading}
                    </h1>
                    <div className="flex gap-4">
                        <Button asChild size="lg" className="rounded-full">
                            <Link href={ctaLink}>{ctaText}</Link>
                        </Button>
                        <Button asChild variant="secondary" size="lg" className="rounded-full">
                            <Link href="/about">About Us</Link>
                        </Button>
                    </div>
                </div>

                {/* Right: Floating Info Card */}
                <GlassCard className="p-6 md:max-w-sm w-full backdrop-blur-xl bg-white/10 border-white/20 text-white">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded-full">New Drop</span>
                        <span className="text-xs font-medium opacity-80">Aug 24</span>
                    </div>
                    <p className="text-lg font-bold leading-tight mb-2">
                        Essential Pieces for the Urban Nomad.
                    </p>
                    <p className="text-sm opacity-70 mb-4">
                        Discover the collection that redefines everyday luxury.
                    </p>
                    <Link href={ctaLink} className="text-sm font-bold underline underline-offset-4 hover:opacity-80">
                        View Lookbook
                    </Link>
                </GlassCard>

            </div>
        </section>
    );
}
