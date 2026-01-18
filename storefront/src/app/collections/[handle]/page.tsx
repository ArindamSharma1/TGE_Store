import { Header } from "@/components/global/Header";
import { CollectionHeader } from "@/components/modules/CollectionHeader";
import { FilterBar } from "@/components/modules/FilterBar";
import { ProductGrid } from "@/components/modules/ProductGrid";
import { Button } from "@/components/ui/Button";
import { shopifyFetch } from "@/lib/shopify";
import { getCollectionProductsQuery, getProductsQuery } from "@/lib/shopify/queries";

interface CollectionPageProps {
    params: Promise<{
        handle: string;
    }>
}

export default async function CollectionPage({ params }: CollectionPageProps) {
    const { handle } = await params;

    let products: any[] = [];
    let collectionTitle = "All Products";
    let collectionCount = 0;

    try {
        if (handle === "all") {
            // Fetch All Products directly
            const { products: fetchedProducts } = await shopifyFetch<{ products: { edges: any[] } }>({
                query: getProductsQuery,
                variables: {
                    query: "" // Empty query fetches all
                }
            });

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
                    handle: handle
                }
            });

            const collection = res?.collection;

            if (collection) {
                collectionTitle = collection.title;

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
                        description={`Explore our ${collectionTitle} collection. Quality essentials for the modern wardrobe.`}
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

