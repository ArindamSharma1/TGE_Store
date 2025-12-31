import { Metadata } from "next";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { FilterSidebar } from "@/components/modules/FilterSidebar";
import { ProductGrid } from "@/components/modules/ProductGrid";
import { Button } from "@/components/ui/Button";

// Mock Data
const MOCK_PRODUCTS = Array.from({ length: 9 }).map((_, i) => ({
    id: `prod_${i}`,
    title: [
        "Oversized Cotton T-Shirt",
        "Slim Fit Denim Jeans",
        "Wool Blend Coat",
        "Leather Chelsea Boots",
        "Knitted Crew Neck Jumper"
    ][i % 5],
    price: [45, 120, 250, 180, 85][i % 5],
    handle: `product-${i}`,
    images: {
        main: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop"
        ][i % 3],
        hover: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1887&auto=format&fit=crop"
    }
}));

interface CollectionPageProps {
    params: Promise<{
        handle: string;
    }>
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
    const { handle } = await params;
    // Decode handle: "new-arrivals" -> "New Arrivals"
    const title = handle.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    return {
        title: `${title} | TGE Store`,
        description: `Shop the latest ${title} collection at TGE Store.`,
    };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
    const { handle } = await params;
    // In a real app, strict mode might complain about async params in newer Next.js versions. 
    // For now simple prop usage.

    return (
        <>
            <Header />
            <main className="pb-24 pt-8 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
                <div className="flex items-baseline justify-between border-b border-border pb-6 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-charcoal-black uppercase">
                        {/* Decoded handle or Title from DB */}
                        Collection Name
                    </h1>

                    <div className="flex items-center">
                        <span className="text-sm text-secondary-text mr-2">Sort by:</span>
                        <select className="text-sm font-medium text-charcoal-black bg-transparent border-none focus:ring-0">
                            <option>Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-12">
                    {/* Sidebar */}
                    <FilterSidebar />

                    {/* Product Grid */}
                    <div className="flex-1">
                        <ProductGrid products={MOCK_PRODUCTS} />

                        <div className="mt-16 flex justify-center">
                            <Button variant="outline" size="lg">Load More</Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
