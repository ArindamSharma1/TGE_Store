"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface ProductInfoProps {
    title: string;
    price: number;
    description: string;
    currencyCode?: string;
}

export function ProductInfo({ title, price, description, currencyCode = "USD" }: ProductInfoProps) {
    const [selectedSize, setSelectedSize] = React.useState<string | null>(null);

    const sizes = ["XS", "S", "M", "L", "XL"];

    return (
        <div className="space-y-8 sticky top-24">
            <div className="space-y-2">
                <h1 className="text-3xl font-satoshi font-bold text-charcoal-black uppercase tracking-wide">
                    {title}
                </h1>
                <p className="text-xl font-bold text-secondary-text">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(price)}
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold uppercase tracking-wide">Select Size</h3>
                    <button className="text-xs underline text-secondary-text hover:text-charcoal-black">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={cn(
                                "relative min-w-[3rem] h-10 px-3 text-sm font-medium transition-all duration-200 ease-out",
                                "border border-border hover:border-charcoal-black",
                                selectedSize === size
                                    ? "bg-charcoal-black text-pure-white border-charcoal-black"
                                    : "bg-transparent text-charcoal-black"
                            )}
                        >
                            {size}
                        </button>
                    ))}
                </div>
                {!selectedSize && (
                    <p className="text-xs text-red-500 hidden">Please select a size</p>
                )}
            </div>

            <Button size="lg" className="w-full" disabled={!selectedSize}>
                Add to Bag
            </Button>

            <div className="border-t border-border pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wide mb-2">Description</h3>
                <p className="text-sm text-secondary-text leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="space-y-2 border-t border-border pt-6">
                <div className="flex gap-2 text-sm text-secondary-text">
                    <span className="font-bold text-charcoal-black">Free Delivery</span>
                    <span>on orders over $100</span>
                </div>
                <div className="flex gap-2 text-sm text-secondary-text">
                    <span className="font-bold text-charcoal-black">Returns</span>
                    <span>Free 30-day returns</span>
                </div>
            </div>
        </div>
    );
}
