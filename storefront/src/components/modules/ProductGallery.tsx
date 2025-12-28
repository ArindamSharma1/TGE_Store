"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface ProductGalleryProps {
    images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = React.useState(0);

    if (!images || images.length === 0) return null;

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-auto scrollbar-hide">
                {images.map((img, index) => (
                    <button
                        key={index}
                        className={cn(
                            "relative w-20 h-24 md:w-24 md:h-32 shrink-0 border-2 transition-all",
                            selectedImage === index ? "border-charcoal-black" : "border-transparent hover:border-gray-300"
                        )}
                        onClick={() => setSelectedImage(index)}
                    >
                        <Image
                            src={img}
                            alt={`Product view ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="96px"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 aspect-[3/4] bg-gray-100 overflow-hidden">
                <Image
                    src={images[selectedImage]}
                    alt="Main product view"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
        </div>
    );
}
