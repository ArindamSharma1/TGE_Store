"use client";

import Image from "next/image";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart, CartItem as CartItemType } from "@/context/CartContext";
import { cn } from "@/lib/utils/cn";

export function CartItem({ item }: { item: CartItemType }) {
    const { removeItem, addItem, updateItem } = useCart();



    return (
        <div className="flex gap-4 py-6 border-b border-zinc-100 last:border-0">
            {/* Image */}
            <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border border-zinc-100 bg-zinc-50 flex items-center justify-center">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.productTitle}
                        fill
                        className="object-cover object-center"
                    />
                ) : (
                    <ShoppingBag className="w-8 h-8 text-zinc-300" />
                )}
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-zinc-900">
                        <h3>{item.productTitle}</h3>
                        <p className="ml-4">
                            {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }).format(item.price * item.quantity)}
                        </p>
                    </div>
                    {item.variantTitle && (
                        <p className="mt-1 text-sm text-zinc-500">{item.variantTitle}</p>
                    )}
                </div>

                <div className="flex flex-1 items-end justify-between text-sm">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 border border-zinc-200 rounded-full px-3 py-1">
                        <button
                            type="button"
                            onClick={() => {
                                if (item.quantity > 1) {
                                    updateItem(item.id, item.quantity - 1);
                                }
                            }}
                            className={cn(
                                "text-zinc-500 hover:text-zinc-900 transition-colors",
                                item.quantity <= 1 && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold tabular-nums w-4 text-center">
                            {item.quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            className="text-zinc-500 hover:text-zinc-900 transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="font-medium text-zinc-400 hover:text-red-500 transition-colors"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}
