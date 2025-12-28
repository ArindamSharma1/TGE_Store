"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    currencyCode: string; // e.g., "USD", "GBP"
    images: {
        main: string;
        hover: string;
    };
    handle: string;
}

export function ProductCard({
    title,
    price,
    currencyCode,
    images,
    handle,
}: ProductCardProps) {
    return (
        <div className="group relative block h-full w-full">
            <Link href={`/products/${handle}`} className="block h-full w-full">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-4">
                    {/* Main Image */}
                    <Image
                        src={images.main}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {/* Hover Image (Overlay) */}
                    <Image
                        src={images.hover}
                        alt={`${title} - Alternate View`}
                        fill
                        className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />

                    {/* Quick Add Button Overlay */}
                    <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <button
                            className="flex h-10 w-10 items-center justify-center bg-pure-white text-charcoal-black shadow-md hover:bg-charcoal-black hover:text-pure-white transition-colors"
                            aria-label="Quick Add"
                            onClick={(e) => {
                                e.preventDefault();
                                // TODO: Add to cart logic
                                console.log("Quick add", title);
                            }}
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Badge (Optional - Mock) */}
                    {/* <div className="absolute top-2 left-2 bg-charcoal-black text-pure-white text-[10px] uppercase font-bold px-2 py-1 tracking-widest">New</div> */}
                </div>

                <div className="space-y-1">
                    <h3 className="font-satoshi text-sm font-bold uppercase tracking-wide text-charcoal-black line-clamp-1 group-hover:underline underline-offset-4 decoration-1">
                        {title}
                    </h3>
                    <p className="font-open-sans text-sm font-medium text-secondary-text">
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: currencyCode
                        }).format(price)}
                    </p>
                </div>
            </Link>
        </div>
    );
}
