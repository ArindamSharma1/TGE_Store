"use client";

import { useEffect, useState } from "react";
import { medusaClient } from "@/lib/medusa/client";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle, Loader2, ShoppingBag } from "lucide-react";
import { useParams } from "next/navigation";

export default function OrderConfirmedPage() {
    const params = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            // In a real app, you might want to protect this or just rely on the ID being hard to guess
            // For simplicity, we just fetch it.
            if (params.id) {
                try {
                    const { order } = await medusaClient.store.orders.retrieve(params.id as string);
                    setOrder(order);
                } catch (e) {
                    console.error("Failed to fetch order", e);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchOrder();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold text-zinc-900 mb-4">Order Not Found</h1>
                <p className="text-zinc-500 mb-8">We couldn't locate the order you're looking for.</p>
                <Button asChild size="lg" className="rounded-full">
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20 px-4">
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-zinc-100 shadow-sm text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-zinc-900 mb-4">
                    Order Confirmed!
                </h1>
                <p className="text-zinc-500 text-lg mb-8">
                    Thank you for your purchase. Your order <span className="font-bold text-zinc-900">#{order.display_id}</span> has been received.
                </p>

                <div className="bg-zinc-50 rounded-2xl p-6 mb-8 text-left">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-900 mb-4">Order Details</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Order Number</span>
                            <span className="font-medium text-zinc-900">#{order.display_id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Date</span>
                            <span className="font-medium text-zinc-900">{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Email</span>
                            <span className="font-medium text-zinc-900">{order.email}</span>
                        </div>
                        <div className="flex justify-between border-t border-zinc-200 pt-3 mt-3">
                            <span className="text-zinc-900 font-bold">Total</span>
                            <span className="font-bold text-zinc-900">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(order.total / 100)}
                            </span>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-zinc-400 mb-8">
                    We've sent a confirmation email to {order.email} with your order details and tracking info.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild variant="outline" size="lg" className="rounded-full h-14 font-bold border-zinc-200">
                        <Link href="/account">View Order History</Link>
                    </Button>
                    <Button asChild size="lg" className="rounded-full h-14 px-8 font-bold bg-zinc-900 text-white">
                        <Link href="/collections/all">Continue Shopping</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
