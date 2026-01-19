import { Header } from "@/components/global/Header";
import { CollectionHeader } from "@/components/modules/CollectionHeader";
import { FilterBar } from "@/components/modules/FilterBar";
import { ProductGrid } from "@/components/modules/ProductGrid";
import { Button } from "@/components/ui/Button";
import { shopifyFetch } from "@/lib/shopify";
import { getCollectionProductsQuery, getProductsQuery } from "@/lib/shopify/queries";

import { Metadata } from "next";

interface CollectionPageProps {
    params: Promise<{
        handle: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
    const { handle } = await params;

    if (handle === "all") {
        return {
            title: "All Products | TGE Store",
            description: "Explore our complete collection of premium essentials. Dailywear redefined.",
            openGraph: {
                title: "All Products | TGE Store",
                description: "Explore our complete collection of premium essentials. Dailywear redefined.",
                type: "website"
            }
        };
    }

    const res = await shopifyFetch<any>({
        query: getCollectionProductsQuery,
        variables: { handle }
    });

    const collection = res?.collection;

    if (!collection) {
        return {
            title: "Collection Not Found | TGE Store"
        };
    }

    return {
        title: `${collection.title} | TGE Store`,
        description: collection.description || `Explore our ${collection.title} collection. Quality essentials for the modern wardrobe.`,
        openGraph: {
            title: `${collection.title} | TGE Store`,
            description: collection.description || `Explore our ${collection.title} collection. Quality essentials for the modern wardrobe.`,
            images: collection.image?.url ? [{ url: collection.image.url }] : [],
            type: "website"
        }
    };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
    const { handle } = await params;
    const { sort } = await searchParams;

    // Helper to resolve Sort Key based on context (All vs Collection) and URL param
    const getSortValues = (sortParam: string | undefined, isAllProducts: boolean) => {
        switch (sortParam) {
            case 'price-asc':
                return { sortKey: 'PRICE', reverse: false };
            case 'price-desc':
                return { sortKey: 'PRICE', reverse: true };
            case 'best-selling':
                return { sortKey: 'BEST_SELLING', reverse: false };
            case 'created-desc':
            default:
                return { sortKey: isAllProducts ? 'CREATED_AT' : 'CREATED', reverse: true };
        }
    };

    const isAll = handle === "all";
    const { sortKey, reverse } = getSortValues(sort as string, isAll);

    let products: any[] = [];
    let collectionTitle = "All Products";
    let collectionDescription = "";
    let collectionCount = 0;

    try {
        if (isAll) {
            // Fetch All Products directly
            const { products: fetchedProducts } = await shopifyFetch<{ products: { edges: any[] } }>({
                query: getProductsQuery,
                variables: {
                    query: "",
                    sortKey,
                    reverse
                }
            });

            collectionDescription = "Explore our complete collection of premium essentials. Dailywear redefined.";

            // Mapping
            products = fetchedProducts.edges.map((item: any) => {
                const p = item.node;
                const thumbnail = p.featuredImage?.url || p.images?.edges?.[0]?.node?.url;
                const hoverImage = p.images?.edges?.[1]?.node?.url || thumbnail;
                const price = parseFloat(p.priceRange?.minVariantPrice?.amount || "0");

                return {
                    id: p.id,
                    title: p.title,
                    price: price,
                    currencyCode: p.priceRange?.minVariantPrice?.currencyCode || "INR",
                    handle: p.handle,
                    thumbnail: thumbnail,
                    images: { main: thumbnail, hover: hoverImage },
                    tags: p.tags, // Map tags
                    defaultVariantId: p.variants?.edges?.[0]?.node?.id,
                    variants: p.variants?.edges?.map((e: any) => e.node) || []
                };
            });
            collectionCount = products.length; // Approximate for now

        } else {
            // Fetch Collection by Handle
            const res = await shopifyFetch<any>({
                query: getCollectionProductsQuery,
                variables: {
                    handle: handle,
                    sortKey,
                    reverse
                }
            });

            const collection = res?.collection;

            if (collection) {
                collectionTitle = collection.title;
                collectionDescription = collection.description || `Explore our ${collection.title} collection. Quality essentials for the modern wardrobe.`;

                products = collection.products.edges.map((item: any) => {
                    const p = item.node;
                    const thumbnail = p.featuredImage?.url || p.images?.edges?.[0]?.node?.url;
                    const hoverImage = p.images?.edges?.[1]?.node?.url || thumbnail;
                    const price = parseFloat(p.priceRange?.minVariantPrice?.amount || "0");

                    return {
                        id: p.id,
                        title: p.title,
                        price: price,
                        currencyCode: p.priceRange?.minVariantPrice?.currencyCode || "INR",
                        handle: p.handle,
                        thumbnail: thumbnail,
                        images: { main: thumbnail, hover: hoverImage },
                        tags: p.tags, // Map tags
                        defaultVariantId: p.variants?.edges?.[0]?.node?.id,
                        variants: p.variants?.edges?.map((e: any) => e.node) || []
                    };
                });
                collectionCount = products.length;
            } else {
                collectionTitle = "Collection Not Found";
            }
        }
    } catch (e) {
        console.error("Failed to fetch collection data:", e);
    }

    return (
        <div className="bg-zinc-50 min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 pt-24 pb-24">
                <div className="container mx-auto px-4 max-w-7xl">

                    {/* Header Section */}
                    <CollectionHeader
                        title={collectionTitle}
                        description={collectionDescription}
                        count={collectionCount}
                    />

                    {/* Filter Bar (Sticky) */}
                    <div className="sticky top-[80px] z-40 bg-zinc-50/95 backdrop-blur-sm py-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all">
                        <FilterBar />
                    </div>

                    {/* Product Grid */}
                    {products.length > 0 ? (
                        <ProductGrid products={products} />
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-zinc-500">No products found in this collection.</p>
                            <p className="text-sm text-zinc-400 mt-2">Try checking back later!</p>
                        </div>
                    )}
                </div>
            </main>

        </div>
    );
}

