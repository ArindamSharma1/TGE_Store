import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { CollectionHeader } from "@/components/modules/CollectionHeader";
import { FilterBar } from "@/components/modules/FilterBar";
import { ProductGrid } from "@/components/modules/ProductGrid";
import { Button } from "@/components/ui/Button";

// Mock Data (Enhanced with array images for the new card)
const MOCK_PRODUCTS = Array.from({ length: 9 }).map((_, i) => ({
    id: `prod_${i}`,
    title: [
        "Oversized Cotton T-Shirt",
        "Slim Fit Denim Jeans",
        "Wool Blend Coat",
        "Leather Chelsea Boots",
        "Knitted Crew Neck Jumper",
        "Silk Button Up",
        "Pleated Trousers",
        "Tech Runner 2000",
        "Crossbody Bag"
    ][i % 9],
    price: [45, 120, 250, 180, 85, 150, 95, 210, 65][i % 9],
    handle: `product-${i}`,
    images: {
        main: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1618932260643-2b672a8d3107?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
        ][i % 6],
        hover: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1887&auto=format&fit=crop"
    }
}));

interface CollectionPageProps {
    params: Promise<{
        handle: string;
    }>
}

export default async function CollectionPage({ params }: CollectionPageProps) {
    const { handle } = await params;

    // Simple logic to format title
    const formattedTitle = handle === "all" ? "All Products" : handle.replace(/-/g, " ");

    return (
        <div className="bg-zinc-50 min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 pt-24 pb-24">
                <div className="container mx-auto px-4 max-w-7xl">

                    {/* Header Section */}
                    <CollectionHeader
                        title={formattedTitle}
                        description="Explore our latest collection of essentials designed for the modern wardrobe. Sustainability meets style."
                        count={MOCK_PRODUCTS.length}
                    />

                    {/* Filter Bar (Sticky) */}
                    <div className="sticky top-[80px] z-40 bg-zinc-50/95 backdrop-blur-sm py-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all">
                        <FilterBar />
                    </div>

                    {/* Product Grid */}
                    <ProductGrid products={MOCK_PRODUCTS} />

                    {/* Load More */}
                    <div className="mt-20 flex flex-col items-center gap-4">
                        <span className="text-xs text-zinc-400 font-medium">Showing 9 of 45 products</span>
                        <div className="w-48 h-1 bg-zinc-200 rounded-full overflow-hidden">
                            <div className="w-1/4 h-full bg-zinc-900 rounded-full"></div>
                        </div>
                        <Button variant="outline" size="lg" className="rounded-full px-8 mt-2">
                            Load More
                        </Button>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
