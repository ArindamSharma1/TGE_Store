"use client";

import { medusaClient } from "@/lib/medusa/client";
import { ProductGallery } from "@/components/modules/product/ProductGallery";
import { ProductInfo } from "@/components/modules/product/ProductInfo";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductPage() {
    const params = useParams();
    const handle = params.handle as string;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!handle) return;

        const fetchProduct = async () => {
            try {
                const { products } = await medusaClient.store.product.list({
                    handle: handle,
                    fields: "*variants.calculated_price,+options,+images,+variants.prices"
                });

                if (products && products.length > 0) {
                    setProduct(products[0]);
                } else {
                    // Handle 404
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [handle]);

    if (loading) {
        return <div className="min-h-screen pt-32 text-center">Loading...</div>;
    }

    if (!product) {
        return <div className="min-h-screen pt-32 text-center">Product not found</div>;
    }

    // Map images
    const images = (product.images?.map((img: any) => img.url).filter((url: any): url is string => !!url)) || (product.thumbnail ? [product.thumbnail] : []);

    console.log("DEBUG: Product Images", images);

    // Map options
    const options = product.options?.map((opt: any) => ({
        name: opt.title,
        values: opt.values.map((v: any) => v.value)
    })) || [];

    // Lowest Price
    const lowestPrice = product.variants?.[0]?.prices?.find((p: any) => p.currency_code === "inr")?.amount ||
        product.variants?.[0]?.prices?.[0]?.amount || 0;
    const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(lowestPrice / 100);

    return (
        <main className="min-h-screen pt-24 pb-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                    {/* Left Column: Gallery (Scrollable) */}
                    <div className="w-full lg:w-[60%]">
                        <ProductGallery images={images} />

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
                                title={product.title || ""}
                                price={formattedPrice}
                                description={product.description || ""}
                                options={options}
                                image={product.thumbnail || ""}
                                handle={handle}
                                variants={product.variants}
                                productOptions={product.options}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
