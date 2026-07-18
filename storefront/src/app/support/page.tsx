import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Support | TGE",
    description: "Delivery, returns, sizing, care, and order support for TGE.",
};

const SUPPORT_SECTIONS = [
    {
        id: "delivery",
        title: "Delivery",
        items: [
            { q: "How long does delivery take?", a: "Standard delivery within India takes 3–5 business days. Remote locations may require up to 7 days." },
            { q: "Do you ship internationally?", a: "Not yet. We ship across India. International shipping is being tested for Edition 02." },
            { q: "How is the order packaged?", a: "All objects ship in minimal, recyclable packaging. No filler, no excess." },
        ],
    },
    {
        id: "returns",
        title: "Returns",
        items: [
            { q: "What is the return window?", a: "30 days from delivery, unworn, with original packaging." },
            { q: "How do I initiate a return?", a: "Email us at returns@tgestore.com with your order number. We will arrange collection." },
            { q: "Are there items I cannot return?", a: "Final sale items and custom objects are non-returnable. This is clearly marked at purchase." },
        ],
    },
    {
        id: "sizing",
        title: "Sizing",
        items: [
            { q: "What fit system does TGE use?", a: "Each object specifies its fit as Close, Standard, or Relaxed. We recommend reading the fit note on each product page before selecting size." },
            { q: "How do I measure myself?", a: "We provide a measurement guide on each product page. Use a soft tape. Measure over base layers." },
        ],
    },
    {
        id: "care",
        title: "Care",
        items: [
            { q: "How should I wash TGE objects?", a: "Machine wash cold, inside-out, on a gentle cycle. Hang to dry. Do not tumble dry. Do not iron directly on prints." },
            { q: "How do I maintain the DWR coating?", a: "After washing, brief tumble-dry on low heat activates the DWR coating. Otherwise, re-activate with a cool iron through a damp cloth." },
        ],
    },
    {
        id: "orders",
        title: "Order Support",
        items: [
            { q: "I have a problem with my order. Who do I contact?", a: "Email support@tgestore.com. Include your order number. We respond within 24 hours, Monday–Saturday." },
            { q: "Can I modify or cancel an order?", a: "Orders can be cancelled within 1 hour of placement. After that, the fulfilment system has already begun. Contact us immediately if needed." },
        ],
    },
];

export default function SupportPage() {
    return (
        <main className="min-h-screen bg-bone text-carbon pt-16">
            <div className="max-w-[1600px] mx-auto px-spacing-component">

                {/* Header */}
                <div className="pt-spacing-editorial pb-spacing-section-inner border-b border-graphite/20">
                    <p className="text-mono text-acid mb-spacing-component">TGE / SUPPORT</p>
                    <h1 className="text-display-l uppercase leading-none mb-4">Support</h1>
                    <p className="text-body text-graphite">
                        Delivery, returns, sizing, care, and order questions.
                    </p>
                </div>

                {/* Quick Contact */}
                <div className="py-spacing-section-inner border-b border-graphite/20">
                    <p className="text-meta uppercase text-graphite mb-4">DIRECT CONTACT</p>
                    <div className="flex flex-col md:flex-row gap-spacing-control">
                        <a href="mailto:support@tgestore.com" className="text-body hover:text-acid transition-colors underline underline-offset-4">
                            support@tgestore.com
                        </a>
                        <span className="text-graphite hidden md:block">—</span>
                        <p className="text-body text-graphite">Monday–Saturday, 10:00–18:00 IST</p>
                    </div>
                </div>

                {/* FAQ Sections */}
                <div className="py-spacing-section-gap grid grid-cols-1 lg:grid-cols-2 gap-x-spacing-section-gap gap-y-spacing-section-inner">
                    {SUPPORT_SECTIONS.map((section) => (
                        <div key={section.id} id={section.id}>
                            <h2 className="text-heading uppercase mb-spacing-section-inner border-b border-graphite/20 pb-4">
                                {section.title}
                            </h2>
                            <div className="flex flex-col gap-6">
                                {section.items.map((item) => (
                                    <div key={item.q}>
                                        <p className="text-body font-medium mb-2">{item.q}</p>
                                        <p className="text-body text-graphite">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="border-t border-graphite/20 py-spacing-section-gap flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <p className="text-body text-graphite">Still need help? We are here.</p>
                    <a
                        href="mailto:support@tgestore.com"
                        className="border border-carbon text-carbon px-8 py-4 text-meta uppercase tracking-widest hover:bg-carbon hover:text-bone transition-colors"
                    >
                        Email Support
                    </a>
                </div>

            </div>
        </main>
    );
}
