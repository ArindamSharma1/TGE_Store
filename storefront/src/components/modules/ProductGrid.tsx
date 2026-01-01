import { ProductCard } from "./ProductCard";

interface Product {
    id: string;
    title: string;
    price: number;
    handle: string;
    images: {
        main: string;
        hover: string;
    };
}

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    thumbnail={product.images.main}
                    handle={product.handle}
                    price={product.price}
                    currencyCode="INR"
                    images={product.images}
                />
            ))}
        </div>
    );
}
