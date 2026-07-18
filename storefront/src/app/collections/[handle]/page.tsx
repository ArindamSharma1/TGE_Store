
import { CollectionHeader } from "@/components/modules/CollectionHeader";
import { FilterBar } from "@/components/modules/FilterBar";
import { ProductGrid } from "@/components/modules/ProductGrid";
import { shopifyFetch } from "@/lib/shopify";
import { getCollectionProductsQuery, getProductsQuery } from "@/lib/shopify/queries";
import { Metadata } from "next";
import { Suspense } from "react";

interface CollectionPageProps {
    params: Promise<{
        handle: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
    const { handle } = await params;

    const TITLES: Record<string, string> = {
        all: "All Objects | TGE",
        "new-system": "New System | TGE",
        uniforms: "Uniforms | TGE",
        layers: "Layers | TGE",
        objects: "Objects | TGE",
    };

    if (TITLES[handle]) {
        return {
            title: TITLES[handle],
            description: "A daily uniform system for creative people in motion.",
        };
    }

    try {
        const res = await shopifyFetch<any>({
            query: getCollectionProductsQuery,
            variables: { handle },
        });
        const collection = res?.collection;
        return {
            title: collection ? `${collection.title} | TGE` : "Collection | TGE",
            description: collection?.description || "A daily uniform system for creative people in motion.",
        };
    } catch {
        return { title: "Collection | TGE" };
    }
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
    const { handle } = await params;
    const { sort } = await searchParams;

    const getSortValues = (sortParam: string | undefined, isAllProducts: boolean) => {
        switch (sortParam) {
            case "price-asc": return { sortKey: "PRICE", reverse: false };
            case "price-desc": return { sortKey: "PRICE", reverse: true };
            case "best-selling": return { sortKey: "BEST_SELLING", reverse: false };
            default: return { sortKey: isAllProducts ? "CREATED_AT" : "CREATED", reverse: true };
        }
    };

    const isAll = handle === "all";
    const { sortKey, reverse } = getSortValues(sort as string, isAll);

    let products: any[] = [];
    let collectionTitle = "All Objects";
    let collectionDescription = "";
    let collectionCount = 0;

    const mapProduct = (p: any) => {
        const thumbnail = p.featuredImage?.url || p.images?.edges?.[0]?.node?.url || "";
        const wornImage = p.images?.edges?.[1]?.node?.url || thumbnail;
        const price = parseFloat(p.priceRange?.minVariantPrice?.amount || "0");

        return {
            id: p.id,
            title: p.title,
            price,
            currencyCode: p.priceRange?.minVariantPrice?.currencyCode || "INR",
            handle: p.handle,
            thumbnail,
            wornImage,
            images: [{ url: thumbnail }, { url: wornImage }],
            tags: p.tags || [],
            defaultVariantId: p.variants?.edges?.[0]?.node?.id,
            variants: p.variants?.edges?.map((e: any) => e.node) || [],
        };
    };

    try {
        if (isAll) {
            const res = await shopifyFetch<{ products: { edges: any[] } }>({
                query: getProductsQuery,
                variables: { query: "", sortKey, reverse },
            });
            products = (res?.products?.edges || []).map((e: any) => mapProduct(e.node));
            collectionCount = products.length;
            collectionDescription = "Field-tested objects. System-built garments.";
        } else {
            const res = await shopifyFetch<any>({
                query: getCollectionProductsQuery,
                variables: { handle, sortKey, reverse },
            });
            const collection = res?.collection;
            if (collection) {
                collectionTitle = collection.title;
                collectionDescription = collection.description || "";
                products = (collection.products?.edges || []).map((e: any) => mapProduct(e.node));
                collectionCount = products.length;
            }
        }
    } catch (e) {
        console.error("Collection fetch error:", e);
    }

    return (
        <div className="min-h-screen bg-bone text-carbon">
            <div className="max-w-[1600px] mx-auto px-spacing-component">

                <CollectionHeader
                    title={collectionTitle}
                    description={collectionDescription}
                    count={collectionCount}
                    handle={handle}
                />

                {/* Filter Bar wrapped in Suspense for searchParams */}
                <div className="sticky top-16 z-40 bg-bone/95 backdrop-blur-sm py-4 mb-spacing-section-inner border-b border-graphite/10">
                    <Suspense>
                        <FilterBar resultCount={collectionCount} />
                    </Suspense>
                </div>

                <ProductGrid products={products} />

                <div className="py-spacing-editorial border-t border-graphite/10 mt-spacing-section-gap" />
            </div>
        </div>
    );
}
