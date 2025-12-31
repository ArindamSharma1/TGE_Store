import { Metadata } from "next";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { ProductGallery } from "@/components/modules/ProductGallery";
import { ProductInfo } from "@/components/modules/ProductInfo";

// Mock Data
const MOCK_PRODUCT = {
    id: "prod_1",
    title: "Oversized Cotton T-Shirt",
    price: 45,
    description: "Crafted from premium heavy-weight cotton, this oversized t-shirt features a dropped shoulder design for a relaxed, modern silhouette. A wardrobe essential that combines comfort with effortless style.",
    images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1887&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop"
    ]
};

interface ProductPageProps {
    params: Promise<{
        handle: string;
    }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    // In a real app, fetch product data using params.handle
    // const { handle } = await params; 

    const title = MOCK_PRODUCT.title;
    const description = MOCK_PRODUCT.description.substring(0, 160);

    return {
        title: `${title} | TGE Store`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [MOCK_PRODUCT.images[0]],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { handle } = await params;
    return (
        <>
            <Header />
            <main className="pb-24 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Breadcrumb could go here */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    <ProductGallery images={MOCK_PRODUCT.images} />
                    <ProductInfo
                        title={MOCK_PRODUCT.title}
                        price={MOCK_PRODUCT.price}
                        description={MOCK_PRODUCT.description}
                    />
                </div>
            </main>
            <Footer />
        </>
    );
}
