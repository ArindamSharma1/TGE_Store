"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { shopifyFetch } from "@/lib/shopify";
import { getCartQuery } from "@/lib/shopify/queries";
import { addToCartMutation, createCartMutation, editCartItemsMutation, removeFromCartMutation } from "@/lib/shopify/mutations";
import { toast } from "sonner";

// Types
export type CartItem = {
    id: string; // Line Item ID
    variantId: string;
    productTitle: string;
    variantTitle?: string;
    price: number;
    image: string;
    quantity: number;
    handle: string;
    merchandiseId: string; // Store variant ID here as well
};

interface CartContextType {
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    items: CartItem[];
    addItem: (item: { variantId: string; quantity: number }) => Promise<void>;
    removeItem: (lineId: string) => Promise<void>;
    updateItem: (lineId: string, quantity: number) => Promise<void>;
    cartCount: number;
    subtotal: number;
    cartId: string;
    checkoutUrl: string;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [cartId, setCartId] = useState<string>("");
    const [items, setItems] = useState<CartItem[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [checkoutUrl, setCheckoutUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Helpers
    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    const toggleCart = () => setIsOpen((prev) => !prev);

    // --- Cart Actions ---

    const refreshCart = async (id: string) => {
        try {
            const res = await shopifyFetch<any>({
                query: getCartQuery,
                variables: { cartId: id },
                cache: 'no-store'
            });

            if (res?.cart) {
                mapCartData(res.cart);
            } else {
                // Cart likely expired or invalid
                localStorage.removeItem("shopify_cart_id");
                setCartId("");
                setItems([]);
                setSubtotal(0);
                setCheckoutUrl("");
                await createCart();
            }
        } catch (e) {
            console.error("Failed to refresh cart", e);
        }
    };

    const mapCartData = (cart: any) => {
        if (!cart?.lines?.edges) {
            setItems([]);
            return;
        }

        const mappedItems: CartItem[] = cart.lines.edges
            .map((edge: any) => {
                const node = edge.node;
                if (!node || !node.merchandise) return null;

                const merchandise = node.merchandise;
                const quantity = node.quantity || 1; // Default to 1 if missing

                let unitPrice = 0;
                if (node.cost?.totalAmount?.amount) {
                    const totalAmount = parseFloat(node.cost.totalAmount.amount);
                    unitPrice = totalAmount / quantity;
                }

                return {
                    id: node.id,
                    variantId: merchandise.id,
                    merchandiseId: merchandise.id,
                    productTitle: merchandise.product?.title || "Unknown Product",
                    variantTitle: merchandise.title === "Default Title" ? "" : merchandise.title,
                    price: unitPrice || 0,
                    image: merchandise.product?.featuredImage?.url || "",
                    quantity: quantity,
                    handle: merchandise.product?.handle || ""
                };
            })
            .filter((item): item is CartItem => item !== null);

        setItems(mappedItems);

        if (cart.cost?.subtotalAmount?.amount) {
            setSubtotal(parseFloat(cart.cost.subtotalAmount.amount));
        }

        if (cart.checkoutUrl) {
            setCheckoutUrl(cart.checkoutUrl);
        }
    };

    const createCart = async () => {
        try {
            const res = await shopifyFetch<any>({
                query: createCartMutation,
                variables: {},
                cache: 'no-store'
            });

            if (res?.cartCreate?.cart?.id) {
                const newId = res.cartCreate.cart.id;
                setCartId(newId);
                localStorage.setItem("shopify_cart_id", newId);
                mapCartData(res.cartCreate.cart); // Also map initial data (like checkoutUrl)
                return newId;
            }
        } catch (e) {
            console.error("Failed to create cart", e);
        }
        return null;
    };

    const addItem = async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
        setIsLoading(true);
        try {
            let activeCartId = cartId;
            if (!activeCartId) {
                const newId = await createCart();
                if (newId) activeCartId = newId;
                else throw new Error("Could not create cart");
            }

            const res = await shopifyFetch<any>({
                query: addToCartMutation,
                variables: {
                    cartId: activeCartId,
                    lines: [{ merchandiseId: variantId, quantity: quantity }]
                },
                cache: 'no-store'
            });

            if (res?.cartLinesAdd?.cart) {
                // mapCartData(res.cartLinesAdd.cart); 
                // Force a full refresh to ensure all fields (cost, quantity) are recalculated by Shopify
                await refreshCart(activeCartId);
                openCart();
                toast.success("Added to cart");
            } else {
                console.error("Add to cart error", res);
                toast.error("Failed to add to cart");
            }

        } catch (e) {
            console.error("Add item failed", e);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const removeItem = async (lineId: string) => {
        setIsLoading(true);
        try {
            const res = await shopifyFetch<any>({
                query: removeFromCartMutation,
                variables: {
                    cartId,
                    lineIds: [lineId]
                },
                cache: 'no-store'
            });

            if (res?.cartLinesRemove?.cart) {
                mapCartData(res.cartLinesRemove.cart);
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to remove item");
        } finally {
            setIsLoading(false);
        }
    };

    const updateItem = async (lineId: string, quantity: number) => {
        setIsLoading(true);
        try {
            const res = await shopifyFetch<any>({
                query: editCartItemsMutation,
                variables: {
                    cartId,
                    lines: [{ id: lineId, quantity: quantity }]
                },
                cache: 'no-store'
            });

            if (res?.cartLinesUpdate?.cart) {
                mapCartData(res.cartLinesUpdate.cart);
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to update quantity");
        } finally {
            setIsLoading(false);
        }
    };

    // Initial Load
    useEffect(() => {
        const init = async () => {
            const storedId = localStorage.getItem("shopify_cart_id");
            if (storedId) {
                setCartId(storedId);
                await refreshCart(storedId);
            }
        };
        init();
    }, []);

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

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
                updateItem,
                cartCount,
                subtotal,
                cartId,
                checkoutUrl,
                isLoading
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

