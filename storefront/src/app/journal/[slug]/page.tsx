import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const FIELD_NOTES: Record<string, {
    category: string;
    date: string;
    title: string;
    body: string[];
    field: string;
    relatedSlug?: string;
    relatedTitle?: string;
}> = {
    "what-a-daily-trouser-means": {
        category: "FIELD NOTES",
        date: "EDITION 01",
        title: "What a daily trouser actually means.",
        field: "CONDITION: DAILY",
        body: [
            "We wore the same pair of daily trousers for ninety consecutive days. No special occasions. No exceptions. The commute, the meeting, the evening.",
            "What we found was unexpected: the difficulty was never physical. The garment held up. The difficulty was psychological — the idea that repetition is resignation. That the same pair worn again is somehow less.",
            "It isn't. Repetition is clarity. The moment you stop deciding what to wear, you start deciding what to do.",
            "The daily trouser is not a product. It is a commitment to a system. To the idea that getting dressed should cost you nothing, so that living costs you everything you have.",
        ],
        relatedSlug: "material-study-cotton-twill",
        relatedTitle: "320 GSM Cotton Twill — a material study.",
    },
    "material-study-cotton-twill": {
        category: "MATERIALS",
        date: "EDITION 01",
        title: "320 GSM Cotton Twill — a material study.",
        field: "MATERIAL: COTTON",
        body: [
            "Weight is not just about warmth. At 320 GSM, a cotton twill carries itself. It holds a crease without effort. It hangs with authority. It doesn't ask for anything from you.",
            "We chose this weight because it crosses the boundary between structured and casual without negotiating. You can wear it through a meeting and into an evening without the garment announcing itself.",
            "The DWR treatment — durable water repellent — is not a marketing claim. It is a measured response to the reality of Indian monsoons, unexpected rain, and the friction of transit in humid urban environments.",
            "We do not use the word 'premium' to describe this fabric. Premium is a feeling manufactured by price. This fabric earns its weight in use.",
        ],
    },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const note = FIELD_NOTES[slug];
    if (!note) return { title: "Field Note Not Found | TGE" };
    return {
        title: `${note.title} | TGE Journal`,
        description: note.body[0].slice(0, 160),
    };
}

export default async function JournalSlugPage({ params }: Props) {
    const { slug } = await params;
    const note = FIELD_NOTES[slug];
    if (!note) notFound();

    return (
        <main className="min-h-screen bg-bone text-carbon pt-16">
            <div className="max-w-[1600px] mx-auto px-spacing-component">

                {/* Article Header */}
                <div className="pt-spacing-editorial pb-spacing-section-inner border-b border-graphite/20 grid grid-cols-1 lg:grid-cols-12 gap-spacing-section-inner">
                    <div className="lg:col-span-8">
                        <div className="flex gap-spacing-component mb-spacing-component">
                            <span className="text-mono text-acid">{note.category}</span>
                            <span className="text-mono text-graphite">{note.date}</span>
                        </div>
                        <h1 className="text-display-l uppercase leading-none">{note.title}</h1>
                    </div>
                    <div className="lg:col-span-4 flex items-end justify-end">
                        <p className="text-mono text-graphite">{note.field}</p>
                    </div>
                </div>

                {/* Hero Image Placeholder */}
                <div className="aspect-[16/7] bg-fog my-spacing-section-inner flex items-end p-spacing-component">
                    <span className="text-mono text-graphite/50">// IMAGE PLACEHOLDER — replace with field photography</span>
                </div>

                {/* Article Body */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-spacing-section-gap pb-spacing-editorial">
                    <div className="lg:col-span-7 lg:col-start-4 flex flex-col gap-8">
                        {note.body.map((paragraph, i) => (
                            <p key={i} className="text-body-large text-graphite leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Related */}
                {note.relatedSlug && (
                    <div className="border-t border-graphite/20 py-spacing-section-gap">
                        <p className="text-mono text-graphite mb-6">NEXT FIELD NOTE</p>
                        <Link
                            href={`/journal/${note.relatedSlug}`}
                            className="group flex items-baseline gap-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
                        >
                            <span className="text-mono text-acid">→</span>
                            <span className="text-heading uppercase group-hover:text-acid transition-colors">
                                {note.relatedTitle}
                            </span>
                        </Link>
                    </div>
                )}

                <div className="border-t border-graphite/20 py-6">
                    <Link
                        href="/journal"
                        className="text-meta uppercase text-graphite hover:text-carbon transition-colors underline underline-offset-4"
                    >
                        All Field Notes
                    </Link>
                </div>

            </div>
        </main>
    );
}
