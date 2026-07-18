"use client";

import Image from "next/image";
import { useCart, CartItem as CartItemType } from "@/context/CartContext";
import { cn } from "@/lib/utils/cn";

export function CartItem({ item }: { item: CartItemType }) {
    const { removeItem, updateItem } = useCart();

    const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(item.price * item.quantity);

    return (
        <div className="flex gap-4">
            {/* Image */}
            <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden bg-fog">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.productTitle}
                        fill
                        className="object-cover object-center"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-mono text-graphite/40">—</span>
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                    <div>
                        <h3 className="text-body font-medium uppercase">{item.productTitle}</h3>
                        {item.variantTitle && (
                            <p className="text-mono text-graphite mt-0.5">{item.variantTitle}</p>
                        )}
                    </div>
                    <p className="text-mono flex-shrink-0">{formattedPrice}</p>
                </div>

                <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 border border-graphite/30">
                        <button
                            type="button"
                            onClick={() => item.quantity > 1 && updateItem(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={cn(
                                "px-3 py-1.5 text-mono transition-colors",
                                item.quantity <= 1
                                    ? "text-graphite/30 cursor-not-allowed"
                                    : "text-carbon hover:bg-carbon hover:text-bone"
                            )}
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>
                        <span className="text-mono w-5 text-center" aria-label={`Quantity: ${item.quantity}`}>
                            {item.quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-mono text-carbon hover:bg-carbon hover:text-bone transition-colors"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-meta uppercase text-graphite hover:text-carbon transition-colors underline underline-offset-4"
                        aria-label={`Remove ${item.productTitle} from system`}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}
