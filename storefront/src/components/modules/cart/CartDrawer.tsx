"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { X, ShoppingBag } from "lucide-react";
import { CartItem } from "./CartItem";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";

export function CartDrawer() {
    const { isOpen, closeCart, items, subtotal } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        onClick={closeCart}
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-zinc-100">
                            <h2 className="text-lg font-bold uppercase tracking-wide text-zinc-900">
                                Shopping Bag ({items.length})
                            </h2>
                            <Button variant="ghost" size="icon" onClick={closeCart} className="rounded-full">
                                <X className="h-6 w-6" aria-hidden="true" />
                            </Button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                            {items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                                    <div className="h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center">
                                        <ShoppingBag className="h-8 w-8 text-zinc-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold text-zinc-900">Your bag is empty</p>
                                        <p className="text-zinc-500 max-w-xs mx-auto">
                                            Looks like you haven't added anything yet. Start browsing to find your new fit.
                                        </p>
                                    </div>
                                    <Button onClick={closeCart} variant="outline" className="mt-4 rounded-full border-zinc-200">
                                        Continue Shopping
                                    </Button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-zinc-100">
                                    {items.map((item) => (
                                        <li key={item.id}>
                                            <CartItem item={item} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer / Checkout */}
                        {items.length > 0 && (
                            <div className="border-t border-zinc-100 px-4 py-6 sm:px-6 bg-zinc-50/50">
                                <div className="flex justify-between text-base font-bold text-zinc-900 mb-4">
                                    <p>Subtotal</p>
                                    <p>${subtotal.toFixed(2)}</p>
                                </div>
                                <p className="mt-0.5 text-sm text-zinc-500 mb-6">
                                    Shipping and taxes calculated at checkout.
                                </p>
                                <div className="mt-6">
                                    <Button
                                        size="lg"
                                        className="w-full rounded-full bg-zinc-900 hover:bg-zinc-800 text-white h-14 font-bold text-lg"
                                    >
                                        Checkout
                                    </Button>
                                </div>
                                <div className="mt-6 flex justify-center text-center text-sm text-zinc-500">
                                    <p>
                                        or{" "}
                                        <button
                                            type="button"
                                            className="font-medium text-zinc-900 hover:text-zinc-700"
                                            onClick={closeCart}
                                        >
                                            Continue Shopping
                                            <span aria-hidden="true"> &rarr;</span>
                                        </button>
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
