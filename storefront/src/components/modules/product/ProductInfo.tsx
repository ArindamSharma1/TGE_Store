"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { VariantSelector } from "./VariantSelector";
import { ShoppingBag, Star, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductOption {
    name: string; // e.g. "Size", "Color"
    values: string[];
}

interface ProductInfoProps {
    title: string;
    price: string;
    description: string;
    options?: ProductOption[];
    image: string; // Main image for cart
    handle: string;
    variants?: any[];
    productOptions?: any[]; // Medusa options with IDs
}

export function ProductInfo({ title, price, description, options = [], image, handle, variants = [], productOptions = [] }: ProductInfoProps) {
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [inWishlist, setInWishlist] = useState(false);
    const { addItem } = useCart();

    const handleSelect = (optionName: string, value: string) => {
        setSelections((prev) => ({ ...prev, [optionName]: value }));
    };

    const allSelected = options.every((opt) => selections[opt.name]);

    const handleAddToBag = async () => {
        if (!allSelected && options.length > 0) {
            console.warn("Not all options selected");
            return;
        }

        let selectedVariantId: string | undefined;

        if (variants.length === 1 && options.length === 0) {
            selectedVariantId = variants[0].id;
        } else {
            // Find matching variant
            // Map valid selections to option IDs
            const selectionMap = new Map<string, string>(); // optionId -> value

            Object.entries(selections).forEach(([name, value]) => {
                const opt = productOptions.find(o => o.title === name);
                if (opt) selectionMap.set(opt.id, value);
            });

            const variant = variants.find(v => {
                return v.options.every((vo: any) => selectionMap.get(vo.option_id) === vo.value);
            });

            selectedVariantId = variant?.id;
        }

        if (!selectedVariantId) {
            // Fallback for simple products or if matching fails (shouldn't happen if logic is correct)
            selectedVariantId = variants[0]?.id;
            console.warn("Could not match variant, using default", selectedVariantId);
        }

        if (!selectedVariantId) {
            console.error("No variant found");
            return;
        }

        await addItem({
            variantId: selectedVariantId,
            quantity: 1
        });
    };

    return (
        <div className="flex flex-col gap-8 sticky top-32">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-yellow-500 text-sm font-medium">
                    <Star className="w-4 h-4 fill-current" />
                    <span>4.9 (128 reviews)</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900 leading-[0.9]">
                    {title}
                </h1>
                <p className="text-2xl font-medium text-zinc-900">{price}</p>
            </div>

            {/* Options */}
            {options.length > 0 && (
                <div className="space-y-6">
                    {options.map((option) => (
                        <VariantSelector
                            key={option.name}
                            label={option.name}
                            options={option.values}
                            selected={selections[option.name]}
                            onSelect={(value) => handleSelect(option.name, value)}
                        />
                    ))}
                </div>
            )}

            {/* Description */}
            <div className="prose prose-zinc text-zinc-500 leading-relaxed">
                <p>{description}</p>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-zinc-100 flex flex-col gap-3">
                <Button
                    size="lg"
                    className="w-full h-16 rounded-full text-lg font-bold bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center gap-2"
                    disabled={!allSelected && options.length > 0}
                    onClick={handleAddToBag}
                >
                    <ShoppingBag className="w-5 h-5" />
                    {allSelected || options.length === 0 ? "Add to Bag" : "Select Options"}
                </Button>

                <button
                    onClick={() => setInWishlist(!inWishlist)}
                    className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors py-2"
                >
                    <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
                    {inWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
            </div>

            {/* Shipping/Returns Micro-copy */}
            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    In Stock, Ready to Ship
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-300" />
                    Free Returns (30 Days)
                </div>
            </div>

        </div>
    );
}
