"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Define a simpler WishlistItem to store in local storage
// We only really need the ID to fetch details, but storing minimal data helps immediate UI
interface WishlistItem {
    id: string;
    handle: string;
    thumbnail: string;
    title: string;
    price: number | null;
}

interface WishlistContextType {
    items: WishlistItem[];
    addToWishlist: (product: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("tgs_wishlist");
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse wishlist", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Persist to LocalStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("tgs_wishlist", JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToWishlist = (product: WishlistItem) => {
        if (items.some(i => i.id === product.id)) return;
        setItems(prev => [...prev, product]);
        toast.success("Added to wishlist");
    };

    const removeFromWishlist = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
        toast.success("Removed from wishlist");
    };

    const isInWishlist = (id: string) => {
        return items.some(i => i.id === id);
    };

    return (
        <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
