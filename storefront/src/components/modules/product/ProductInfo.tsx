import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { VariantSelector } from "./VariantSelector";
import { ShoppingBag, Star, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductOption {
    name: string; // e.g. "Size", "Color"
    values: string[];
}

interface ProductInfoProps {
    title: string;
    price?: string; // Optional, deprecated
    description: string;
    options?: ProductOption[];
    image: string; // Main image for cart
    handle: string;
    variants?: any[];
    productOptions?: any[]; // Medusa options with IDs
}

export function ProductInfo({ title, description, options = [], image, handle, variants = [], productOptions = [] }: ProductInfoProps) {
    const [selections, setSelections] = useState<Record<string, string>>({});
    const { addItem } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const handleSelect = (optionName: string, value: string) => {
        setSelections((prev) => ({ ...prev, [optionName]: value }));
    };

    const allSelected = options.every((opt) => selections[opt.name]);

    // Resolve selected variant
    const selectedVariant = useMemo(() => {
        if (variants.length === 0) return undefined;
        if (variants.length === 1 && options.length === 0) return variants[0];

        // Map selections to option IDs
        const selectionMap = new Map<string, string>();
        Object.entries(selections).forEach(([name, value]) => {
            const opt = productOptions.find(o => o.title === name);
            if (opt) selectionMap.set(opt.id, value);
        });

        // Find match
        return variants.find(v => {
            return v.options.every((vo: any) => selectionMap.get(vo.option_id) === vo.value);
        }) || variants[0]; // Fallback to first variant (e.g. for "starting at" price)
    }, [variants, options, selections, productOptions]);

    // Resolve Price
    const resolvedPrice = useMemo(() => {
        if (!selectedVariant) return null;

        // Priority 1: Calculated Price (Medusa context)
        let amount = selectedVariant.calculated_price?.calculated_amount;

        // Priority 2: Fallback to INR price in prices array
        if (amount === undefined || amount === null) {
            const inrPrice = selectedVariant.prices?.find((p: any) => p.currency_code?.toLowerCase() === "inr");
            if (inrPrice) amount = inrPrice.amount;
        }

        // Priority 3: Fallback to first available price
        if (amount === undefined || amount === null) {
            amount = selectedVariant.prices?.[0]?.amount;
        }

        if (amount === undefined || amount === null) return null;

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount / 100);
    }, [selectedVariant]);

    // Stock Logic
    const isOutOfStock = useMemo(() => {
        if (!selectedVariant) return false;
        if (selectedVariant.allow_backorder) return false;
        if (!selectedVariant.manage_inventory) return false;
        return selectedVariant.inventory_quantity < 1;
    }, [selectedVariant]);

    // Wishlist Logic
    const isSaved = selectedVariant ? isInWishlist(selectedVariant.product_id || selectedVariant.id) : false;
    // Note: Items usually tracked by Product ID, not Variant ID for wishlist, but Medusa structure varies.
    // Assuming Product ID for now (using handle for link).
    // Actually, `variants` usually have `product_id`. If not, we might need `product.id` passed in props?
    // Wait, ProductInfo doesn't receive `id`. It receives `handle`.
    // Let's use `handle` as unique key for now or just check if we can pass ID.
    // The previous implementation used "items" as { id, handle, ... }.
    // Let's rely on handle if ID is missing from variants (which is unlikely).
    // BETTER: Recieve `id` as prop. But for now, let's use `variants[0].product_id` if available.

    const productId = variants?.[0]?.product_id;

    // Safe wishlist check
    const inWishlist = productId ? isInWishlist(productId) : false;

    const toggleWishlist = () => {
        if (!productId) return;
        if (inWishlist) {
            removeFromWishlist(productId);
        } else {
            // Need a valid price number for the wishlist item
            // Let's strip the currency symbol from resolvedPrice or verify raw amount
            const priceVal = selectedVariant?.prices?.[0]?.amount ? selectedVariant.prices[0].amount / 100 : 0;

            addToWishlist({
                id: productId,
                title: title,
                handle: handle,
                thumbnail: image,
                price: priceVal
            });
        }
    };

    const handleAddToBag = async () => {
        if (!allSelected && options.length > 0) {
            console.warn("Not all options selected");
            return;
        }

        if (!selectedVariant) {
            console.error("No variant found");
            return;
        }

        if (isOutOfStock) {
            return; // Should be disabled in UI, but safety check
        }

        try {
            await addItem({
                variantId: selectedVariant.id,
                quantity: 1
            });
        } catch (e) {
            console.error("Add to cart failed", e);
        }
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
                <div className="flex items-center gap-4">
                    <p className="text-2xl font-medium text-zinc-900">{resolvedPrice || "Price Unavailable"}</p>
                    {isOutOfStock && (
                        <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-xs font-bold uppercase rounded-full">
                            Sold Out
                        </span>
                    )}
                </div>
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
            <div className="pt-6 border-t border-zinc-100 flex flex-col gap-4">
                <p className="text-xs font-medium text-zinc-400 italic">
                    Crafted for the modern journey.
                </p>
                <Button
                    size="lg"
                    className={`w-full h-16 rounded-full text-lg font-bold flex items-center justify-center gap-2 transition-all
                        ${isOutOfStock
                            ? "bg-zinc-100 text-zinc-400 cursor-not-allowed hover:bg-zinc-100"
                            : "bg-zinc-900 hover:bg-zinc-800 text-white"
                        }`}
                    disabled={(!allSelected && options.length > 0) || isOutOfStock}
                    onClick={handleAddToBag}
                >
                    <ShoppingBag className="w-5 h-5" />
                    {isOutOfStock
                        ? "Out of Stock"
                        : (allSelected || options.length === 0 ? "Add to Bag" : "Select Options")
                    }
                </Button>

                <button
                    onClick={toggleWishlist}
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
