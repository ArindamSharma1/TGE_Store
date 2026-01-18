"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function OrderConfirmedPage() {
    const params = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Stub: Emulate successful load or display static success
        setTimeout(() => {
            // Mock Order for display
            setOrder({
                display_id: params.id || "1001",
                created_at: new Date().toISOString(),
                email: "demo@tge.store",
                total: 0 // Mock
            });
            setLoading(false);
        }, 1000);
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
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="rounded-full h-14 px-8 font-bold bg-zinc-900 text-white">
                        <Link href="/collections/all">Continue Shopping</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

