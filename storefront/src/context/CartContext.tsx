"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { medusaClient } from "@/lib/medusa/client";

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
    cartCount: number;
    subtotal: number;
    cartId: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<CartItem[]>([]);
    const [cartId, setCartId] = useState<string>("");

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    const toggleCart = () => setIsOpen((prev) => !prev);

    useEffect(() => {
        const initCart = async () => {
            const storedCartId = localStorage.getItem("medusa_cart_id");
            if (storedCartId) {
                try {
                    const { cart } = await medusaClient.store.cart.retrieve(storedCartId, {
                        fields: "*items,*items.variant,*items.variant.product"
                    });
                    setCartId(cart.id);
                    setItems(mapLineItems(cart.items));
                } catch (e) {
                    console.error("Failed to retrieve cart, creating new one", e);
                    createCart();
                }
            } else {
                createCart();
            }
        };
        initCart();
    }, []);

    const createCart = async () => {
        try {
            const { cart } = await medusaClient.store.cart.create({});
            setCartId(cart.id);
            localStorage.setItem("medusa_cart_id", cart.id);
            setItems([]);
        } catch (e) {
            console.error("Failed to create cart", e);
        }
    };

    const mapLineItems = (medusaItems: any[]): CartItem[] => {
        return medusaItems?.map((item) => ({
            id: item.id,
            variantId: item.variant_id,
            productTitle: item.title,
            variantTitle: item.variant_title,
            price: item.unit_price / 100,
            image: item.thumbnail,
            quantity: item.quantity,
            handle: item.variant?.product?.handle || "",
        })) || [];
    };

    const addItem = async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
        setIsOpen(true);
        if (!cartId) {
            await createCart();
        }

        const currentCartId = cartId || localStorage.getItem("medusa_cart_id");
        if (!currentCartId) return;

        try {
            const { cart } = await medusaClient.store.cart.createLineItem(currentCartId, {
                variant_id: variantId,
                quantity: quantity,
            });
            setItems(mapLineItems(cart.items));
        } catch (e) {
            console.error("Failed to add item, attempting to refresh cart...", e);
            localStorage.removeItem("medusa_cart_id");
            setCartId("");

            try {
                // Create new cart
                const { cart: newCart } = await medusaClient.store.cart.create({});
                setCartId(newCart.id);
                localStorage.setItem("medusa_cart_id", newCart.id);

                // Retry Add Item
                const { cart: updatedCart } = await medusaClient.store.cart.createLineItem(newCart.id, {
                    variant_id: variantId,
                    quantity: quantity,
                });
                setItems(mapLineItems(updatedCart.items));
            } catch (retryError) {
                console.error("Critical: Failed to recover cart.", retryError);
            }
        }
    };

    const removeItem = async (id: string) => {
        if (!cartId) return;
        try {
            const response = await medusaClient.store.cart.deleteLineItem(cartId, id);
            if (response && response.cart) {
                setItems(mapLineItems(response.cart.items));
            } else {
                // Fallback: If no cart returned, refresh by fetching the cart again
                const storedCartId = localStorage.getItem("medusa_cart_id");
                if (storedCartId) {
                    const { cart } = await medusaClient.store.cart.retrieve(storedCartId, {
                        fields: "*items,*items.variant,*items.variant.product"
                    });
                    // If cart is empty/deleted, it might return 404, but assuming just update:
                    setItems(mapLineItems(cart.items));
                }
            }
        } catch (e) {
            console.error("Failed to remove item", e);
            // Even on error, try to sync state
            const storedCartId = localStorage.getItem("medusa_cart_id");
            if (storedCartId) {
                try {
                    const { cart } = await medusaClient.store.cart.retrieve(storedCartId, { fields: "*items,*items.variant,*items.variant.product" });
                    setItems(mapLineItems(cart.items));
                } catch (err) { console.error("Could not refresh cart", err) }
            }
        }
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
                cartId,
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
