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
    heading = "THE NEW COLLECTION",
    subheading = "Fresh styles just landed. 500+ new items.",
    ctaText = "SHOP NEW ARRIVALS",
    ctaLink = "/collections/new-arrivals",
    imageUrl = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
}: HeroProps) {
    return (
        <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-gray-100">
            <Image
                src={imageUrl}
                alt="New collection campaign"
                fill
                className="object-cover object-center"
                priority
            />
            {/* Overlay: 10% Charcoal Black for contrast without killing the image */}
            <div className="absolute inset-0 bg-charcoal-black/10" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 className="font-satoshi text-5xl md:text-7xl font-bold uppercase tracking-tighter text-pure-white mb-4 drop-shadow-sm leading-tight">
                    {heading}
                </h1>
                <p className="font-open-sans text-lg md:text-xl text-pure-white mb-8 max-w-lg drop-shadow-sm font-medium">
                    {subheading}
                </p>

                {/* Primary CTA: Charcoal Black, Rectangular */}
                <Button
                    asChild
                    size="lg"
                    variant="primary"
                    className="h-12 px-10 text-base rounded-none hover:opacity-90 transition-opacity duration-150"
                >
                    <Link href={ctaLink}>{ctaText}</Link>
                </Button>

                {/* Secondary Navigation Entry Points */}
                <nav className="mt-8 flex items-center gap-6 md:gap-8">
                    {["New In", "Clothing", "Shoes", "Sale"].map((item) => (
                        <Link
                            key={item}
                            href={`/collections/${item.toLowerCase().replace(" ", "-")}`}
                            className="font-open-sans text-sm font-semibold text-pure-white uppercase tracking-wide hover:underline underline-offset-4 transition-all duration-150 drop-shadow-sm"
                        >
                            {item}
                        </Link>
                    ))}
                </nav>
            </div>
        </section>
    );
}
