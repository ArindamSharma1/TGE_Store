"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { X } from "lucide-react";
import { CartItem } from "./CartItem";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export function CartDrawer() {
    const { isOpen, closeCart, items, subtotal, checkoutUrl } = useCart();

    const formattedSubtotal = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(subtotal);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-carbon/40 z-50"
                        onClick={closeCart}
                        aria-hidden="true"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-bone border-l border-graphite/20"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Your system"
                    >
                        {/* Header */}
                        <div className="flex items-baseline justify-between px-6 py-5 border-b border-graphite/20">
                            <div>
                                <p className="text-mono text-graphite mb-1">YOUR SYSTEM</p>
                                <h2 className="text-heading uppercase">
                                    {items.length === 0 ? "Empty" : `${items.length.toString().padStart(2, "0")} ${items.length === 1 ? "Object" : "Objects"}`}
                                </h2>
                            </div>
                            <button
                                onClick={closeCart}
                                className="text-meta uppercase text-graphite hover:text-carbon transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid p-1"
                                aria-label="Close cart"
                            >
                                Close
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            {items.length === 0 ? (
                                // Empty State — give destination routes, not a dead end
                                <div className="flex flex-col h-full justify-center">
                                    <p className="text-display-m uppercase mb-spacing-component text-graphite/50">
                                        —
                                    </p>
                                    <p className="text-heading uppercase mb-4">
                                        Nothing in the system yet.
                                    </p>
                                    <p className="text-body text-graphite mb-spacing-section-inner">
                                        Start building your daily uniform.
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        {[
                                            { label: "New System", href: "/collections/new-system" },
                                            { label: "Uniforms", href: "/collections/uniforms" },
                                            { label: "Field Notes", href: "/journal" },
                                            { label: "All Objects", href: "/collections/all" },
                                        ].map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={closeCart}
                                                className="flex items-center justify-between py-3 border-b border-graphite/20 text-meta uppercase hover:text-acid group transition-colors"
                                            >
                                                <span>{link.label}</span>
                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-acid">→</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <ul className="divide-y divide-graphite/10" aria-label="Cart items">
                                        {items.map((item) => (
                                            <li key={item.id} className="py-5 first:pt-0">
                                                <CartItem item={item} />
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Recommendations */}
                                    <div className="mt-8 pt-6 border-t border-graphite/20">
                                        <p className="text-mono text-graphite mb-4">COMPLETE THE SHIFT</p>
                                        <div className="flex flex-col gap-2">
                                            {["Add a layer", "Same material, different form", "After-hours alternative"].map((rec) => (
                                                <Link
                                                    key={rec}
                                                    href="/collections/all"
                                                    onClick={closeCart}
                                                    className="text-meta uppercase text-graphite hover:text-acid transition-colors underline underline-offset-4"
                                                >
                                                    {rec}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer — only shown with items */}
                        {items.length > 0 && (
                            <div className="border-t border-graphite/20 px-6 py-6 bg-chalk">
                                <div className="flex justify-between items-baseline mb-1">
                                    <p className="text-mono text-graphite">SUBTOTAL</p>
                                    <p className="text-heading">{formattedSubtotal}</p>
                                </div>
                                <p className="text-mono text-graphite/60 mb-spacing-component">
                                    Delivery calculated at checkout
                                </p>

                                {checkoutUrl ? (
                                    <a href={checkoutUrl} className="block">
                                        <button className="w-full bg-carbon text-bone py-4 text-meta uppercase tracking-widest hover:bg-acid hover:text-carbon transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid">
                                            Proceed to Checkout
                                        </button>
                                    </a>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full bg-fog text-graphite py-4 text-meta uppercase tracking-widest cursor-not-allowed"
                                        aria-busy="true"
                                    >
                                        Preparing Checkout…
                                    </button>
                                )}

                                <Link
                                    href="/cart"
                                    onClick={closeCart}
                                    className="block text-center mt-3 text-meta uppercase text-graphite hover:text-carbon transition-colors underline underline-offset-4"
                                >
                                    View Full System
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
