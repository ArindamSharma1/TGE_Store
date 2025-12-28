import Image from "next/image";
import Link from "next/link";
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
        <Link href={`/products/${handle}`} className="group block h-full w-full">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                {/* Main Image */}
                <Image
                    src={images.main}
                    alt={title}
                    fill
                    className="object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                {/* Hover Image */}
                <Image
                    src={images.hover}
                    alt={`${title} - Alternate View`}
                    fill
                    className="absolute inset-0 object-cover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
            </div>
            <div className="mt-3 space-y-1">
                <h3 className="text-sm font-semibold text-charcoal-black line-clamp-2 leading-tight">
                    {title}
                </h3>
                <p className="text-sm font-bold text-charcoal-black">
                    {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: currencyCode
                    }).format(price)}
                </p>
            </div>
        </Link>
    );
}
