"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { Package, MapPin, CreditCard, LogOut, ChevronRight, Plus, Trash2, Edit2, User, Loader2, Heart } from "lucide-react";
// import { medusaClient } from "@/lib/medusa/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
// ... unchanged
import { useWishlist } from "@/context/WishlistContext";
import { medusaFetch } from "@/lib/medusa/fetch";

// ... unchanged until WishlistSection related code ... 

export default function AccountPage() {
    const router = useRouter();
    const [customer, setCustomer] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Edit Profile State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ first_name: "", last_name: "", phone: "" });

    // Address State
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({
        first_name: "",
        last_name: "",
        address_1: "",
        city: "",
        postal_code: "",
        phone: "",
        country_code: "in"
    });

    // --- Init ---
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // 1. Fetch Base Customer
                // medusaFetch handles credentials: "include" and valid headers
                const customerRes = await medusaFetch("/store/customers/me", { cache: "no-store" });

                if (customerRes.status === 401) {
                    throw new Error("Unauthorized");
                }

                if (!customerRes.ok) {
                    const errBody = await customerRes.text();
                    console.error("Fetch Customer Failed:", customerRes.status, errBody);
                    throw new Error(`Failed to fetch customer: ${customerRes.status} ${errBody}`);
                }

                const customerResponseBody = await customerRes.json();
                const baseCustomer = customerResponseBody.customer;

                // Initialize customer object with base data
                let finalCustomerData = { ...baseCustomer };
                let ordersData: any[] = [];

                // 2. Fetch Addresses Separately
                try {
                    const addressRes = await medusaFetch("/store/customers/me/addresses", { cache: "no-store" });
                    if (addressRes.ok) {
                        const addrData = await addressRes.json();
                        finalCustomerData.shipping_addresses = addrData.addresses || [];
                    } else {
                        finalCustomerData.shipping_addresses = [];
                    }
                } catch (e) {
                    console.warn("Failed to fetch addresses separate", e);
                    finalCustomerData.shipping_addresses = [];
                }

                // 3. Fetch Orders Separately
                try {
                    // Use medusaFetch to ensure cookies are sent
                    const ordersRes = await medusaFetch("/store/orders?limit=10&offset=0&fields=items,items.variant,items.variant.product", { cache: "no-store" });
                    if (ordersRes.ok) {
                        const oData = await ordersRes.json();
                        ordersData = oData.orders || [];
                    }
                } catch (err) {
                    console.warn("Failed to fetch orders separate", err);
                }

                setCustomer(finalCustomerData);
                setProfileForm({
                    first_name: finalCustomerData.first_name || "",
                    last_name: finalCustomerData.last_name || "",
                    phone: finalCustomerData.phone || ""
                });
                setOrders(ordersData);

            } catch (error: any) {
                // Only log real errors, 401 is expected redirect
                if (error.message !== "Unauthorized") {
                    console.error("Auth check failed:", error);
                }

                if (error.message === "Unauthorized") {
                    localStorage.removeItem("medusa_auth_token");
                    router.replace("/login");
                }
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        try {
            // Correct V2 Logout: DELETE /auth/session destroys the cookie
            await medusaFetch("/auth/session", {
                method: "DELETE",
            }).catch(err => console.warn("Backend logout failed", err));

            localStorage.removeItem("medusa_auth_token");
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed", error);
            localStorage.removeItem("medusa_auth_token");
            window.location.href = "/login";
        }
    };
    // ... unchanged

    // --- Profile Handlers ---
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await medusaFetch("/store/customers/me", {
                method: "POST",
                body: JSON.stringify(profileForm),
            });

            if (!res.ok) throw new Error("Failed to update profile");

            const data = await res.json();
            setCustomer(data.customer);
            setIsEditingProfile(false);
            toast.success("Profile updated successfully");
        } catch (e) {
            toast.error("Failed to update profile");
        }
    };

    // --- Address Handlers ---
    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 1. Create Address
            const res = await medusaFetch("/store/customers/me/addresses", {
                method: "POST",
                body: JSON.stringify({
                    ...addressForm,
                    company: "",
                    address_2: "",
                    province: "",
                    metadata: {}
                }),
            });

            if (!res.ok) throw new Error("Failed to add address");

            // 2. Refetch Customer to get the updated list explicitly
            const customerRes = await medusaFetch("/store/customers/me?expand=billing_address,shipping_addresses", {
                cache: "no-store"
            });

            const customerData = await customerRes.json();
            setCustomer(customerData.customer);

            setIsAddingAddress(false);
            setAddressForm({ first_name: "", last_name: "", address_1: "", city: "", postal_code: "", phone: "", country_code: "in" }); // Reset
            toast.success("Address added");
        } catch (e) {
            console.error(e);
            toast.error("Failed to add address");
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        try {
            const res = await medusaFetch(`/store/customers/me/addresses/${addressId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete address");

            // Refetch Customer
            const customerRes = await medusaFetch("/store/customers/me?expand=billing_address,shipping_addresses", {
                cache: "no-store"
            });

            const customerData = await customerRes.json();
            setCustomer(customerData.customer);

            toast.success("Address removed");
        } catch (e) {
            toast.error("Failed to remove address");
        }
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
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-24">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 mb-4 leading-[0.9]">
                        Overview
                    </h1>
                    <p className="text-zinc-500 text-lg font-medium tracking-tight">This space belongs to you.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

                    {/* LEFT COLUMN: PRIMARY (Orders) - Span 7 */}
                    <div className="lg:col-span-7 space-y-20">
                        {/* Orders */}
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-8">Order History</h2>
                            {orders.length === 0 ? (
                                <div className="p-0 text-left">
                                    <p className="text-zinc-900 font-medium text-lg mb-2">No orders yet.</p>
                                    <Button asChild variant="link" className="text-zinc-500 p-0 h-auto underline underline-offset-4 hover:text-zinc-900">
                                        <Link href="/collections/all">Start Building Your Wardrobe</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="group p-6 bg-white border border-zinc-100 rounded-xl hover:border-zinc-300 transition-colors">
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-6 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-lg text-zinc-900">#{order.display_id}</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-zinc-400 text-xs uppercase tracking-wide">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <p className="font-bold text-zinc-900">
                                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(order.total / 100)}
                                                </p>
                                            </div>
                                            {/* Order Items */}
                                            <div className="pt-4 border-t border-zinc-50">
                                                {order.items.map((item: any) => (
                                                    <div key={item.id} className="text-sm font-medium text-zinc-600">
                                                        {item.title} <span className="text-zinc-300">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Wishlist - Secondary */}
                        <div className="opacity-80 hover:opacity-100 transition-opacity">
                            <WishlistSection />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SECONDARY (Profile & Settings) - Span 5 */}
                    <div className="lg:col-span-5 space-y-16 lg:sticky lg:top-32">

                        {/* Profile Details */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Profile</h3>
                                <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-xs font-bold text-zinc-900 underline underline-offset-4">
                                    Edit
                                </button>
                            </div>

                            {isEditingProfile ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-4 bg-white p-6 rounded-xl border border-zinc-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-zinc-400">First Name</label>
                                            <Input value={profileForm.first_name} onChange={e => setProfileForm({ ...profileForm, first_name: e.target.value })} className="h-10 bg-zinc-50 border-transparent" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-zinc-400">Last Name</label>
                                            <Input value={profileForm.last_name} onChange={e => setProfileForm({ ...profileForm, last_name: e.target.value })} className="h-10 bg-zinc-50 border-transparent" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-zinc-400">Phone</label>
                                        <Input value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="h-10 bg-zinc-50 border-transparent" />
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                        <button type="button" onClick={() => setIsEditingProfile(false)} className="text-xs font-bold text-zinc-400 hover:text-zinc-900">Cancel</button>
                                        <button type="submit" className="text-xs font-bold text-zinc-900 underline underline-offset-4">Save Changes</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-lg font-bold text-zinc-900">{customer.first_name} {customer.last_name}</p>
                                    <p className="text-zinc-500 font-medium">{customer.email}</p>
                                    <p className="text-zinc-500 font-medium">{customer.phone || "No phone added"}</p>
                                </div>
                            )}
                        </div>

                        {/* Addresses */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Addresses</h3>
                                <button onClick={() => setIsAddingAddress(!isAddingAddress)} className="text-xs font-bold text-zinc-900 underline underline-offset-4">
                                    Add New
                                </button>
                            </div>

                            <div className="space-y-6">
                                {customer.shipping_addresses?.map((addr: any) => (
                                    <div key={addr.id} className="relative group">
                                        <p className="font-bold text-zinc-900">{addr.first_name} {addr.last_name}</p>
                                        <p className="text-zinc-500">{addr.address_1}</p>
                                        <p className="text-zinc-500">{addr.city}, {addr.postal_code}</p>
                                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-[10px] font-bold text-red-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                {customer.shipping_addresses?.length === 0 && !isAddingAddress && (
                                    <p className="text-zinc-400 italic">No saved addresses.</p>
                                )}
                            </div>

                            {isAddingAddress && (
                                <form onSubmit={handleAddAddress} className="mt-6 space-y-3 bg-white p-6 rounded-xl border border-zinc-100">
                                    <p className="text-xs font-bold uppercase text-zinc-900 mb-4">New Destination</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input placeholder="First Name" value={addressForm.first_name} onChange={e => setAddressForm({ ...addressForm, first_name: e.target.value })} className="h-10 bg-zinc-50 border-transparent" />
                                        <Input placeholder="Last Name" value={addressForm.last_name} onChange={e => setAddressForm({ ...addressForm, last_name: e.target.value })} className="h-10 bg-zinc-50 border-transparent" />
                                    </div>
                                    <Input placeholder="Address" value={addressForm.address_1} onChange={e => setAddressForm({ ...addressForm, address_1: e.target.value })} className="h-10 bg-zinc-50 border-transparent" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input placeholder="City" value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} className="h-10 bg-zinc-50 border-transparent" />
                                        <Input placeholder="PIN" value={addressForm.postal_code} onChange={e => setAddressForm({ ...addressForm, postal_code: e.target.value })} className="h-10 bg-zinc-50 border-transparent" />
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                        <button type="button" onClick={() => setIsAddingAddress(false)} className="text-xs font-bold text-zinc-400 hover:text-zinc-900">Cancel</button>
                                        <button type="submit" className="text-xs font-bold text-zinc-900 underline underline-offset-4">Save Address</button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Concierge</h3>
                            <Link href="/contact" className="text-lg font-bold text-zinc-900 hover:text-zinc-600 transition-colors">
                                Need assistance?
                            </Link>
                            <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
                                Our team is available Mon-Fri, 9am - 6pm EST for styling advice and order inquiries.
                            </p>
                        </div>

                        <div className="pt-8 border-t border-zinc-200">
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="w-full h-12 rounded-xl border-zinc-200 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-300 flex items-center justify-between px-6 group"
                            >
                                <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
                                <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
