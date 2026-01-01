"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { ChevronRight, ChevronDown, Lock, ShoppingBag } from "lucide-react"; // Added ShoppingBag for empty state
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export default function CheckoutPage() {
    const { items, subtotal } = useCart();
    const [step, setStep] = useState(1); // 1: Info, 2: Shipping, 3: Payment
    const currency = "INR";
    const currencySymbol = "₹";

    // Format price helper
    const formatPrice = (price: number) => {
        return price.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    // Empty State
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-8 h-8 text-zinc-400" />
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 mb-2">Your cart is empty</h1>
                <p className="text-zinc-500 mb-8 max-w-sm text-center">
                    Looks like you haven&apos;t added anything to your cart yet.
                </p>
                <Link href="/collections/all">
                    <Button size="lg" className="rounded-full px-8 h-12 font-bold bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row">

            {/* LEFT COLUMN: FORM */}
            <div className="w-full lg:w-[58%] px-4 py-8 lg:px-12 lg:pt-12 bg-white order-2 lg:order-1 border-r border-zinc-100">
                <div className="max-w-[600px] ml-auto mr-auto lg:mr-0">
                    {/* Checkout Header */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/">
                            <Image
                                src="/logo-main-white.svg"
                                alt="TGE"
                                width={120}
                                height={36}
                                className="h-8 w-auto brightness-0" // Using brightness-0 to invert white logo to black
                                priority
                            />
                            <span className="sr-only">TGE Store</span>
                        </Link>
                        <Link href="/cart" className="text-sm text-zinc-500 hover:text-zinc-900 underline">
                            Return to Cart
                        </Link>
                    </div>

                    {/* Breadcrumbs */}
                    <div className="flex items-center text-xs font-medium text-zinc-500 mb-10 gap-2">
                        <span className="text-zinc-900 font-semibold">Information</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className={step >= 2 ? "text-zinc-900 font-semibold" : ""}>Shipping</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className={step >= 3 ? "text-zinc-900 font-semibold" : ""}>Payment</span>
                    </div>

                    {/* Step 1: Contact Information */}
                    <div className="space-y-6 mb-8 bg-white">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-zinc-900">Contact Information</h2>
                            <button className="text-xs text-zinc-500 hover:text-zinc-900 underline">Already have an account? Log in</button>
                        </div>
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400"
                        />
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="newsletter" className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black accent-black" />
                            <label htmlFor="newsletter" className="text-sm text-zinc-600 select-none cursor-pointer">Email me with news and offers</label>
                        </div>
                    </div>

                    {/* Step 2: Shipping Address */}
                    <div className="space-y-6 mb-12">
                        <h2 className="text-lg font-bold text-zinc-900">Shipping Address</h2>

                        {/* Country Default */}
                        <div className="relative">
                            <label className="text-xs text-zinc-500 absolute top-2 left-4 z-10 bg-white px-1">Country/Region</label>
                            <select disabled className="w-full h-14 px-4 pt-4 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500 outline-none appearance-none cursor-not-allowed font-medium">
                                <option>India</option>
                            </select>
                            <Lock className="w-4 h-4 text-zinc-400 absolute right-4 top-5" />
                        </div>

                        {/* Full Name */}
                        <input type="text" placeholder="Full name" className="w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400" />

                        {/* Address */}
                        <input type="text" placeholder="Address" className="w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400" />
                        <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400" />

                        {/* City / State / Pin */}
                        <div className="grid grid-cols-3 gap-4">
                            <input type="text" placeholder="City" className="col-span-1 w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400" />

                            <div className="col-span-1 relative">
                                <select className="w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors bg-white appearance-none text-zinc-700 placeholder:text-zinc-400">
                                    <option value="" disabled selected>State</option>
                                    <option>Delhi</option>
                                    <option>Maharashtra</option>
                                    <option>Karnataka</option>
                                    <option>Telangana</option>
                                    <option>West Bengal</option>
                                    <option>Tamil Nadu</option>
                                    <option>Gujarat</option>
                                    <option>Rajasthan</option>
                                    <option>Uttar Pradesh</option>
                                    <option>Other</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-4 pointer-events-none" />
                            </div>

                            <input type="text" placeholder="PIN code" className="col-span-1 w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400" />
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <input type="tel" placeholder="Phone" className="w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400" />
                            <p className="text-xs text-zinc-400 mt-1.5 ml-1">Used for delivery updates</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-zinc-100">
                        <Button size="lg" className="w-full rounded-full h-14 font-bold bg-zinc-900 hover:bg-zinc-800 text-white text-lg shadow-lg">
                            Continue to Shipping
                        </Button>
                        <p className="text-xs text-zinc-500 text-center">Delivery options shown next</p>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: SUMMARY */}
            <div className="w-full lg:w-[42%] bg-zinc-50 border-l border-zinc-200 px-4 py-8 lg:px-12 lg:pt-12 order-1 lg:order-2">
                <div className="max-w-[450px] lg:mr-auto lg:ml-0 sticky top-12">

                    {/* Cart Items */}
                    <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center group">
                                <div className="relative w-16 h-20 rounded-lg border border-gray-200 bg-white overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.productTitle}
                                        fill
                                        className="object-cover"
                                    />
                                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-500/90 text-[11px] font-bold text-white z-10 ring-2 ring-white">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-zinc-900 truncate pr-4">{item.productTitle}</h4>
                                    <p className="text-xs text-zinc-500 capitalize">
                                        {item.variantTitle || 'Standard'}
                                    </p>
                                </div>
                                <p className="text-sm font-medium text-zinc-900 whitespace-nowrap">
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Discount Code - Collapsed */}
                    <div className="mb-8 pb-8 border-b border-zinc-200/50">
                        <details className="group">
                            <summary className="list-none flex items-center justify-between cursor-pointer text-sm text-zinc-500 font-medium hover:text-zinc-900 transition-colors select-none">
                                <span>Have a discount code?</span>
                                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="flex gap-2 mt-4">
                                <input
                                    type="text"
                                    placeholder="Discount code"
                                    className="flex-1 h-12 px-4 rounded-lg border border-zinc-200 bg-white text-sm focus:border-zinc-900 outline-none transition-colors uppercase placeholder:normal-case"
                                />
                                <Button variant="outline" className="h-12 px-6 border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 font-medium">
                                    Apply
                                </Button>
                            </div>
                        </details>
                    </div>

                    {/* Totals */}
                    <div className="space-y-3 mb-8 pb-8 border-b border-zinc-200/50">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Subtotal</span>
                            <span className="font-medium text-zinc-900">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Shipping</span>
                            <span className="text-xs text-zinc-500 font-medium">Calculated at next step</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-6">
                        <span className="text-lg font-bold text-zinc-900">Total</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm text-zinc-500">{currency}</span>
                            <span className="text-3xl font-black text-zinc-900 tracking-tight">{formatPrice(subtotal)}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
