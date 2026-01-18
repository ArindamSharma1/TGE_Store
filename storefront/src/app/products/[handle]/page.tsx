import { shopifyFetch } from "@/lib/shopify";
import { getProductQuery } from "@/lib/shopify/queries";
import { ProductGallery } from "@/components/modules/product/ProductGallery";
import { ProductInfo } from "@/components/modules/product/ProductInfo";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
    params: Promise<{ handle: string }>
}

async function getProduct(handle: string) {
    const { body } = await shopifyFetch<{ data: { product: any } }>({
        query: getProductQuery,
        variables: {
            handle: handle
        }
    });

    return body.data.product;
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
            images: product.featuredImage?.url ? [product.featuredImage.url] : [],
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
    // Shopify images are in edges { node { url } }
    const galleryImages = [
        ...(product.featuredImage?.url ? [product.featuredImage.url] : []),
        ...(product.images?.edges?.map((edge: any) => edge.node.url) || [])
    ].filter((value, index, self) => self.indexOf(value) === index); // Unique

    // Map options for ProductInfo
    const options = product.options?.map((opt: any) => ({
        name: opt.name,
        values: opt.values
    })) || [];

    const variants = product.variants?.edges?.map((e: any) => e.node) || [];

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
                        image={product.featuredImage?.url}
                        handle={product.handle}
                        variants={variants}
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
                            priceCurrency: product.priceRange?.minVariantPrice?.currencyCode || "INR",
                            price: product.priceRange?.minVariantPrice?.amount || 0,
                            availability: product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                        }
                    })
                }}
            />
        </div>
    );
}
