"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Package, LogOut, Loader2, MapPin, User, ChevronRight, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { shopifyFetch } from "@/lib/shopify";
import { getCustomerQuery } from "@/lib/shopify/queries";
import { cn } from "@/lib/utils/cn";

export default function AccountPage() {
    const router = useRouter();
    const [customer, setCustomer] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");

    useEffect(() => {
        const fetchCustomer = async () => {
            const token = localStorage.getItem("shopify_customer_token");

            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const data = await shopifyFetch<any>({
                    query: getCustomerQuery,
                    variables: { customerAccessToken: token },
                    cache: 'no-store'
                });

                if (data?.customer) {
                    setCustomer(data.customer);
                    if (data.customer.orders) {
                        setOrders(data.customer.orders.edges.map((e: any) => e.node));
                    }
                } else {
                    localStorage.removeItem("shopify_customer_token");
                    router.push("/login");
                }
            } catch (error) {
                console.error("Failed to fetch customer", error);
                localStorage.removeItem("shopify_customer_token");
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomer();
    }, [router]);

    const handleLogout = async () => {
        localStorage.removeItem("shopify_customer_token");
        toast.success("Logged out successfully");
        router.push("/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 pb-24 px-4 bg-zinc-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    if (!customer) return null;

    return (
        <div className="min-h-screen pt-32 pb-32 px-4 bg-zinc-50">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2 block">My Account</span>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900">
                            Welcome, {customer.firstName}
                        </h1>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="rounded-full border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar / Tabs */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl p-2 border border-zinc-100 shadow-sm sticky top-32">
                            <nav className="flex flex-col gap-1">
                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                                        activeTab === "orders" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                    )}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Order History
                                </button>
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                                        activeTab === "profile" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                    )}
                                >
                                    <User className="w-4 h-4" />
                                    Profile & Addresses
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9">
                        {activeTab === "orders" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold uppercase tracking-tight text-zinc-900 mb-6">Recent Orders</h2>
                                {orders.length === 0 ? (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-zinc-100 shadow-sm">
                                        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Package className="w-8 h-8 text-zinc-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-zinc-900 mb-2">No orders yet</h3>
                                        <p className="text-zinc-500 mb-8 max-w-xs mx-auto">Looks like you haven&apos;t started your collection yet.</p>
                                        <Button asChild className="rounded-full px-8">
                                            <Link href="/collections/all">Start Shopping</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow group">
                                                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-lg text-zinc-900">{order.name}</span>
                                                            <span className={cn(
                                                                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                                order.fulfillmentStatus === "FULFILLED" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"
                                                            )}>
                                                                {order.fulfillmentStatus}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-zinc-400 font-medium">
                                                            Placed on {new Date(order.processedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <div className="text-left md:text-right">
                                                        <p className="font-bold text-lg text-zinc-900">
                                                            {new Intl.NumberFormat('en-IN', {
                                                                style: 'currency',
                                                                currency: order.totalPrice.currencyCode
                                                            }).format(order.totalPrice.amount)}
                                                        </p>
                                                        <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">{order.lineItems.edges.length} Items</p>
                                                    </div>
                                                </div>

                                                {/* Visual Line Items (Preview) */}
                                                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                                    {order.lineItems.edges.map((line: any) => (
                                                        <div key={line.node.title} className="relative w-20 h-24 bg-zinc-100 rounded-lg overflow-hidden shrink-0 border border-zinc-100">
                                                            {line.node.variant?.image?.url ? (
                                                                <Image
                                                                    src={line.node.variant.image.url}
                                                                    alt={line.node.title}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                                    <Package className="w-6 h-6" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "profile" && (
                            <div className="space-y-8">
                                <h2 className="text-xl font-bold uppercase tracking-tight text-zinc-900">Profile & Addresses</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">Personal Info</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-zinc-400 mb-1">Full Name</p>
                                                <p className="font-semibold text-zinc-900">{customer.firstName} {customer.lastName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-400 mb-1">Email Address</p>
                                                <p className="font-semibold text-zinc-900">{customer.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-400 mb-1">Phone</p>
                                                <p className="font-semibold text-zinc-900">{customer.phone || "Not provided"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-32 bg-zinc-50 rounded-full translate-x-1/3 -translate-y-1/3" />
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6 relative z-10">Default Address</h3>

                                        {customer.defaultAddress ? (
                                            <div className="space-y-1 relative z-10">
                                                <p className="font-semibold text-zinc-900 text-lg">{customer.defaultAddress.address1}</p>
                                                {customer.defaultAddress.address2 && <p className="font-medium text-zinc-600">{customer.defaultAddress.address2}</p>}
                                                <p className="text-zinc-500">
                                                    {customer.defaultAddress.city}, {customer.defaultAddress.province}
                                                </p>
                                                <p className="text-zinc-500">{customer.defaultAddress.zip}</p>
                                                <p className="text-zinc-400 font-bold uppercase tracking-wider text-xs mt-4">{customer.defaultAddress.country}</p>
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center relative z-10">
                                                <p className="text-zinc-400 mb-4">No default address set.</p>
                                                <Button variant="outline" size="sm">Add Address</Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
