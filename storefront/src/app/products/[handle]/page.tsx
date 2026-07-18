import { shopifyFetch } from "@/lib/shopify";
import { getProductQuery } from "@/lib/shopify/queries";
import { ProductGallery } from "@/components/modules/product/ProductGallery";
import { ProductInfo } from "@/components/modules/product/ProductInfo";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
    params: Promise<{ handle: string }>;
};

async function getProduct(handle: string) {
    const res = await shopifyFetch<{ product: any }>({
        query: getProductQuery,
        variables: { handle },
    });
    return res?.product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { handle } = await params;
    const product = await getProduct(handle);
    if (!product) return { title: "Object Not Found | TGE" };
    return {
        title: `${product.title} | TGE`,
        description: product.description || `${product.title} — TGE / The Garment Experiment.`,
        openGraph: {
            title: `${product.title} | TGE`,
            images: product.featuredImage?.url ? [product.featuredImage.url] : [],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { handle } = await params;
    const product = await getProduct(handle);

    if (!product) notFound();

    const galleryImages = [
        ...(product.featuredImage?.url ? [product.featuredImage.url] : []),
        ...(product.images?.edges?.map((e: any) => e.node.url) || []),
    ].filter((v, i, arr) => arr.indexOf(v) === i);

    const options = product.options?.map((opt: any) => ({
        name: opt.name,
        values: opt.values,
    })) || [];

    const variants = product.variants?.edges?.map((e: any) => e.node) || [];

    return (
        <div className="min-h-screen bg-bone text-carbon pt-16">
            <div className="max-w-[1600px] mx-auto px-spacing-component">

                {/* Breadcrumb */}
                <div className="py-4 border-b border-graphite/10">
                    <p className="text-mono text-graphite">
                        TGE / OBJECTS / {product.title.toUpperCase()}
                    </p>
                </div>

                {/* Product Layout: Gallery | Info | (editorial right col on xl) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 py-spacing-section-inner">

                    {/* Gallery — Left */}
                    <div className="lg:col-span-7">
                        <ProductGallery images={galleryImages} />
                    </div>

                    {/* Info — Right, sticky */}
                    <div className="lg:col-span-5">
                        <ProductInfo
                            title={product.title}
                            description={product.description}
                            options={options}
                            image={product.featuredImage?.url || ""}
                            handle={product.handle}
                            variants={variants}
                            objectCode={`OBJ_${product.id.split("/").pop()?.slice(-3) || "000"}`}
                        />
                    </div>
                </div>

                {/* Field Notes / Related section */}
                <div className="border-t border-graphite/20 py-spacing-section-gap">
                    <p className="text-mono text-graphite mb-spacing-section-inner">FIELD NOTES</p>
                    <p className="text-body-large text-graphite max-w-xl">
                        No field notes yet. Be the first to document this object in use.
                    </p>
                </div>
            </div>
        </div>
    );
}
