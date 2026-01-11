"use client";

import { ProductCard } from "@/components/modules/ProductCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Heart } from "lucide-react";

// Mock Wishlist Data - will update it account wise
const WISHLIST_ITEMS = [
    {
        id: "w1",
        title: "Oversized Puffer",
        price: 16400,
        handle: "oversized-puffer",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "w2",
        title: "Technical Cargo Pant",
        price: 8500,
        handle: "technical-cargo-pant",
        image: "https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "w3",
        title: "Signature Utility Jacket",
        price: 12500,
        handle: "signature-utility-jacket",
        image: "https://images.unsplash.com/photo-1551488852-078bd9101521?q=80&w=800&auto=format&fit=crop"
    }
];

export default function WishlistPage() {
    const isEmpty = WISHLIST_ITEMS.length === 0;

    if (isEmpty) {
        return (
            <div className="min-h-screen pt-32 pb-24 px-4 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                <div className="h-20 w-20 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
                    <Heart className="h-10 w-10 text-zinc-400" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 mb-4">
                    Your Wishlist is Empty
                </h1>
                <p className="text-zinc-500 text-lg mb-8">
                    Save items you love to revisit them later.
                </p>
                <Button asChild size="lg" className="rounded-full px-12 h-14 text-base font-bold bg-zinc-900 text-white hover:bg-zinc-800">
                    <Link href="/collections/all">Start Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 bg-zinc-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900 mb-2">
                            Wishlist
                        </h1>
                        <p className="text-zinc-500">
                            {WISHLIST_ITEMS.length} {WISHLIST_ITEMS.length === 1 ? 'Item' : 'Items'} Saved
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12">
                    {WISHLIST_ITEMS.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            title={product.title}
                            price={product.price}
                            currencyCode="INR"
                            handle={product.handle}
                            thumbnail={product.image}
                            images={{ main: product.image, hover: product.image }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
