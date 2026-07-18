"use client";

import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/modules/ProductCard";
import Link from "next/link";

export default function WishlistPage() {
    const { items, removeFromWishlist } = useWishlist();

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-bone text-carbon pt-16">
                <div className="max-w-[1600px] mx-auto px-spacing-component">
                    <div className="pt-spacing-editorial pb-spacing-section-inner border-b border-graphite/20">
                        <p className="text-mono text-acid mb-spacing-component">YOUR SAVES</p>
                        <h1 className="text-display-l uppercase leading-none mb-4">Saved Objects</h1>
                        <p className="text-body text-graphite">No objects saved yet.</p>
                    </div>
                    <div className="py-spacing-section-gap">
                        <p className="text-mono text-graphite mb-6">START EXPLORING</p>
                        <div className="flex flex-col gap-3 max-w-xs">
                            {[
                                { label: "New System", href: "/collections/new-system" },
                                { label: "Uniforms", href: "/collections/uniforms" },
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
                    <p className="text-mono text-acid mb-2">YOUR SAVES</p>
                    <h1 className="text-heading uppercase">
                        {items.length.toString().padStart(2, "0")} {items.length === 1 ? "Object" : "Objects"} Saved
                    </h1>
                </div>

                <div className="py-spacing-section-gap grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-spacing-component gap-y-12">
                    {items.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            title={product.title}
                            price={product.price ?? 0}
                            currencyCode="INR"
                            handle={product.handle}
                            objectImage={product.thumbnail}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
