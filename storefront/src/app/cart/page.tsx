"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);

export default function CartPage() {
    const { items, subtotal, removeItem, updateItem, checkoutUrl } = useCart();

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-bone text-carbon pt-16">
                <div className="max-w-[1600px] mx-auto px-spacing-component">
                    <div className="pt-spacing-editorial pb-spacing-section-inner border-b border-graphite/20">
                        <p className="text-mono text-acid mb-spacing-component">YOUR SYSTEM</p>
                        <h1 className="text-display-l uppercase leading-none mb-4">Empty</h1>
                        <p className="text-body text-graphite">Nothing in the system yet.</p>
                    </div>

                    <div className="py-spacing-section-gap">
                        <p className="text-mono text-graphite mb-6">START BUILDING YOUR DAILY UNIFORM</p>
                        <div className="flex flex-col gap-3 max-w-xs">
                            {[
                                { label: "New System", href: "/collections/new-system" },
                                { label: "Uniforms", href: "/collections/uniforms" },
                                { label: "Field Notes", href: "/journal" },
                                { label: "All Objects", href: "/collections/all" },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center justify-between py-4 border-b border-graphite/20 text-body uppercase hover:text-acid group transition-colors"
                                >
                                    <span>{link.label}</span>
                                    <span className="text-acid opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-bone text-carbon pt-16">
            <div className="max-w-[1600px] mx-auto px-spacing-component">

                <div className="pt-spacing-section-inner pb-6 border-b border-graphite/20">
                    <p className="text-mono text-acid mb-2">YOUR SYSTEM</p>
                    <h1 className="text-heading uppercase">{items.length.toString().padStart(2, "0")} {items.length === 1 ? "Object" : "Objects"}</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 py-spacing-section-gap">

                    {/* Cart Items */}
                    <section className="lg:col-span-7" aria-label="Cart items">
                        <ul className="divide-y divide-graphite/10">
                            {items.map((item) => (
                                <li key={item.id} className="flex gap-5 py-6 first:pt-0">
                                    {/* Image */}
                                    <Link href={`/products/${item.handle}`} className="relative h-32 w-24 flex-shrink-0 bg-fog overflow-hidden">
                                        {item.image && (
                                            <Image src={item.image} alt={item.productTitle} fill className="object-cover" />
                                        )}
                                    </Link>

                                    {/* Details */}
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between gap-4">
                                            <div>
                                                <Link href={`/products/${item.handle}`} className="text-body font-medium uppercase hover:text-acid transition-colors">
                                                    {item.productTitle}
                                                </Link>
                                                {item.variantTitle && (
                                                    <p className="text-mono text-graphite mt-0.5">{item.variantTitle}</p>
                                                )}
                                            </div>
                                            <p className="text-mono flex-shrink-0">{formatINR(item.price * item.quantity)}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {/* Quantity */}
                                            <div className="flex items-center border border-graphite/30">
                                                <button
                                                    onClick={() => item.quantity > 1 && updateItem(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className={cn("px-3 py-1.5 text-mono transition-colors", item.quantity <= 1 ? "text-graphite/30 cursor-not-allowed" : "hover:bg-carbon hover:text-bone")}
                                                    aria-label="Decrease quantity"
                                                >−</button>
                                                <span className="px-3 py-1.5 text-mono border-x border-graphite/30 min-w-[2.5rem] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateItem(item.id, item.quantity + 1)}
                                                    className="px-3 py-1.5 text-mono hover:bg-carbon hover:text-bone transition-colors"
                                                    aria-label="Increase quantity"
                                                >+</button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-meta uppercase text-graphite hover:text-carbon transition-colors underline underline-offset-4"
                                                aria-label={`Remove ${item.productTitle}`}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8">
                            <Link href="/collections/all" className="text-meta uppercase text-graphite hover:text-carbon transition-colors underline underline-offset-4">
                                Continue building your system
                            </Link>
                        </div>
                    </section>

                    {/* Order Summary */}
                    <section className="lg:col-span-5 sticky top-20 h-fit border-t border-graphite/20 pt-6" aria-label="Order summary">
                        <h2 className="text-heading uppercase mb-6">Summary</h2>

                        <div className="flex flex-col gap-3 mb-6">
                            <div className="flex justify-between text-mono">
                                <span className="text-graphite">Subtotal</span>
                                <span>{formatINR(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-mono">
                                <span className="text-graphite">Delivery</span>
                                <span className="text-graphite">Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between border-t border-graphite/20 pt-3 mt-1">
                                <span className="text-body font-medium uppercase">Total</span>
                                <span className="text-heading">{formatINR(subtotal)}</span>
                            </div>
                        </div>

                        {checkoutUrl ? (
                            <a href={checkoutUrl}>
                                <button className="w-full bg-carbon text-bone py-4 text-meta uppercase tracking-widest hover:bg-acid hover:text-carbon transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid">
                                    Proceed to Checkout
                                </button>
                            </a>
                        ) : (
                            <button disabled className="w-full bg-fog text-graphite py-4 text-meta uppercase tracking-widest cursor-not-allowed" aria-busy="true">
                                Preparing Checkout…
                            </button>
                        )}

                        <p className="text-mono text-graphite/60 mt-3 text-center">All taxes included. Free returns within 30 days.</p>

                        {/* Recommendations */}
                        <div className="mt-spacing-section-inner border-t border-graphite/20 pt-6">
                            <p className="text-mono text-graphite mb-4">COMPLETE THE SHIFT</p>
                            <div className="flex flex-col gap-2">
                                {["Add a layer", "Same material, different form", "After-hours alternative"].map((rec) => (
                                    <Link key={rec} href="/collections/all" className="text-meta uppercase text-graphite hover:text-acid transition-colors underline underline-offset-4">
                                        {rec}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        </main>
    );
}
