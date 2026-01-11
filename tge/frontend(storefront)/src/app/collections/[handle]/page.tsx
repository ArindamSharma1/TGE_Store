import { Header } from "@/components/global/Header";
import { CollectionHeader } from "@/components/modules/CollectionHeader";
import { FilterBar } from "@/components/modules/FilterBar";
import { ProductGrid } from "@/components/modules/ProductGrid";
import { Button } from "@/components/ui/Button";
import { medusaClient } from "@/lib/medusa/client";

interface CollectionPageProps {
    params: Promise<{
        handle: string;
    }>
}

export default async function CollectionPage({ params }: CollectionPageProps) {
    const { handle } = await params;

    // Helper: Map Medusa Product to UI Product
    const mapProduct = (p: any) => {
        // Fallback price logic still useful for initial SSR, but ProductCard will refine it
        const lowestPrice = p.variants?.[0]?.calculated_price?.calculated_amount ||
            p.variants?.[0]?.prices?.[0]?.amount || 0;

        return {
            id: p.id,
            title: p.title,
            price: lowestPrice / 100, // Medusa stores in cents
            handle: p.handle,
            images: {
                main: p.thumbnail || "",
                // Fallback to second image if available, else thumbnail
                hover: p.images?.[1]?.url || p.images?.[0]?.url || p.thumbnail || ""
            },
            variants: p.variants // Pass variants
        };
    };

    let products = [];
    let collectionTitle = "All Products";
    let collectionCount = 0;

    try {
        if (handle === "all") {
            const { products: fetchedProducts, count } = await medusaClient.store.product.list({
                fields: "+variants.prices,+variants.calculated_price,+images",
                limit: 50 // Initial limit
            });
            products = fetchedProducts.map(mapProduct);
            collectionCount = count;
        } else {
            // 1. Get Collection ID by Handle
            // Medusa V2: List collections and filter by handle
            const { collections } = await medusaClient.store.collection.list({
                handle: handle,
                limit: 1
            });

            const collection = collections[0];

            if (collection) {
                collectionTitle = collection.title;

                // 2. Get Products for this Collection
                const { products: fetchedProducts, count } = await medusaClient.store.product.list({
                    collection_id: collection.id,
                    fields: "+variants.prices,+variants.calculated_price,+images",
                    limit: 50
                });

                products = fetchedProducts.map(mapProduct);
                collectionCount = count;
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

                    {/* Load More (Hidden if no more products - for now static check) */}
                    {collectionCount > 50 && (
                        <div className="mt-20 flex flex-col items-center gap-4">
                            <span className="text-xs text-zinc-400 font-medium">Showing {products.length} of {collectionCount} products</span>
                            <div className="w-48 h-1 bg-zinc-200 rounded-full overflow-hidden">
                                <div className="w-1/4 h-full bg-zinc-900 rounded-full"></div>
                            </div>
                            <Button variant="outline" size="lg" className="rounded-full px-8 mt-2">
                                Load More
                            </Button>
                        </div>
                    )}

                </div>
            </main>

        </div>
    );
}
