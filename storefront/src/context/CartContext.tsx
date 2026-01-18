"use client";

import React, { createContext, useContext, useState } from "react";

// Placeholder types
export type CartItem = {
    id: string;
    variantId: string;
    productTitle: string;
    variantTitle?: string;
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
    addItem: (item: { variantId: string; quantity: number }) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    updateItem: (id: string, quantity: number) => Promise<void>;
    cartCount: number;
    subtotal: number;
    cartId: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    // safe dummy implementations
    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    const toggleCart = () => setIsOpen((prev) => !prev);
    const addItem = async () => { console.log("Cart is currently disabled for migration") };
    const removeItem = async () => { };
    const updateItem = async () => { };

    return (
        <CartContext.Provider
            value={{
                isOpen,
                openCart,
                closeCart,
                toggleCart,
                items: [],
                addItem,
                removeItem,
                updateItem,
                cartCount: 0,
                subtotal: 0,
                cartId: "",
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

