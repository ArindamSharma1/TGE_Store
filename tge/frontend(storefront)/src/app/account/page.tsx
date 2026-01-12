"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { Package, MapPin, CreditCard, LogOut, ChevronRight, Plus, Trash2, Edit2, User, Loader2, Heart } from "lucide-react";
import { medusaClient } from "@/lib/medusa/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { useWishlist } from "@/context/WishlistContext";
// import { logoutAction } from "@/app/actions/auth";


function WishlistSection() {
    const { items, removeFromWishlist } = useWishlist();

    if (items.length === 0) return null;

    return (
        <section>
            <h2 className="text-xl font-bold uppercase tracking-tight text-zinc-900 mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                My Wishlist
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => (
                    <GlassCard key={item.id} className="p-4 bg-white border-zinc-200 relative group flex gap-4">
                        <div className="relative w-20 h-24 flex-shrink-0 bg-zinc-100 rounded-md overflow-hidden">
                            <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col justify-between flex-1 py-1">
                            <div>
                                <Link href={`/products/${item.handle}`} className="font-bold text-zinc-900 hover:underline line-clamp-1">
                                    {item.title}
                                </Link>
                                <p className="text-sm font-medium text-zinc-500">
                                    {item.price ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price) : "Price Varies"}
                                </p>
                            </div>
                            <Button asChild size="sm" className="w-fit h-8 text-xs rounded-full bg-zinc-900 text-white">
                                <Link href={`/products/${item.handle}`}>View Product</Link>
                            </Button>
                        </div>
                        <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </GlassCard>
                ))}
            </div>
        </section>
    );
}

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
                // Determine backend URL
                const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
                const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

                const res = await fetch(`${BACKEND_URL}/store/customers/me?expand=billing_address,shipping_addresses,orders,orders.items`, {
                    headers: {
                        "Content-Type": "application/json",
                        "x-publishable-api-key": PUBLISHABLE_KEY!,
                    },
                    credentials: "include", // REQUIRED
                });

                if (!res.ok) {
                    throw new Error("Unauthorized");
                }

                const data = await res.json();
                const customerData = data.customer;

                setCustomer(customerData);
                setProfileForm({
                    first_name: customerData.first_name || "",
                    last_name: customerData.last_name || "",
                    phone: customerData.phone || ""
                });
                setOrders(customerData.orders || []);
            } catch (error) {
                console.error("Auth check failed:", error);
                router.replace("/login");
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        try {
            const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
            const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

            await fetch(`${BACKEND_URL}/auth/customer/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "x-publishable-api-key": PUBLISHABLE_KEY!,
                },
            });

            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed", error);
            // Even if the fetch fails, force redirect to login to clear client state
            window.location.href = "/login";
        }
    };

    // --- Profile Handlers ---
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const client = medusaClient;
            const { customer } = await client.store.customer.update(profileForm);
            setCustomer(customer);
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
            const client = medusaClient;
            // 1. Create Address
            await client.store.customer.createAddress({
                ...addressForm,
                company: "",
                address_2: "",
                province: "",
                metadata: {}
            });

            // 2. Refetch Customer to get the updated list explicitly
            const { customer: freshCustomer } = await client.store.customer.retrieve();

            setCustomer(freshCustomer);
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
            const client = medusaClient;
            await client.store.customer.deleteAddress(addressId);

            // Refetch Customer
            const { customer: freshCustomer } = await client.store.customer.retrieve();

            setCustomer(freshCustomer);
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
        <div className="min-h-screen pt-32 pb-24 px-4 bg-zinc-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-2">
                            My Account
                        </h1>
                        <p className="text-zinc-500">Welcome back, {customer.first_name || "Guest"}.</p>
                    </div>
                    <Button
                        variant="outline"
                        className="rounded-full border-zinc-200 hover:bg-zinc-100 text-zinc-600 gap-2"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content: Orders */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold uppercase tracking-tight text-zinc-900 mb-6">Order History</h2>
                            {orders.length === 0 ? (
                                <div className="p-8 border border-dashed border-zinc-200 rounded-2xl text-center">
                                    <Package className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                                    <p className="text-zinc-500 font-medium">No orders yet</p>
                                    <Button asChild variant="link" className="text-zinc-900">
                                        <Link href="/collections/all">Start Shopping</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <GlassCard key={order.id} className="p-6 bg-white border-zinc-200">
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-lg text-zinc-900">#{order.display_id}</span>
                                                        <span className={
                                                            `px-3 py-1 text-xs font-bold rounded-full uppercase 
                                                            ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`
                                                        }>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-zinc-500 text-sm">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-zinc-900">
                                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(order.total / 100)}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Order Items Simple List */}
                                            <div className="space-y-2 border-t border-zinc-100 pt-4">
                                                {order.items.map((item: any) => (
                                                    <div key={item.id} className="flex justify-between text-sm">
                                                        <span className="text-zinc-600">{item.title} (x{item.quantity})</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassCard>
                                    ))}
                                </div>
                            )}

                        </section>

                        {/* Wishlist Section */}
                        <WishlistSection />
                    </div>

                    {/* Sidebar: Profile & Settings */}
                    <div className="space-y-6">

                        {/* 1. Profile Details */}
                        <GlassCard className="p-6 bg-white border-zinc-200">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3 text-zinc-900">
                                    <User className="w-5 h-5" />
                                    <h3 className="font-bold uppercase text-sm">Profile</h3>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                                    className="h-8 w-8 p-0 rounded-full hover:bg-zinc-100"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                            </div>

                            {isEditingProfile ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-zinc-500">First Name</label>
                                            <Input value={profileForm.first_name} onChange={e => setProfileForm({ ...profileForm, first_name: e.target.value })} className="h-9" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-zinc-500">Last Name</label>
                                            <Input value={profileForm.last_name} onChange={e => setProfileForm({ ...profileForm, last_name: e.target.value })} className="h-9" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-zinc-500">Phone</label>
                                        <Input value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="h-9" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingProfile(false)} className="flex-1 rounded-full text-xs">Cancel</Button>
                                        <Button type="submit" size="sm" className="flex-1 rounded-full bg-zinc-900 text-white text-xs">Save</Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-sm text-zinc-600 space-y-1">
                                    <p><span className="text-zinc-400">Name:</span> {customer.first_name} {customer.last_name}</p>
                                    <p><span className="text-zinc-400">Email:</span> {customer.email}</p>
                                    <p><span className="text-zinc-400">Phone:</span> {customer.phone || "-"}</p>
                                </div>
                            )}
                        </GlassCard>

                        {/* 2. Addresses */}
                        <GlassCard className="p-6 bg-white border-zinc-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3 text-zinc-900">
                                    <MapPin className="w-5 h-5" />
                                    <h3 className="font-bold uppercase text-sm">Addresses</h3>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                                    className="h-8 w-8 p-0 rounded-full hover:bg-zinc-100"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {customer.shipping_addresses?.map((addr: any) => (
                                    <div key={addr.id} className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 relative group">
                                        <p className="font-bold text-sm text-zinc-900">{addr.first_name} {addr.last_name}</p>
                                        <p className="text-xs text-zinc-500">{addr.address_1}</p>
                                        <p className="text-xs text-zinc-500">{addr.city}, {addr.postal_code}</p>
                                        <button
                                            onClick={() => handleDeleteAddress(addr.id)}
                                            className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {customer.shipping_addresses?.length === 0 && !isAddingAddress && (
                                    <p className="text-xs text-zinc-400 italic">No saved addresses.</p>
                                )}
                            </div>

                            {isAddingAddress && (
                                <form onSubmit={handleAddAddress} className="mt-4 pt-4 border-t border-zinc-100 space-y-3">
                                    <p className="text-xs font-bold uppercase text-zinc-900">New Address</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input placeholder="First Name" value={addressForm.first_name} onChange={e => setAddressForm({ ...addressForm, first_name: e.target.value })} className="h-8 text-xs" />
                                        <Input placeholder="Last Name" value={addressForm.last_name} onChange={e => setAddressForm({ ...addressForm, last_name: e.target.value })} className="h-8 text-xs" />
                                    </div>
                                    <Input placeholder="Address" value={addressForm.address_1} onChange={e => setAddressForm({ ...addressForm, address_1: e.target.value })} className="h-8 text-xs" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input placeholder="City" value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} className="h-8 text-xs" />
                                        <Input placeholder="PIN" value={addressForm.postal_code} onChange={e => setAddressForm({ ...addressForm, postal_code: e.target.value })} className="h-8 text-xs" />
                                    </div>
                                    <Button type="submit" size="sm" className="w-full rounded-full bg-zinc-900 text-white text-xs h-8">Add Address</Button>
                                </form>
                            )}
                        </GlassCard>

                        <div className="pt-2">
                            <Link href="/contact" className="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-100 transition-colors group border border-transparent hover:border-zinc-200">
                                <span className="text-sm font-bold text-zinc-900">Need Help?</span>
                                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900" />
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    );
}
