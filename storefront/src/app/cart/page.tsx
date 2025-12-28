import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

// Mock Cart Data
const MOCK_CART_ITEMS = [
    {
        id: "1",
        title: "Oversized Cotton T-Shirt",
        price: 45,
        size: "M",
        color: "White",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop"
    },
    {
        id: "2",
        title: "Slim Fit Denim Jeans",
        price: 120,
        size: "32",
        color: "Blue",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=2070&auto=format&fit=crop"
    }
];

export default function CartPage() {
    const subtotal = MOCK_CART_ITEMS.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 0; // Free
    const total = subtotal + shipping;

    return (
        <>
            <Header />
            <main className="pb-24 pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[60vh]">
                <h1 className="text-3xl font-bold font-satoshi uppercase tracking-wide mb-12 text-center md:text-left">Shopping Bag</h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
                    {/* Cart Items */}
                    <section className="lg:col-span-8 space-y-8">
                        {MOCK_CART_ITEMS.map((item) => (
                            <div key={item.id} className="flex gap-6 border-b border-border pb-8 last:border-0">
                                <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-gray-100 rounded-sm">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="text-base font-medium text-charcoal-black">
                                                <Link href={`/products/test-product`}>{item.title}</Link>
                                            </h3>
                                            <p className="mt-1 text-sm text-secondary-text">{item.color} / {item.size}</p>
                                        </div>
                                        <p className="text-sm font-bold text-charcoal-black">${item.price}</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 border border-border px-2 py-1">
                                            <button className="px-2 text-secondary-text hover:text-charcoal-black">-</button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button className="px-2 text-secondary-text hover:text-charcoal-black">+</button>
                                        </div>
                                        <button className="text-sm font-medium text-red-500 hover:text-red-600">Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Cart Summary */}
                    <section className="lg:col-span-4 mt-16 lg:mt-0 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
                        <h2 className="text-lg font-medium text-charcoal-black mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-secondary-text">Subtotal</p>
                                <p className="text-sm font-medium text-charcoal-black">${subtotal}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-secondary-text">Shipping</p>
                                <p className="text-sm font-medium text-charcoal-black">{shipping === 0 ? "Free" : `$${shipping}`}</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-border pt-4">
                                <p className="text-base font-bold text-charcoal-black">Total</p>
                                <p className="text-base font-bold text-charcoal-black">${total}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button size="lg" className="w-full" asChild>
                                <Link href="/checkout">Checkout</Link>
                            </Button>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
