"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { ChevronRight, ShoppingBag, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import useRazorpay from "react-razorpay";

// Types
type CheckoutStep = 1 | 2 | 3; // 1: Info, 2: Shipping, 3: Payment

export default function CheckoutPage() {
    const { items, subtotal, cartId } = useCart();
    const router = useRouter();
    const [step, setStep] = useState<CheckoutStep>(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState({
        first_name: "",
        last_name: "",
        address_1: "",
        address_2: "",
        city: "",
        state: "", // Province
        postal_code: "",
        country_code: "in",
        phone: ""
    });

    // Initial Load - Check for Session
    useEffect(() => {
        // Placeholder auth check
    }, []);

    const currency = "INR";

    // Format price helper
    const formatPrice = (price: number) => {
        return price.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    // --- Actions ---

    const handleInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Stubbed
            setStep(2);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShippingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validation (Basic)
        if (!address.first_name || !address.address_1 || !address.city || !address.postal_code || !address.phone) {
            toast.error("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }

        try {
            // Stubbed
            setStep(3);
        } catch (error: any) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteOrder = async () => {
        setIsLoading(true);
        try {
            toast.info("Checkout disabled during migration.");
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to place order.");
        } finally {
            setIsLoading(false);
        }
    };


    // Removed Razorpay logic completely


    // --- Empty State ---
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
                                className="h-8 w-auto brightness-0"
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
                        <span className={cn(step >= 1 ? "text-zinc-900 font-semibold" : "")}>Information</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className={cn(step >= 2 ? "text-zinc-900 font-semibold" : "")}>Shipping</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className={cn(step >= 3 ? "text-zinc-900 font-semibold" : "")}>Payment</span>
                    </div>

                    {/* STEPS CONTENT */}

                    {/* Step 1: Contact Information */}
                    {step === 1 && (
                        <form onSubmit={handleInfoSubmit} className="space-y-6 mb-8 bg-white animate-in slide-in-from-right-4 duration-300">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-zinc-900">Contact Information</h2>
                                <Link href="/login" className="text-xs text-zinc-500 hover:text-zinc-900 underline">Already have an account? Log in</Link>
                            </div>
                            <input
                                required
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400"
                            />

                            <Button type="submit" disabled={isLoading} size="lg" className="w-full rounded-full h-14 font-bold bg-zinc-900 hover:bg-zinc-800 text-white text-lg shadow-lg mt-6">
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue to Shipping"}
                            </Button>
                        </form>
                    )}

                    {/* Step 2: Shipping Address */}
                    {step === 2 && (
                        <form onSubmit={handleShippingSubmit} className="space-y-6 mb-12 animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-lg font-bold text-zinc-900">Shipping Address</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <input required id="firstName" name="firstName" type="text" placeholder="First name" value={address.first_name} onChange={e => setAddress({ ...address, first_name: e.target.value })} className="col-span-1 w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400" />
                                <input required id="lastName" name="lastName" type="text" placeholder="Last name" value={address.last_name} onChange={e => setAddress({ ...address, last_name: e.target.value })} className="col-span-1 w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400" />
                            </div>

                            <input required id="address1" name="address1" type="text" placeholder="Address" value={address.address_1} onChange={e => setAddress({ ...address, address_1: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400" />

                            <div className="grid grid-cols-3 gap-4">
                                <input required id="city" name="city" type="text" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="col-span-1 w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400" />
                                <input required id="state" name="state" type="text" placeholder="State" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} className="col-span-1 w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400" />
                                <input required id="postalCode" name="postalCode" type="text" placeholder="PIN code" value={address.postal_code} onChange={e => setAddress({ ...address, postal_code: e.target.value })} className="col-span-1 w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400" />
                            </div>

                            <input required id="phone" name="phone" type="tel" placeholder="Phone" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none transition-colors placeholder:text-zinc-400" />

                            <div className="flex gap-4 mt-8">
                                <Button type="button" variant="outline" onClick={() => setStep(1)} className="rounded-full h-14 border-zinc-200">Back</Button>
                                <Button type="submit" disabled={isLoading} size="lg" className="flex-1 rounded-full h-14 font-bold bg-zinc-900 hover:bg-zinc-800 text-white text-lg shadow-lg">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue to Payment"}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                        <div className="space-y-6 mb-12 animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-lg font-bold text-zinc-900">Payment</h2>

                            <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50 mb-6">
                                <p className="font-bold text-sm text-zinc-900 mb-1">Standard Shipping</p>
                                <p className="text-sm text-zinc-500">Your order will be shipped within 1-2 business days.</p>
                            </div>

                            <div className="p-4 border border-zinc-900 bg-zinc-900/5 rounded-xl mb-6">
                                <h3 className="font-bold text-zinc-900 mb-2">Cash on Delivery (Manual)</h3>
                                <p className="text-sm text-zinc-600">Pay when your order is delivered. Simple and secure.</p>
                            </div>

                            <p className="text-xs text-zinc-400 text-center mb-6">
                                By clicking 'Place Order', you agree to our Terms of Service.
                            </p>

                            <div className="flex gap-4">
                                <Button type="button" variant="outline" onClick={() => setStep(2)} className="rounded-full h-14 border-zinc-200">Back</Button>
                                <Button
                                    onClick={handleCompleteOrder}
                                    disabled={isLoading}
                                    size="lg"
                                    className="flex-1 rounded-full h-14 font-bold bg-zinc-900 hover:bg-zinc-800 text-white text-lg shadow-lg"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Place Order"}
                                </Button>
                            </div>
                        </div>
                    )}

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

                    {/* Totals */}
                    <div className="space-y-3 mb-8 pb-8 border-b border-zinc-200/50">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Subtotal</span>
                            <span className="font-medium text-zinc-900">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Shipping</span>
                            <span className="text-xs text-zinc-500 font-medium">{step < 3 ? "Calculated at next step" : "Free"}</span>
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
