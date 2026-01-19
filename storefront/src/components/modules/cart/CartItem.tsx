"use client";

import Image from "next/image";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart, CartItem as CartItemType } from "@/context/CartContext";
import { cn } from "@/lib/utils/cn";

export function CartItem({ item }: { item: CartItemType }) {
    const { removeItem, addItem, updateItem } = useCart();



    return (
        <div className="flex gap-4 py-6 border-b border-white/5 last:border-0 relative group">
            {/* Image */}
            <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.productTitle}
                        fill
                        className="object-cover object-center"
                    />
                ) : (
                    <ShoppingBag className="w-8 h-8 text-zinc-500" />
                )}
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-bold text-white uppercase tracking-tight">
                        <h3 className="line-clamp-2 pr-4">{item.productTitle}</h3>
                        <p className="flex-shrink-0">
                            {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }).format(item.price * item.quantity)}
                        </p>
                    </div>
                    {item.variantTitle && (
                        <p className="mt-1 text-xs font-medium text-zinc-400 uppercase tracking-wider">{item.variantTitle}</p>
                    )}
                </div>

                <div className="flex flex-1 items-end justify-between text-sm">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 border border-white/10 rounded-full px-3 py-1 bg-white/5">
                        <button
                            type="button"
                            onClick={() => {
                                if (item.quantity > 1) {
                                    updateItem(item.id, item.quantity - 1);
                                }
                            }}
                            className={cn(
                                "text-zinc-400 hover:text-white transition-colors",
                                item.quantity <= 1 && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold tabular-nums w-4 text-center text-white">
                            {item.quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            className="text-zinc-400 hover:text-white transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-wider transition-colors"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}
