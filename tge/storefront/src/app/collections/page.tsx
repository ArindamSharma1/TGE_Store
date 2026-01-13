import { Header } from "@/components/global/Header";
import { GlassCard } from "@/components/ui/GlassCard";
import Image from "next/image";
import Link from "next/link";

const COLLECTIONS = [
    {
        title: "Men",
        handle: "men",
        image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Women",
        handle: "women",
        image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "New Arrivals",
        handle: "new-arrivals",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Accessories",
        handle: "accessories",
        image: "https://images.unsplash.com/photo-1618932260643-2b672a8d3107?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Streetwear",
        handle: "streetwear",
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Outerwear",
        handle: "outerwear",
        image: "https://images.unsplash.com/photo-1551488852-080175b92789?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Denim",
        handle: "denim",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Footwear",
        handle: "footwear",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop"
    }
];

export default function CollectionsPage() {
    return (
        <div className="bg-zinc-50 min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 pt-32 pb-24">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="mb-12 text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 mb-4">
                            Collections
                        </h1>
                        <p className="text-zinc-500 max-w-lg">
                            Explore our curated categories. Defines the new standard for modern fashion retail.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {COLLECTIONS.map((collection) => (
                            <Link key={collection.handle} href={`/collections/${collection.handle}`} className="group block">
                                <GlassCard className="relative aspect-[3/4] overflow-hidden bg-white border-zinc-100 transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                                    <Image
                                        src={collection.image}
                                        alt={collection.title}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h2 className="text-2xl font-bold text-white uppercase tracking-tighter drop-shadow-md group-hover:translate-x-1 transition-transform duration-300">
                                            {collection.title}
                                        </h2>
                                    </div>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

        </div>
    );
}
