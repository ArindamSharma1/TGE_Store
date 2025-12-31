"use client";

import { useParams } from "next/navigation";
import { ProductGallery } from "@/components/modules/product/ProductGallery";
import { ProductInfo } from "@/components/modules/product/ProductInfo";

// Mock Data for specific handles, fallbacks for others
const PRODUCTS: Record<string, any> = {
    "oversized-puffer": {
        title: "Oversized Technical Puffer",
        price: "$240.00",
        description: "Built for the harshest winters. This oversized puffer features a water-resistant technical shell, 700-fill down insulation, and a detachable hood. Finished with matte black hardware and storm cuffs.",
        images: [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop", // Puffer main
            "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=1000&auto=format&fit=crop", // Detail
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop", // Lifestyle
        ],
        options: [
            { name: "Color", values: ["Matte Black", "Stone Grey", "Midnight"] },
            { name: "Size", values: ["S", "M", "L", "XL"] }
        ]
    },
    "essential-hoodie": {
        title: "Essential Heavyweight Hoodie",
        price: "$120.00",
        description: "The last hoodie you'll ever need. 450GSM french terry cotton, garment-dyed for a broken-in feel. Boxy fit with dropped shoulders and a double-lined hood.",
        images: [
            "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
        ],
        options: [
            { name: "Color", values: ["Black", "Heather Grey", "Cream"] },
            { name: "Size", values: ["XS", "S", "M", "L", "XL", "XXL"] }
        ]
    }
};

const DEFAULT_PRODUCT = {
    title: "Signature Utility Jacket",
    price: "$180.00",
    description: "A modern take on classic workwear. Constructed from durable heavy-twill cotton with reinforced stitching. Features four utility pockets, internal stash pocket, and adjustable cuffs.",
    images: [
        "https://images.unsplash.com/photo-1551488852-078bd9101521?q=80&w=1000&auto=format&fit=crop", // Kept one that might work or replace
        "https://images.unsplash.com/photo-1544022613-207d80004d80?q=80&w=1000&auto=format&fit=crop"
    ],
    options: [
        { name: "Color", values: ["Olive", "Black", "Tan"] },
        { name: "Size", values: ["S", "M", "L", "XL"] }
    ]
}

export default function ProductPage() {
    const params = useParams();
    const handle = params.handle as string;
    const product = PRODUCTS[handle] || DEFAULT_PRODUCT;

    return (
        <main className="min-h-screen pt-24 pb-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                    {/* Left Column: Gallery (Scrollable) */}
                    <div className="w-full lg:w-[60%]">
                        <ProductGallery images={product.images} />

                        {/* Additional Details (Description extension, specs, etc) below gallery */}
                        <div className="mt-16 pt-16 border-t border-zinc-100 hidden lg:block">
                            <h3 className="text-xl font-bold uppercase mb-6">Details & Specs</h3>
                            <div className="grid grid-cols-2 gap-8 text-sm text-zinc-600">
                                <ul className="space-y-3">
                                    <li>• Heavyweight construction</li>
                                    <li>• Relaxed, boxy fit</li>
                                    <li>• Pre-shrunk fabric</li>
                                </ul>
                                <ul className="space-y-3">
                                    <li>• Made in Portugal</li>
                                    <li>• 100% Cotton</li>
                                    <li>• Cold wash only</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info (Sticky) */}
                    <div className="w-full lg:w-[40%] relative">
                        <div className="sticky top-32">
                            <ProductInfo
                                title={product.title}
                                price={product.price}
                                description={product.description}
                                options={product.options}
                                image={product.images[0]}
                                handle={handle}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
