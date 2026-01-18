"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { ProductCard } from "@/components/modules/ProductCard";

export default function CartPage() {
    const { items, subtotal, removeItem, addItem, checkoutUrl } = useCart();

    // Mock Trending Products for Empty State
    const TRENDING_PRODUCTS = [
        { id: "t1", title: "Heavyweight Box Tee", price: 45, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop", handle: "heavyweight-box-tee" },
        { id: "t2", title: "Technical Cargo Pant", price: 120, img: "https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=800&auto=format&fit=crop", handle: "technical-cargo-pant" },
        { id: "t3", title: "Oversized Puffer", price: 240, img: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800&auto=format&fit=crop", handle: "oversized-puffer" },
        { id: "t4", title: "Mohair Knit Cardigan", price: 160, img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop", handle: "mohair-knit-cardigan" },
    ];

    if (items.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-24 px-4 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12">
                    <div className="h-20 w-20 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
                        <ShoppingBag className="h-10 w-10 text-zinc-400" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 mb-4">
                        Your bag is empty
                    </h1>
                    <p className="text-zinc-500 text-lg mb-8">
                        Looks like you haven't added anything yet.
                    </p>
                    <Button asChild size="lg" className="rounded-full px-12 h-14 text-base font-bold">
                        <Link href="/collections/all">Start Shopping</Link>
                    </Button>
                </div>

                {/* Trending Section */}
                <div className="mt-24 border-t border-zinc-100 pt-16">
                    <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900 mb-8">
                        Trending Now
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {TRENDING_PRODUCTS.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                title={product.title}
                                price={product.price}
                                currencyCode="INR"
                                handle={product.handle}
                                thumbnail={product.img}
                                images={{ main: product.img, hover: product.img }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 max-w-7xl mx-auto">
            <h1 className="text-4xl font-black uppercase tracking-tight text-zinc-900 mb-12">Shopping Bag</h1>

            <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-start">
                {/* Cart Items */}
                <section className="lg:col-span-8 space-y-6">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-6 py-6 border-b border-zinc-100 first:border-t">
                            <Link href={`/products/${item.handle}`} className="relative h-40 w-32 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                                <Image
                                    src={item.image}
                                    alt={item.productTitle}
                                    fill
                                    className="object-cover"
                                />
                            </Link>

                            <div className="flex flex-1 flex-col justify-between py-1">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-zinc-900 leading-tight">
                                            <Link href={`/products/${item.handle}`} className="hover:underline">
                                                {item.productTitle}
                                            </Link>
                                        </h3>
                                        <p className="mt-1 text-sm text-zinc-500">{item.variantTitle}</p>
                                    </div>
                                    <p className="text-lg font-bold text-zinc-900">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(item.price * item.quantity)}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-1">
                                        <p className="text-sm text-zinc-500 font-medium">Qty: {item.quantity}</p>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-sm font-medium text-zinc-400 hover:text-red-600 transition-colors flex items-center gap-2 group"
                                    >
                                        <Trash2 className="w-4 h-4 group-hover:text-red-600" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="pt-6">
                        <Link href="/collections/all" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 hover:text-zinc-600 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    </div>
                </section>

                {/* Cart Summary */}
                <section className="lg:col-span-4 mt-16 lg:mt-0 p-8 bg-zinc-50/80 rounded-3xl border border-zinc-100 sticky top-32">
                    <h2 className="text-xl font-bold uppercase tracking-wide text-zinc-900 mb-6">Order Summary</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-zinc-500">Subtotal</p>
                            <p className="font-bold text-zinc-900">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(subtotal)}
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-zinc-500">Shipping</p>
                            <p className="font-bold text-zinc-900">Calculated at checkout</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-zinc-200 pt-4 mt-4">
                            <p className="text-lg font-black text-zinc-900">Total</p>
                            <p className="text-lg font-black text-zinc-900">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(subtotal)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        {checkoutUrl ? (
                            <Button size="lg" className="w-full h-14 text-base font-bold rounded-full" asChild>
                                <a href={checkoutUrl}>Proceed to Checkout</a>
                            </Button>
                        ) : (
                            <Button size="lg" disabled className="w-full h-14 text-base font-bold rounded-full opacity-50 cursor-not-allowed">
                                Loading Checkout...
                            </Button>
                        )}
                        <p className="mt-4 text-xs text-center text-zinc-400">
                            Secure Checkout - Taxes calculated at next step
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
