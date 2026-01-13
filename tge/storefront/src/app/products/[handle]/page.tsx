import { medusaClient } from "@/lib/medusa/client";
import { ProductGallery } from "@/components/modules/product/ProductGallery";
import { ProductInfo } from "@/components/modules/product/ProductInfo";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
    params: Promise<{ handle: string }>
}

async function getProduct(handle: string) {
    const { products } = await medusaClient.store.product.list({
        handle: handle,
        fields: "+variants.prices,+variants.calculated_price,+options,+images,+thumbnail"
    });

    if (!products || products.length === 0) {
        return null;
    }

    return products[0];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { handle } = await params;
    const product = await getProduct(handle);

    if (!product) {
        return {
            title: "Product Not Found | TGE",
        };
    }

    return {
        title: `${product.title} | TGE`,
        description: product.description || `Buy ${product.title} at TGE Store.`,
        openGraph: {
            title: `${product.title} | TGE`,
            description: product.description || `Buy ${product.title} at TGE Store.`,
            images: product.thumbnail ? [product.thumbnail] : [],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { handle } = await params;
    const product = await getProduct(handle);

    if (!product) {
        notFound();
    }

    // Helper to format images for Gallery
    const galleryImages = product.images?.map((img: any) => img.url) || [];
    if (product.thumbnail && !galleryImages.includes(product.thumbnail)) {
        galleryImages.unshift(product.thumbnail);
    }

    // Map options for ProductInfo
    const options = product.options?.map((opt: any) => ({
        name: opt.title,
        values: opt.values?.map((v: any) => v.value) || []
    })) || [];

    return (
        <div className="container mx-auto px-4 py-8 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Gallery */}
                <div className="w-full">
                    <ProductGallery images={galleryImages} />
                </div>

                {/* Info (Sticky) */}
                <div className="w-full lg:sticky lg:top-32 h-fit pt-6 lg:pt-0">
                    <ProductInfo
                        title={product.title}
                        description={product.description}
                        options={options}
                        image={product.thumbnail}
                        handle={product.handle}
                        variants={product.variants}
                    />
                </div>
            </div>

            {/* JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        name: product.title,
                        image: galleryImages,
                        description: product.description,
                        sku: product.id,
                        brand: {
                            "@type": "Brand",
                            name: "TGE"
                        },
                        offers: {
                            "@type": "Offer",
                            url: `https://tge.store/products/${product.handle}`,
                            priceCurrency: "INR",
                            price: product.variants?.[0]?.calculated_price?.calculated_amount / 100 || 0,
                            availability: "https://schema.org/InStock",
                        }
                    })
                }}
            />
        </div>
    );
}
