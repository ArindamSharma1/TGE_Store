import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Collections | TGE",
    description: "Field-tested objects organised by condition. The daily uniform system.",
};

const COLLECTIONS = [
    {
        title: "New System",
        handle: "new-system",
        field: "EDITION 01",
        description: "First access.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
        wide: true,
    },
    {
        title: "Uniforms",
        handle: "uniforms",
        field: "CONDITION: DAILY",
        description: "The long middle.",
        image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop",
    },
    {
        title: "Layers",
        handle: "layers",
        field: "CONDITION: OUTER",
        description: "Structure over movement.",
        image: "https://images.unsplash.com/photo-1551488852-080175b92789?q=80&w=800&auto=format&fit=crop",
    },
    {
        title: "Objects",
        handle: "objects",
        field: "CONDITION: CARRY",
        description: "Field-tested carry.",
        image: "https://images.unsplash.com/photo-1618932260643-2b672a8d3107?q=80&w=800&auto=format&fit=crop",
    },
    {
        title: "All Objects",
        handle: "all",
        field: "SYSTEM: ALL",
        description: "Every object in the system.",
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
    },
];

export default function CollectionsPage() {
    return (
        <main className="min-h-screen bg-bone text-carbon pt-16">
            <div className="max-w-[1600px] mx-auto px-spacing-component">

                <div className="pt-spacing-editorial pb-spacing-section-inner border-b border-graphite/20">
                    <p className="text-mono text-acid mb-spacing-component">TGE / COLLECTIONS</p>
                    <h1 className="text-display-l uppercase leading-none mb-4">System Index</h1>
                    <p className="text-body text-graphite">Field-tested objects organised by condition.</p>
                </div>

                <div className="py-spacing-section-gap grid grid-cols-1 md:grid-cols-12 gap-spacing-component auto-rows-min">
                    {COLLECTIONS.map((collection, i) => {
                        const isWide = collection.wide;
                        return (
                            <Link
                                key={collection.handle}
                                href={`/collections/${collection.handle}`}
                                className={`group block relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid ${
                                    isWide ? "md:col-span-7" : "md:col-span-5"
                                }`}
                            >
                                <div className={`relative overflow-hidden bg-fog ${isWide ? "aspect-[4/3]" : "aspect-[3/4]"}`}>
                                    <Image
                                        src={collection.image}
                                        alt={collection.title}
                                        fill
                                        className="object-cover transition-all duration-700 group-hover:scale-[1.03]"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-carbon/50 to-transparent" />

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <p className="text-mono text-acid mb-2">{collection.field}</p>
                                        <h2 className="text-heading uppercase text-bone">{collection.title}</h2>
                                        <p className="text-meta text-bone/70 mt-1">{collection.description}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

            </div>
        </main>
    );
}
