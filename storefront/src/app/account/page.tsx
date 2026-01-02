"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import Image from "next/image";
import { Package, MapPin, CreditCard, LogOut, ChevronRight } from "lucide-react";

// Mock Order Data
const MOCK_ORDERS = [
    {
        id: "#TGE-1024",
        date: "Dec 28, 2025",
        status: "Delivered",
        total: "₹16,400",
        items: [
            { name: "Oversized Puffer", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop" },
            { name: "Heavyweight Hoodie", image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=200&auto=format&fit=crop" }
        ]
    },
    {
        id: "#TGE-998",
        date: "Nov 15, 2025",
        status: "Processing",
        total: "₹4,500",
        items: [
            { name: "Utility Cargo Pant", image: "https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=200&auto=format&fit=crop" }
        ]
    }
];

import { medusaClient } from "@/lib/medusa/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock Order Data (keep as is)
const MOCK_ORDERS = [... ]; // Logic omitted for brevity, but I will just preserve existing lines if possible? No, I need to fully replace the top part or insert lines.
// Since I can't effectively "preserve" efficiently with replace_file_content if I'm not careful, I will just add the imports and the logic inside the function.

export default function AccountPage() {
    const router = useRouter();
    const [customer, setCustomer] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { customer } = await medusaClient.store.customer.retrieve();
                if (!customer) {
                    throw new Error("Not logged in");
                }
                setCustomer(customer);
            } catch (e) {
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 pb-24 px-4 bg-zinc-50 flex items-center justify-center">
                <div className="animate-pulse">Loading account...</div>
            </div>
        );
    }

    if (!customer) return null;

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 bg-zinc-50">
            {/* ... rest of the component ... */}
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-2">
                            My Account
                        </h1>
                        <p className="text-zinc-500">Welcome back, Arindam.</p>
                    </div>
                    <Button variant="outline" className="rounded-full border-zinc-200 hover:bg-zinc-100 text-zinc-600 gap-2">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content: Orders */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-xl font-bold uppercase tracking-tight text-zinc-900">Recent Orders</h2>

                        <div className="space-y-4">
                            {MOCK_ORDERS.map((order) => (
                                <GlassCard key={order.id} className="p-6 bg-white border-zinc-200">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-lg text-zinc-900">{order.id}</span>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-zinc-500 text-sm">Placed on {order.date}</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="rounded-full border-zinc-200">
                                            View Details
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Order Items Preview */}
                                        <div className="flex -space-x-3 overflow-hidden py-2 pl-1">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="relative w-12 h-12 rounded-full ring-2 ring-white z-10">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover rounded-full"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-medium text-zinc-900">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</p>
                                            <p className="text-zinc-500">Total: {order.total}</p>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar: Details */}
                    <div className="space-y-6">
                        {/* Address Card */}
                        <GlassCard className="p-6 bg-white border-zinc-200">
                            <div className="flex items-center gap-3 mb-4 text-zinc-900">
                                <MapPin className="w-5 h-5" />
                                <h3 className="font-bold uppercase text-sm">Default Address</h3>
                            </div>
                            <div className="text-sm text-zinc-500 space-y-1 mb-6">
                                <p className="font-medium text-zinc-900">Arindam Sharma</p>
                                <p>123 Startup Hub, Block C</p>
                                <p>Bangalore, Karnataka 560001</p>
                                <p>India</p>
                            </div>
                            <Button variant="outline" size="sm" className="w-full rounded-full border-zinc-200">
                                Edit Address
                            </Button>
                        </GlassCard>

                        {/* Payment Card */}
                        <GlassCard className="p-6 bg-white border-zinc-200">
                            <div className="flex items-center gap-3 mb-4 text-zinc-900">
                                <CreditCard className="w-5 h-5" />
                                <h3 className="font-bold uppercase text-sm">Payment Method</h3>
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-6 bg-zinc-100 rounded border border-zinc-200 flex items-center justify-center">
                                    <span className="text-[8px] font-bold">VISA</span>
                                </div>
                                <p className="text-sm text-zinc-500">Ending in 4242</p>
                            </div>
                            <Button variant="outline" size="sm" className="w-full rounded-full border-zinc-200">
                                Manage Cards
                            </Button>
                        </GlassCard>

                        <div className="pt-6 border-t border-zinc-200">
                            <Link href="/contact" className="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-100 transition-colors group">
                                <span className="text-sm font-bold text-zinc-900">Need Help?</span>
                                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
