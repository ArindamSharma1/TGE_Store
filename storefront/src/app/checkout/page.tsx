import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { User, Lock } from "lucide-react";

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Checkout Header */}
            <header className="border-b border-border bg-pure-white py-6">
                <div className="mx-auto max-w-7xl px-4 flex justify-between items-center">
                    <Link href="/" className="font-satoshi text-2xl font-bold tracking-widest uppercase text-charcoal-black">
                        TGE STORE
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-secondary-text">
                        <Lock className="w-4 h-4" />
                        <span>Secure Checkout</span>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-12 lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                {/* Order Details (Right column on desktop, but typically we want steps on left and summary on right. Keeping simple.) */}

                <div className="space-y-12">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-charcoal-black">Contact Information</h2>
                            <Link href="/login" className="text-sm text-secondary-text hover:underline flex items-center gap-1">
                                <User className="h-4 w-4" /> Log in
                            </Link>
                        </div>
                        <div className="space-y-4">
                            <input type="email" placeholder="Email address" className="w-full h-12 px-4 border border-border bg-white rounded-none focus:outline-none focus:border-charcoal-black" />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-medium text-charcoal-black mb-4">Shipping Address</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <input type="text" placeholder="First Name" className="w-full h-12 px-4 border border-border bg-white rounded-none focus:outline-none focus:border-charcoal-black" />
                            <input type="text" placeholder="Last Name" className="w-full h-12 px-4 border border-border bg-white rounded-none focus:outline-none focus:border-charcoal-black" />
                            <input type="text" placeholder="Address" className="col-span-2 w-full h-12 px-4 border border-border bg-white rounded-none focus:outline-none focus:border-charcoal-black" />
                            <input type="text" placeholder="Apartment, suite, etc." className="col-span-2 w-full h-12 px-4 border border-border bg-white rounded-none focus:outline-none focus:border-charcoal-black" />
                            <input type="text" placeholder="City" className="w-full h-12 px-4 border border-border bg-white rounded-none focus:outline-none focus:border-charcoal-black" />
                            <input type="text" placeholder="Postal Code" className="w-full h-12 px-4 border border-border bg-white rounded-none focus:outline-none focus:border-charcoal-black" />
                            <input type="text" placeholder="Country" className="col-span-2 w-full h-12 px-4 border border-border bg-white rounded-none focus:outline-none focus:border-charcoal-black" />
                            <input type="text" placeholder="Phone" className="col-span-2 w-full h-12 px-4 border border-border bg-white rounded-none focus:outline-none focus:border-charcoal-black" />
                        </div>
                    </section>

                    <div className="pt-6">
                        <Button size="lg" className="w-full h-14 text-lg">Continue to Payment</Button>
                    </div>
                </div>

                {/* Order Summary Summary (Sidebar) */}
                <div className="mt-12 lg:mt-0 bg-gray-50 p-8 rounded-lg h-fit">
                    <h3 className="text-lg font-medium text-charcoal-black mb-6">Order Summary</h3>

                    {/* Mock items */}
                    <div className="flow-root">
                        <ul className="-my-6 divide-y divide-border">
                            <li className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border">
                                    <div className="h-full w-full bg-gray-200"></div>
                                </div>
                                <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-charcoal-black">
                                            <h3>Mock Product</h3>
                                            <p>$45.00</p>
                                        </div>
                                        <p className="mt-1 text-sm text-secondary-text">White / M</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="border-t border-border mt-6 pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-secondary-text">Subtotal</p>
                            <p className="text-sm font-medium text-charcoal-black">$45.00</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-secondary-text">Shipping</p>
                            <p className="text-sm font-medium text-charcoal-black">Calculated at next step</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-border pt-4">
                            <p className="text-base font-bold text-charcoal-black">Total</p>
                            <p className="text-base font-bold text-charcoal-black">$45.00</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
