"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { X, ShoppingBag } from "lucide-react";
import { CartItem } from "./CartItem";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";

export function CartDrawer() {
    const { isOpen, closeCart, items, subtotal, checkoutUrl } = useCart();

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
                        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-zinc-950/90 backdrop-blur-xl shadow-2xl border-l border-white/5"
                    >
                        {/* Noise Overlay */}
                        <div
                            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.05] z-0"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`
                            }}
                        />

                        {/* Header */}
                        <div className="relative z-10 flex items-center justify-between px-6 py-6 border-b border-white/10">
                            <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                                Bag ({items.length})
                            </h2>
                            <Button variant="ghost" size="icon" onClick={closeCart} className="rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                                <X className="h-6 w-6" aria-hidden="true" />
                            </Button>
                        </div>

                        {/* Items List */}
                        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                            {items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center space-y-6 text-center">
                                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                        <ShoppingBag className="h-8 w-8 text-zinc-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xl font-bold text-white uppercase tracking-tight">Empty Bag</p>
                                        <p className="text-zinc-500 max-w-[200px] mx-auto text-sm">
                                            Your uniform is waiting. Start building your wardrobe.
                                        </p>
                                    </div>
                                    <Button onClick={closeCart} variant="outline" className="mt-8 rounded-full border-white/10 text-white hover:bg-white hover:text-black transition-colors font-bold uppercase tracking-wide px-8 h-12">
                                        Shop All
                                    </Button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-white/5">
                                    {items.map((item) => (
                                        <li key={item.id} className="py-6 first:pt-0">
                                            <CartItem item={item} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer / Checkout */}
                        {items.length > 0 && (
                            <div className="relative z-10 border-t border-white/10 px-6 py-8 bg-black/20">
                                <div className="flex justify-between items-end text-white mb-6">
                                    <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Subtotal</p>
                                    <p className="text-2xl font-black tracking-tight">
                                        {new Intl.NumberFormat('en-IN', {
                                            style: 'currency',
                                            currency: 'INR',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(subtotal)}
                                    </p>
                                </div>
                                <div className="mt-6">
                                    {checkoutUrl ? (
                                        <a href={checkoutUrl}>
                                            <Button
                                                size="lg"
                                                className="w-full rounded-full bg-white text-black hover:bg-zinc-200 h-16 font-bold text-sm uppercase tracking-widest transition-transform hover:scale-[1.02]"
                                            >
                                                Proceed to Checkout
                                            </Button>
                                        </a>
                                    ) : (
                                        <Button
                                            size="lg"
                                            disabled
                                            className="w-full rounded-full bg-zinc-800 text-zinc-500 h-16 font-bold text-sm uppercase tracking-widest cursor-not-allowed opacity-50"
                                        >
                                            Loading Checkout...
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
