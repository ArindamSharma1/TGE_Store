import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface ProductGalleryProps {
    images: string[];
    className?: string;
}

export function ProductGallery({ images, className }: ProductGalleryProps) {
    if (!images || images.length === 0) return null;

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <div className="grid grid-cols-1 gap-4">
                {images.map((src, index) => (
                    <div key={index} className="relative aspect-[3/4] w-full overflow-hidden rounded-[32px] bg-zinc-100">
                        <Image
                            src={src}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={index === 0}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
