import { ProductCard } from "./ProductCard";
import Link from "next/link";

interface Product {
    id: string;
    title: string;
    price?: number;
    handle: string;
    thumbnail?: string | null;
    images?: { url: string }[] | null;
    variants?: any[];
    tags?: string[];
    objectCode?: string;
    materials?: string;
    field?: string;
    defaultVariantId?: string;
}

interface ProductGridProps {
    products: Product[];
}

// Editorial inserts between product cards
const EDITORIAL_INSERTS = [
    {
        type: "statement",
        content: "Built for the hours between places.",
        field: "SYSTEM NOTE / 01",
    },
    {
        type: "material",
        content: "320 GSM Cotton Twill. DWR treated. Structured to outlast the season.",
        field: "MATERIAL NOTE",
    },
    {
        type: "statement",
        content: "Repetition over novelty.",
        field: "FIELD STATEMENT",
    },
];

export function ProductGrid({ products }: ProductGridProps) {
    if (!products.length) {
        return (
            <div className="py-spacing-editorial text-center">
                <p className="text-heading uppercase text-graphite/40 mb-4">—</p>
                <p className="text-body text-graphite">No objects match the current conditions.</p>
                <Link
                    href="/collections/all"
                    className="inline-block mt-6 text-meta uppercase underline underline-offset-4 text-graphite hover:text-carbon transition-colors"
                >
                    View all objects
                </Link>
            </div>
        );
    }

    // Interleave editorial inserts
    const grid: Array<{ type: "product"; data: Product } | { type: "insert"; data: typeof EDITORIAL_INSERTS[0] }> = [];
    let insertIndex = 0;
    products.forEach((product, i) => {
        grid.push({ type: "product", data: product });
        // Insert editorial content after every 4th product
        if ((i + 1) % 4 === 0 && insertIndex < EDITORIAL_INSERTS.length) {
            grid.push({ type: "insert", data: EDITORIAL_INSERTS[insertIndex++] });
        }
    });

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-spacing-component gap-y-12 md:gap-y-spacing-section-inner">
            {grid.map((entry, i) => {
                if (entry.type === "insert") {
                    return (
                        <div
                            key={`insert-${i}`}
                            className="col-span-2 lg:col-span-1 flex flex-col justify-center border-t border-graphite/20 pt-6"
                        >
                            <p className="text-mono text-acid mb-4">{entry.data.field}</p>
                            <p className="text-body-large text-graphite italic">
                                &ldquo;{entry.data.content}&rdquo;
                            </p>
                        </div>
                    );
                }

                const product = entry.data;
                const mainImg = product.thumbnail || product.images?.[0]?.url || "";
                const wornImg = product.images?.[1]?.url || mainImg;
                const price = product.price || product.variants?.[0]?.price?.amount
                    ? parseFloat(String(product.price || product.variants?.[0]?.price?.amount || "0"))
                    : 0;

                return (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        objectCode={product.objectCode}
                        title={product.title}
                        handle={product.handle}
                        price={price}
                        currencyCode="INR"
                        objectImage={mainImg}
                        wornImage={wornImg || undefined}
                        materials={product.materials}
                        field={product.field}
                        defaultVariantId={product.defaultVariantId || product.variants?.[0]?.id}
                        variants={product.variants}
                    />
                );
            })}
        </div>
    );
}
