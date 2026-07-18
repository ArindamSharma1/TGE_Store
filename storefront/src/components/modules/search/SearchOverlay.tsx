"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/context/SearchContext";
import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/shopify/queries";

const CONTEXTUAL_SEARCHES = [
    "Daily Trouser",
    "Transit Shell",
    "Overshirt",
    "After Hours",
    "Layer",
    "Field Tee",
    "Material",
    "Uniform",
];

export function SearchOverlay() {
    const { isOpen, closeSearch } = useSearch();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery("");
            setResults([]);
        }
    }, [isOpen]);

    // Keyboard close
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeSearch();
        };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, closeSearch]);

    // Debounced search
    useEffect(() => {
        const run = async () => {
            if (!query.trim()) { setResults([]); return; }
            setIsSearching(true);
            try {
                const res = await shopifyFetch<{ products: { edges: any[] } }>({
                    query: getProductsQuery,
                    variables: { query: `title:${query}*` },
                    cache: "no-store",
                });
                setResults(res?.products?.edges?.map((e: any) => e.node) || []);
            } catch {
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        };
        const t = setTimeout(run, 250);
        return () => clearTimeout(t);
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-[60] bg-chalk flex flex-col"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Search TGE"
                >
                    {/* Top Row */}
                    <div className="flex items-center justify-between px-6 md:px-spacing-component py-5 border-b border-graphite/20">
                        <p className="text-mono text-graphite">SEARCH TGE</p>
                        <button
                            onClick={closeSearch}
                            className="text-meta uppercase text-graphite hover:text-carbon transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
                            aria-label="Close search"
                        >
                            Close [Esc]
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="px-6 md:px-spacing-component py-8 border-b border-graphite/20">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="What are you looking for?"
                                className="w-full bg-transparent text-display-m uppercase font-serif placeholder:text-graphite/30 outline-none focus-visible:outline-none text-carbon caret-acid"
                                aria-label="Search query"
                                autoComplete="off"
                                spellCheck="false"
                            />
                            {isSearching && (
                                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-mono text-graphite animate-pulse">
                                    Searching…
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="flex-1 overflow-y-auto px-6 md:px-spacing-component py-8">

                        {/* Empty state — show contextual suggestions */}
                        {!query && (
                            <div>
                                <p className="text-mono text-graphite mb-spacing-component">CONTEXTUAL SEARCHES</p>
                                <div className="flex flex-wrap gap-3 mb-spacing-section-gap">
                                    {CONTEXTUAL_SEARCHES.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => setQuery(term)}
                                            className="px-4 py-2 border border-graphite/30 text-meta uppercase text-graphite hover:border-carbon hover:text-carbon hover:bg-carbon hover:text-bone transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>

                                <p className="text-mono text-graphite mb-4">COLLECTIONS</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[
                                        { label: "New System", href: "/collections/new-system" },
                                        { label: "Uniforms", href: "/collections/uniforms" },
                                        { label: "Layers", href: "/collections/layers" },
                                        { label: "Objects", href: "/collections/objects" },
                                        { label: "Field Notes", href: "/journal" },
                                        { label: "All Objects", href: "/collections/all" },
                                    ].map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={closeSearch}
                                            className="flex items-center justify-between py-3 border-b border-graphite/20 text-body uppercase hover:text-acid group transition-colors"
                                        >
                                            <span>{link.label}</span>
                                            <span className="text-acid opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Has query — show results or no-results */}
                        {query && !isSearching && (
                            <div>
                                <p className="text-mono text-graphite mb-6">
                                    {results.length > 0
                                        ? `${results.length} RESULT${results.length > 1 ? "S" : ""} FOR "${query.toUpperCase()}"`
                                        : `NO RESULTS FOR "${query.toUpperCase()}"`
                                    }
                                </p>

                                {results.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {results.map((product) => {
                                            const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
                                            const formattedPrice = new Intl.NumberFormat("en-IN", {
                                                style: "currency", currency: "INR", minimumFractionDigits: 0,
                                            }).format(price);
                                            return (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.handle}`}
                                                    onClick={closeSearch}
                                                    className="flex gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
                                                >
                                                    <div className="relative w-20 h-24 bg-fog flex-shrink-0 overflow-hidden">
                                                        {product.featuredImage?.url && (
                                                            <Image
                                                                src={product.featuredImage.url}
                                                                alt={product.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <p className="text-body font-medium uppercase group-hover:text-acid transition-colors">{product.title}</p>
                                                        <p className="text-mono text-graphite mt-1">{formattedPrice}</p>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-body text-graphite mb-6">
                                            Nothing matched. Try a different field.
                                        </p>
                                        <button
                                            onClick={() => setQuery("")}
                                            className="text-meta uppercase underline underline-offset-4 text-graphite hover:text-carbon transition-colors"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
