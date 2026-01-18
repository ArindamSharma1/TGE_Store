"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { toast } from "sonner";
import { Package, LogOut, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { shopifyFetch } from "@/lib/shopify";
import { getCustomerQuery } from "@/lib/shopify/queries";

export default function AccountPage() {
    const router = useRouter();
    const [customer, setCustomer] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
                    // Map orders
                    if (data.customer.orders) {
                        setOrders(data.customer.orders.edges.map((e: any) => e.node));
                    }
                } else {
                    // Token might be invalid/expired
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
                <span className="ml-2 text-zinc-400">Verifying account...</span>
            </div>
        );
    }

    if (!customer) return null;

    return (
        <div className="min-h-screen pt-32 pb-32 px-4 bg-zinc-50">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tight text-zinc-900 mb-2">My Account</h1>
                        <p className="text-zinc-500">Welcome back, {customer.firstName || 'Customer'}</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="rounded-full border-zinc-200">
                        <LogOut className="w-4 h-4 mr-2" />
                        Log out
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Orders */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-zinc-100 rounded-full">
                                    <Package className="w-6 h-6 text-zinc-900" />
                                </div>
                                <h2 className="text-xl font-bold uppercase tracking-wide text-zinc-900">Order History</h2>
                            </div>

                            {orders.length === 0 ? (
                                <div className="text-center py-12 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
                                    <p className="text-zinc-500 mb-4">You haven&apos;t placed any orders yet.</p>
                                    <Button asChild className="rounded-full">
                                        <Link href="/collections/all">Start Shopping</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="block group p-6 rounded-2xl border border-zinc-100 hover:border-zinc-300 transition-colors bg-white">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-zinc-900">Order #{order.orderNumber}</span>
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600 uppercase">
                                                            {order.fulfillmentStatus}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-zinc-500">
                                                        {new Date(order.processedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="font-bold text-zinc-900">
                                                            {new Intl.NumberFormat('en-IN', {
                                                                style: 'currency',
                                                                currency: order.totalPrice.currencyCode
                                                            }).format(order.totalPrice.amount)}
                                                        </p>
                                                        <p className="text-xs text-zinc-500 uppercase">{order.financialStatus}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right: Profile */}
                    <div className="space-y-8">
                        <section className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-zinc-100 rounded-full">
                                    <MapPin className="w-6 h-6 text-zinc-900" />
                                </div>
                                <h2 className="text-xl font-bold uppercase tracking-wide text-zinc-900">Details</h2>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div className="p-4 bg-zinc-50 rounded-xl">
                                    <p className="font-bold text-zinc-900 mb-1">{customer.firstName} {customer.lastName}</p>
                                    <p className="text-zinc-500">{customer.email}</p>
                                    <p className="text-zinc-500">{customer.phone}</p>
                                </div>

                                {customer.defaultAddress && (
                                    <div className="p-4 bg-zinc-50 rounded-xl">
                                        <p className="font-bold text-zinc-900 mb-2">Default Address</p>
                                        <p className="text-zinc-500">{customer.defaultAddress.address1}</p>
                                        {customer.defaultAddress.address2 && <p className="text-zinc-500">{customer.defaultAddress.address2}</p>}
                                        <p className="text-zinc-500">
                                            {customer.defaultAddress.city}, {customer.defaultAddress.province} {customer.defaultAddress.zip}
                                        </p>
                                        <p className="text-zinc-500">{customer.defaultAddress.country}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
