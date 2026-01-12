import { ProductCard } from "./ProductCard";
import { motion } from "framer-motion";

interface Product {
    id: string;
    title: string;
    price: number;
    handle: string;
    images: {
        main: string;
        hover: string;
    };
    variants: any[];
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
            ease: [0.16, 1, 0.3, 1] // The "Apple" Ease
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
            {products.map((product) => (
                <motion.div key={product.id} variants={item}>
                    <ProductCard
                        id={product.id}
                        title={product.title}
                        thumbnail={product.images.main}
                        handle={product.handle}
                        price={product.price}
                        currencyCode="INR"
                        images={product.images}
                        variants={product.variants}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}
