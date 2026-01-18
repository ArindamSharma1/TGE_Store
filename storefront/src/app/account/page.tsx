"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { toast } from "sonner";
import { Package, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { useWishlist } from "@/context/WishlistContext";
// import WishlistSection from "./WishlistSection"; // Assuming this is here or we simplify

// Placeholder Wishlist Section if unrelated to Medusa, else stub
const WishlistSection = () => (
    <div className="p-6 bg-white rounded-xl border border-zinc-100">
        <h3 className="font-bold mb-4">Wishlist (Migrating)</h3>
        <p className="text-zinc-500 text-sm">Your saved items will appear here soon.</p>
    </div>
);

export default function AccountPage() {
    const router = useRouter();
    const [customer, setCustomer] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Edit Profile State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ first_name: "Demo", last_name: "User", phone: "" });

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
            // Stub: Simulate guest or migrated state
            // For now, let's redirect to login or show dummy state

            // Allow viewing 'account' purely for UI verification if needed, 
            // but in real app we'd redirect.
            // setCustomer({ first_name: "Demo", last_name: "User", email: "demo@tge.store", phone: "1234567890", shipping_addresses: [] });

            // Safe Redirect for now since no backend
            setTimeout(() => {
                router.push("/login");
            }, 500);
        };
        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        window.location.href = "/login";
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.info("Profile update disabled during migration.");
        setIsEditingProfile(false);
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.info("Address management disabled during migration.");
        setIsAddingAddress(false);
    };

    const handleDeleteAddress = async (addressId: string) => {
        toast.info("Address management disabled during migration.");
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
            {/* Render safe Stub UI */}
            <div className="text-center">
                <h1>Account Migration in Progress</h1>
            </div>
        </div>
    );
}
