"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCart, CartItem as CartItemType } from "@/context/CartContext";
import { cn } from "@/lib/utils/cn";

export function CartItem({ item }: { item: CartItemType }) {
    const { removeItem, addItem } = useCart();

    // Helper to re-add item (increment)
    const increment = () => {
        addItem({
            ...item,
            // We don't need these but TS needs them to match type, logic inside provider handles increment
            price: item.price,
            handle: item.handle,
            image: item.image,
            productTitle: item.productTitle
        });
    };

    return (
        <div className="flex gap-4 py-6 border-b border-zinc-100 last:border-0">
            {/* Image */}
            <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border border-zinc-100 bg-zinc-50">
                <Image
                    src={item.image}
                    alt={item.productTitle}
                    fill
                    className="object-cover object-center"
                />
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-zinc-900">
                        <h3>{item.productTitle}</h3>
                        <p className="ml-4">${item.price * item.quantity}</p>
                    </div>
                    {item.variantTitle && (
                        <p className="mt-1 text-sm text-zinc-500">{item.variantTitle}</p>
                    )}
                </div>

                <div className="flex flex-1 items-end justify-between text-sm">
                    {/* Quantity Controls (Simplified for now - just display or basic logic) */}
                    <p className="text-zinc-500">Qty {item.quantity}</p>

                    <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="font-medium text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}
