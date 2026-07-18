"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { useCart } from "@/context/CartContext";

export type ProductCardVariant = "object" | "worn" | "editorial" | "campaign";

interface ProductCardProps {
    id: string;
    objectCode?: string;       // e.g. "OBJ_014"
    title: string;
    editorialName?: string;    // e.g. "Daily Trouser"
    handle: string;
    price: number;
    currencyCode?: string;
    objectImage: string;
    wornImage?: string;
    materials?: string;        // e.g. "COTTON / NYLON"
    field?: string;            // e.g. "DAILY"
    variant?: ProductCardVariant;
    isNew?: boolean;
    isAvailable?: boolean;
    defaultVariantId?: string;
    variants?: any[];
    sizes?: string[];          // Widths: ["XS","S","M","L","XL"]
}

export function ProductCard({
    id,
    objectCode,
    title,
    editorialName,
    handle,
    price,
    currencyCode = "INR",
    objectImage,
    wornImage,
    materials,
    field,
    variant = "object",
    isNew = false,
    isAvailable = true,
    defaultVariantId,
    variants = [],
    sizes = [],
}: ProductCardProps) {
    const { addItem } = useCart();
    const activeVariantId = defaultVariantId || variants?.[0]?.id;

    const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);

    const handleQuickAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (activeVariantId) {
            await addItem({ variantId: activeVariantId, quantity: 1 });
        }
    };

    const displayName = editorialName || title;
    const code = objectCode || id.slice(-6).toUpperCase();

    return (
        <Link
            href={`/products/${handle}`}
            className={cn(
                "group block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
            )}
            aria-label={`${displayName}, ${formattedPrice}`}
        >
            {/* Image Container */}
            <div className="relative overflow-hidden bg-fog mb-4">
                <div className="aspect-[3/4]">
                    {/* Object Image */}
                    {objectImage && (
                        <Image
                            src={objectImage}
                            alt={`${displayName} — object view`}
                            fill
                            className={cn(
                                "object-cover transition-all duration-700",
                                wornImage
                                    ? "opacity-100 group-hover:opacity-0"
                                    : "opacity-100"
                            )}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                    )}

                    {/* Worn Image */}
                    {wornImage && (
                        <Image
                            src={wornImage}
                            alt={`${displayName} — worn view`}
                            fill
                            className="object-cover transition-all duration-700 opacity-0 scale-[1.02] group-hover:opacity-100 group-hover:scale-100"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                    )}

                    {/* Fallback gradient when no image */}
                    {!objectImage && (
                        <div className="absolute inset-0 bg-gradient-to-br from-fog to-graphite/20 flex items-center justify-center">
                            <span className="text-mono text-graphite/50">{code}</span>
                        </div>
                    )}
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {isNew && (
                        <span className="bg-acid text-carbon px-2 py-0.5 text-mono leading-tight">
                            NEW
                        </span>
                    )}
                    {!isAvailable && (
                        <span className="bg-carbon text-bone px-2 py-0.5 text-mono leading-tight">
                            SOLD OUT
                        </span>
                    )}
                </div>

                {/* Acid accent line on hover */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-acid group-hover:w-full transition-all duration-500" />

                {/* Quick Add — slides up on hover */}
                {isAvailable && (
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                            onClick={handleQuickAdd}
                            className="w-full bg-carbon text-bone py-3 text-meta uppercase tracking-widest hover:bg-acid hover:text-carbon transition-colors focus-visible:outline-none focus-visible:bg-acid focus-visible:text-carbon"
                            aria-label={`Quick add ${displayName} to system`}
                        >
                            Add to System
                        </button>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                    <p className="text-mono text-graphite mb-0.5 truncate">{code}</p>
                    <p className="text-body font-medium uppercase truncate group-hover:text-acid transition-colors">
                        {displayName}
                    </p>
                    {materials && (
                        <p className="text-mono text-graphite/70 mt-0.5">{materials}</p>
                    )}
                </div>
                <div className="flex-shrink-0 text-right">
                    <p className="text-mono">{formattedPrice}</p>
                    {field && (
                        <p className="text-mono text-acid">{field}</p>
                    )}
                </div>
            </div>
        </Link>
    );
}
