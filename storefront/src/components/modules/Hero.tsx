import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface HeroProps {
    heading?: string;
    subheading?: string;
    ctaText?: string;
    ctaLink?: string;
    imageUrl?: string;
}

export function Hero({
    heading = "The New Collection",
    subheading = "Discover the latest trends for the season.",
    ctaText = "Shop Now",
    ctaLink = "/collections/new-arrivals",
    imageUrl = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
}: HeroProps) {
    return (
        <section className="relative h-[80vh] w-full overflow-hidden bg-gray-100">
            <Image
                src={imageUrl}
                alt="Hero Image"
                fill
                className="object-cover object-center"
                priority
            />
            <div className="absolute inset-0 bg-black/20" /> {/* Overlay using opacity */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 className="font-satoshi text-5xl md:text-7xl font-bold uppercase tracking-tighter text-pure-white mb-6 drop-shadow-md">
                    {heading}
                </h1>
                <p className="font-open-sans text-xl md:text-2xl text-pure-white mb-8 max-w-2xl drop-shadow-md">
                    {subheading}
                </p>
                <Button asChild size="lg" className="bg-pure-white text-charcoal-black hover:bg-neutral-200 border-none">
                    <Link href={ctaLink}>{ctaText}</Link>
                </Button>
            </div>
        </section>
    );
}
