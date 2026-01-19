"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    id: string;
    title: string;
    handle: string;
    thumbnail: string;
    price: number;
    currencyCode: string;
    images?: {
        main: string;
        hover: string;
    };
    tags?: string[];
    defaultVariantId?: string;
    variants?: any[];
}

export function ProductCard({
    id,
    title,
    handle,
    price,
    currencyCode,
    images = {
        main: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
        hover: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=1000&auto=format&fit=crop"
    },
    tags = [],
    defaultVariantId,
    variants = []
}: ProductCardProps) {
    const { addItem } = useCart();

    // Resolve Variant (for Quick Add)
    const activeVariantId = defaultVariantId || variants?.[0]?.id;

    // Resolve Price
    // Priority: Prop > Calculated > INR > First
    let displayPrice = price;

    // If prop price is 0 or suspicious, try resolving from variants
    if (!displayPrice && variants.length > 0) {
        const variant = variants[0];
        // Shopify Variant Price Check
        if (variant.price?.amount) {
            displayPrice = parseFloat(variant.price.amount);
        }
    }

    // Metadata Logic: Find first relevant tag (GSM, Fit, Material)
    // Priority: GSM -> Cotton/Material -> Fit
    const metadataTag = tags.find(t => t.toLowerCase().includes('gsm')) ||
        tags.find(t => t.toLowerCase().includes('cotton') || t.toLowerCase().includes('linen')) ||
        tags.find(t => t.toLowerCase().includes('fit')) ||
        "Premium Essentials"; // Fallback

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (activeVariantId) {
            await addItem({
                variantId: activeVariantId,
                quantity: 1
            });
        } else {
            console.warn("No variant ID available for quick add");
            // Ideally open product modal or navigate to product page
        }
    };

    return (
        <div className="group relative block h-full w-full">
            <Link href={`/products/${handle}`} className="block h-full w-full">
                <GlassCard className="relative aspect-[4/5] w-full overflow-hidden bg-white border-zinc-100 mb-4 transition-all duration-500 group-hover:shadow-lg">
                    {/* Main Image */}
                    {/* Main Image */}
                    <Image
                        src={images.main || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop"}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] will-change-transform"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {/* Hover Image */}
                    <Image
                        src={images.hover || images.main || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop"}
                        alt={`${title} - Alternate View`}
                        fill
                        className="absolute inset-0 object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-[1.03] will-change-transform"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />

                    {/* Quick Add (Floating Circle) */}
                    <div className="absolute bottom-3 right-3 z-10 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Button
                            size="icon"
                            className="bg-white text-zinc-900 shadow-md hover:bg-zinc-900 hover:text-white rounded-full h-10 w-10"
                            onClick={handleAddToCart}
                        >
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>
                </GlassCard>

                <div className="space-y-1 px-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm uppercase tracking-wide text-zinc-900 group-hover:underline underline-offset-4 decoration-1 decoration-zinc-300 truncate pr-4">
                            {title}
                        </h3>
                        <span className="font-medium text-sm text-zinc-900 text-right">
                            {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR'
                            }).format(displayPrice)}
                        </span>
                    </div>
                    {/* Metadata Line */}
                    <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase">{metadataTag}</p>
                </div>
            </Link>
        </div>
    );
}
