"use client";

import { ProductCard } from "./ProductCard";
import { motion } from "framer-motion";

interface Product {
    id: string;
    title: string;
    price?: number; // Price might be missing or in variants
    handle: string;
    thumbnail?: string | null;
    images?: { url: string }[] | null;
    variants: any[];
    tags?: string[];
}

interface ProductGridProps {
    products: Product[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1] as const // The "Apple" Ease
        }
    }
};

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
        >
            {products.map((product) => {
                const mainImg = product.thumbnail || product.images?.[0]?.url || "";
                const hoverImg = product.images?.[1]?.url || mainImg;

                // Calculate display price if root price is missing
                let displayPrice = product.price;
                if (!displayPrice && product.variants && product.variants.length > 0) {
                    // Simple fallback - ProductCard handles more complex logic
                    displayPrice = product.variants[0].prices?.[0]?.amount;
                    if (displayPrice) displayPrice = displayPrice / 100;
                }

                return (
                    <motion.div key={product.id} variants={item}>
                        <ProductCard
                            id={product.id}
                            title={product.title}
                            thumbnail={mainImg}
                            handle={product.handle}
                            price={displayPrice || 0} // ProductCard handles details
                            currencyCode="INR"
                            images={{
                                main: mainImg,
                                hover: hoverImg
                            }}
                            tags={product.tags} // Pass tags
                        />
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
