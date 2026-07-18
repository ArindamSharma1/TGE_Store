"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils/cn";

type FitPreference = "close" | "standard" | "relaxed";

const FIT_OPTIONS: Record<FitPreference, string> = {
    close: "Sits close to the body. No excess material.",
    standard: "Our designed fit. Works across most builds.",
    relaxed: "Full ease through the body. Drape-oriented.",
};

interface ProductOption {
    name: string;
    values: string[];
}

interface ProductInfoProps {
    title: string;
    description: string;
    options?: ProductOption[];
    image: string;
    handle: string;
    variants?: any[];
    objectCode?: string;
}

export function ProductInfo({
    title,
    description,
    options = [],
    image,
    handle,
    variants = [],
    objectCode,
}: ProductInfoProps) {
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [fit, setFit] = useState<FitPreference>("standard");
    const [isAdding, setIsAdding] = useState(false);
    const { addItem } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const handleSelect = (optionName: string, value: string) => {
        setSelections((prev) => ({ ...prev, [optionName]: value }));
    };

    const allSelected = options.every((opt) => selections[opt.name]);

    const selectedVariant = useMemo(() => {
        if (variants.length === 0) return undefined;
        if (variants.length === 1) return variants[0];
        return (
            variants.find((v) =>
                v.selectedOptions.every((vo: any) => selections[vo.name] === vo.value)
            ) || variants[0]
        );
    }, [variants, selections]);

    const resolvedPrice = useMemo(() => {
        const amount = selectedVariant?.price?.amount;
        if (!amount) return null;
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: selectedVariant?.price?.currencyCode || "INR",
            minimumFractionDigits: 0,
        }).format(parseFloat(amount));
    }, [selectedVariant]);

    const isOutOfStock = !selectedVariant?.availableForSale;
    const productId = selectedVariant?.id;
    const inWishlist = productId ? isInWishlist(productId) : false;

    const toggleWishlist = () => {
        if (!productId) return;
        if (inWishlist) {
            removeFromWishlist(productId);
        } else {
            addToWishlist({
                id: productId,
                title,
                handle,
                thumbnail: image,
                price: parseFloat(selectedVariant?.price?.amount || "0"),
            });
        }
    };

    const handleAddToSystem = async () => {
        if (!selectedVariant || isOutOfStock) return;
        setIsAdding(true);
        try {
            await addItem({ variantId: selectedVariant.id, quantity: 1 });
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 sticky top-20">
            {/* Object Metadata */}
            <div className="border-b border-graphite/20 pb-6">
                {objectCode && (
                    <p className="text-mono text-acid mb-2">{objectCode}</p>
                )}
                <p className="text-mono text-graphite mb-4">TGE / {title.toUpperCase()}</p>
                <h1 className="text-heading uppercase leading-tight mb-4">{title}</h1>
                <div className="flex items-center gap-4">
                    <p className="text-display-m">{resolvedPrice || "—"}</p>
                    {isOutOfStock && selectedVariant && (
                        <span className="text-mono bg-carbon text-bone px-2 py-0.5">SOLD OUT</span>
                    )}
                </div>
                <p className="text-mono text-graphite mt-1">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <p className="text-body text-graphite leading-relaxed">{description}</p>

            {/* Fit Selector */}
            <div>
                <p className="text-mono text-graphite mb-3">HOW DO YOU WANT IT TO SIT?</p>
                <div className="flex gap-0 border border-graphite/30">
                    {(Object.keys(FIT_OPTIONS) as FitPreference[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFit(f)}
                            className={cn(
                                "flex-1 py-3 text-meta uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
                                fit === f
                                    ? "bg-carbon text-bone"
                                    : "text-graphite hover:text-carbon border-r border-graphite/30 last:border-r-0"
                            )}
                            aria-pressed={fit === f}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
                <p className="text-meta text-graphite mt-2">{FIT_OPTIONS[fit]}</p>
            </div>

            {/* Size Options */}
            {options.map((option) => (
                <div key={option.name}>
                    <p className="text-mono text-graphite mb-3">
                        {option.name.toUpperCase()}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                            const isSelected = selections[option.name] === value;
                            // Check if this variant combination is available
                            const matchingVariant = variants.find((v) =>
                                v.selectedOptions.some(
                                    (vo: any) => vo.name === option.name && vo.value === value
                                )
                            );
                            const isAvailable = matchingVariant?.availableForSale !== false;

                            return (
                                <button
                                    key={value}
                                    onClick={() => isAvailable && handleSelect(option.name, value)}
                                    disabled={!isAvailable}
                                    className={cn(
                                        "min-w-[44px] h-11 px-4 text-meta uppercase transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
                                        isSelected
                                            ? "bg-carbon text-bone border-carbon"
                                            : isAvailable
                                                ? "border-graphite/30 text-graphite hover:border-carbon hover:text-carbon"
                                                : "border-graphite/10 text-graphite/30 cursor-not-allowed line-through"
                                    )}
                                    aria-pressed={isSelected}
                                    aria-label={`${option.name}: ${value}${!isAvailable ? " — sold out" : ""}`}
                                >
                                    {value}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Add to System */}
            <button
                onClick={handleAddToSystem}
                disabled={(!allSelected && options.length > 0) || isOutOfStock || isAdding}
                className={cn(
                    "w-full py-4 text-meta uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
                    isOutOfStock
                        ? "bg-fog text-graphite cursor-not-allowed"
                        : (!allSelected && options.length > 0)
                            ? "bg-fog text-graphite cursor-not-allowed"
                            : "bg-carbon text-bone hover:bg-acid hover:text-carbon"
                )}
                aria-busy={isAdding}
            >
                {isAdding
                    ? "Adding…"
                    : isOutOfStock
                        ? "Sold Out"
                        : (!allSelected && options.length > 0)
                            ? "Select Options"
                            : "Add to System"
                }
            </button>

            {/* Save */}
            <button
                onClick={toggleWishlist}
                className="text-meta uppercase text-graphite hover:text-carbon transition-colors underline underline-offset-4 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
            >
                {inWishlist ? "Saved to System" : "Save Object"}
            </button>

            {/* Delivery Note */}
            <div className="border-t border-graphite/20 pt-6 flex flex-col gap-2">
                <div className="flex items-center gap-3 text-meta text-graphite">
                    <span className={cn("w-2 h-2", isOutOfStock ? "bg-graphite" : "bg-acid")} />
                    {isOutOfStock ? "Currently unavailable" : "In stock — ships in 3–5 days"}
                </div>
                <div className="flex items-center gap-3 text-meta text-graphite">
                    <span className="w-2 h-2 border border-graphite/40" />
                    Free returns within 30 days
                </div>
            </div>

            {/* Product Details accordion placeholder */}
            <div className="border-t border-graphite/20 pt-4">
                {[
                    { label: "Fit", content: `${fit.charAt(0).toUpperCase() + fit.slice(1)} fit. ${FIT_OPTIONS[fit]}` },
                    { label: "Material", content: "Composition details available on product page." },
                    { label: "Care", content: "Machine wash cold. Do not tumble dry. Hang to dry." },
                    { label: "Delivery & Returns", content: "Standard delivery 3–5 days. Free returns within 30 days." },
                ].map(({ label, content }) => (
                    <details key={label} className="border-b border-graphite/20 group">
                        <summary className="flex justify-between py-3 cursor-pointer text-meta uppercase text-carbon list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid">
                            {label}
                            <span className="text-graphite group-open:rotate-45 transition-transform">+</span>
                        </summary>
                        <p className="text-meta text-graphite pb-4 leading-relaxed">{content}</p>
                    </details>
                ))}
            </div>
        </div>
    );
}
