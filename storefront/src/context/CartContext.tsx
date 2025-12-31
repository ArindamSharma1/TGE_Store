"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
    id: string; // Product ID + Variant IDs ideally, but for now just a unique string
    productTitle: string;
    variantTitle?: string; // e.g. "Size: M / Color: Black"
    price: number;
    image: string;
    quantity: number;
    handle: string;
};

interface CartContextType {
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    items: CartItem[];
    addItem: (item: Omit<CartItem, "id" | "quantity">) => void;
    removeItem: (id: string) => void;
    cartCount: number;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<CartItem[]>([]);

    // Hydrate from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("tge-cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Persist to local storage
    useEffect(() => {
        localStorage.setItem("tge-cart", JSON.stringify(items));
    }, [items]);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    const toggleCart = () => setIsOpen((prev) => !prev);

    const addItem = (itemToAdd: Omit<CartItem, "id" | "quantity">) => {
        // Open cart immediately when adding
        setIsOpen(true);

        setItems((prev) => {
            const existingItem = prev.find(
                (item) =>
                    item.handle === itemToAdd.handle &&
                    item.variantTitle === itemToAdd.variantTitle
            );

            if (existingItem) {
                return prev.map((item) =>
                    item.id === existingItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            const newItem: CartItem = {
                ...itemToAdd,
                id: Math.random().toString(36).substring(7),
                quantity: 1,
            };

            console.log("Adding item to cart:", newItem);

            return [...prev, newItem];
        });
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                isOpen,
                openCart,
                closeCart,
                toggleCart,
                items,
                addItem,
                removeItem,
                cartCount,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
