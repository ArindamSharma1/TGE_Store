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
                    fields: "+variants.prices,+variants.calculated_price,+options,+images,+thumbnail"
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

    // Map options
    const options = product.options?.map((opt: any) => ({
        name: opt.title,
        values: opt.values.map((v: any) => v.value)
    })) || [];

    return (
        <main className="min-h-screen pt-24 pb-20">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

                    {/* Left Column: Gallery (Scrollable) */}
                    <div className="w-full lg:w-[60%]">
                        <ProductGallery images={images} />

                        {/* Additional Details - Integrated Flow */}
                        <div className="mt-12 hidden lg:block">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 mb-6">Details & Specs</h3>
                            <div className="grid grid-cols-2 gap-8 text-sm text-zinc-500 font-medium leading-relaxed">
                                <ul className="space-y-2">
                                    <li>Heavyweight construction</li>
                                    <li>Relaxed, boxy fit</li>
                                    <li>Pre-shrunk fabric</li>
                                </ul>
                                <ul className="space-y-2">
                                    <li>Made in Portugal</li>
                                    <li>100% Cotton</li>
                                    <li>Cold wash only</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info (Sticky) */}
                    <div className="w-full lg:w-[40%] relative pt-6 lg:pt-0">
                        <div className="relative lg:sticky lg:top-32">
                            <ProductInfo
                                title={product.title || ""}
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
