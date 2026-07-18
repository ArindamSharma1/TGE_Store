interface CollectionHeaderProps {
    title: string;
    description?: string;
    count?: number;
    handle?: string;
}

const COLLECTION_META: Record<string, { headline: string; subheadline: string; field: string }> = {
    uniforms: {
        headline: "Uniforms / Daily",
        subheadline: "For the first train,\nthe last meeting,\nand everything between.",
        field: "CONDITION: DAILY",
    },
    layers: {
        headline: "Layers / System",
        subheadline: "The structural layer.\nThe transition layer.\nThe final layer.",
        field: "CONDITION: ALL",
    },
    objects: {
        headline: "Objects / Carry",
        subheadline: "Functional objects\nbuilt for movement\nand daily friction.",
        field: "CONDITION: TRANSIT",
    },
    "new-system": {
        headline: "New System / 01",
        subheadline: "The latest edition\nof the daily uniform.\nFirst access.",
        field: "EDITION: 01",
    },
    default: {
        headline: "",
        subheadline: "A curated selection\nof field-tested objects.",
        field: "FIELD: ALL",
    },
};

export function CollectionHeader({ title, description, count, handle }: CollectionHeaderProps) {
    const meta = (handle && COLLECTION_META[handle]) || COLLECTION_META.default;
    const displayHeadline = meta.headline || title;
    const displaySubheadline = meta.subheadline || description || "";

    return (
        <div className="mb-spacing-section-gap pt-24 lg:pt-32 border-b border-graphite/20 pb-spacing-section-inner">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
                <div>
                    <p className="text-mono text-acid mb-spacing-component">{meta.field}</p>
                    <h1 className="text-display-l uppercase mb-spacing-component leading-none">
                        {displayHeadline.split(" / ").map((part, i) => (
                            <span key={i} className="block">{part}</span>
                        ))}
                    </h1>
                    <p className="text-body-large text-graphite max-w-lg whitespace-pre-line">
                        {displaySubheadline}
                    </p>
                </div>

                {count !== undefined && count > 0 && (
                    <div className="text-left lg:text-right flex-shrink-0">
                        <p className="text-mono text-graphite">
                            {count.toString().padStart(2, "0")} OBJECTS
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
