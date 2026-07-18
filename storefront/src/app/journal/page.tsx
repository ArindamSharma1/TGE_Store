import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Field Notes | TGE",
    description: "Materials, movement, construction, and after-hours — documented from the field.",
};

const FIELD_NOTES = [
    {
        slug: "what-a-daily-trouser-means",
        category: "FIELD NOTES",
        date: "EDITION 01",
        title: "What a daily trouser actually means.",
        excerpt: "We spent three months wearing the same pair. Here is what we found out.",
        field: "CONDITION: DAILY",
    },
    {
        slug: "material-study-cotton-twill",
        category: "MATERIALS",
        date: "EDITION 01",
        title: "320 GSM Cotton Twill — a material study.",
        excerpt: "Weight, weave, DWR treatment, and what it costs to build something that outlasts the season.",
        field: "MATERIAL: COTTON",
    },
    {
        slug: "in-motion-delhi-monsoon",
        category: "PEOPLE & PLACES",
        date: "FIELD 01 — DELHI",
        title: "In motion during the monsoon.",
        excerpt: "The Transit Shell in forty-two days of variable rain. Notes from the field.",
        field: "CONDITION: TRANSIT",
    },
    {
        slug: "after-hours-construction",
        category: "CONSTRUCTION",
        date: "EDITION 01",
        title: "Why the seam placement matters after hours.",
        excerpt: "The structural decisions that make the Shift Overshirt feel different at midnight.",
        field: "CONDITION: AFTER HOURS",
    },
];

export default function JournalPage() {
    return (
        <main className="min-h-screen bg-chalk text-carbon pt-16">
            <div className="max-w-[1600px] mx-auto px-spacing-component">

                {/* Header */}
                <div className="pt-spacing-editorial pb-spacing-section-inner border-b border-graphite/20">
                    <p className="text-mono text-acid mb-spacing-component">TGE / JOURNAL</p>
                    <h1 className="text-display-l uppercase leading-none mb-4">Field Notes</h1>
                    <p className="text-body text-graphite">
                        Materials, movement, construction, and after-hours — documented from the field.
                    </p>
                </div>

                {/* Category Filters */}
                <div className="flex gap-spacing-control border-b border-graphite/20 py-4 overflow-x-auto">
                    {["All", "Field Notes", "Materials", "People & Places", "Construction"].map((cat) => (
                        <button
                            key={cat}
                            className="text-meta uppercase text-graphite hover:text-carbon flex-shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Articles */}
                <div className="py-spacing-section-gap grid grid-cols-1 md:grid-cols-2 gap-x-spacing-component gap-y-spacing-section-inner">
                    {FIELD_NOTES.map((note, i) => (
                        <article key={note.slug} className={i === 0 ? "md:col-span-2" : ""}>
                            <Link
                                href={`/journal/${note.slug}`}
                                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
                            >
                                {/* Image placeholder */}
                                <div className={`bg-fog mb-6 overflow-hidden ${i === 0 ? "aspect-[16/7]" : "aspect-[4/3]"}`}>
                                    <div className="w-full h-full flex items-end p-spacing-component bg-gradient-to-t from-carbon/30 to-transparent">
                                        <span className="text-mono text-bone">{note.field}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-mono text-acid">{note.category}</span>
                                        <span className="text-mono text-graphite">{note.date}</span>
                                    </div>
                                    <h2 className="text-heading uppercase mb-3 group-hover:text-acid transition-colors">
                                        {note.title}
                                    </h2>
                                    <p className="text-body text-graphite">{note.excerpt}</p>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>

            </div>
        </main>
    );
}
