"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search as SearchIcon, ChevronRight, ArrowRight, Loader2 } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/shopify/queries";

// ... (keep other imports)

const TRENDING_SEARCHES = [
    "Dailywear",
    "Outerwear",
    "Partywear",
    "College Wear",
    "Men",
    "Women"
];

export function SearchOverlay() {
    const { isOpen, closeSearch } = useSearch();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } else {
            setQuery("");
            setResults([]);
        }
    }, [isOpen]);

    // Real Search Logic
    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setIsSearching(true);
            try {
                // Fetch from Shopify
                const res = await shopifyFetch<{ products: { edges: any[] } }>({
                    query: getProductsQuery,
                    variables: {
                        query: `title:${query}*`, // Simple wildcard search
                        first: 6
                    },
                    cache: 'no-store' // Always fresh for search
                });

                const products = res?.products?.edges?.map((edge: any) => edge.node) || [];
                setResults(products);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearching(false);
            }
        };

        const debounce = setTimeout(fetchResults, 200);
        return () => clearTimeout(debounce);
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[60] bg-zinc-950/95 backdrop-blur-xl"
                >
                    {/* Noise Overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.05] z-0"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`
                        }}
                    />

                    {/* Header: Close Button */}
                    <div className="absolute top-6 right-6 z-20">
                        <div
                            onClick={closeSearch}
                            className="p-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                            <X className="w-8 h-8 text-zinc-500 group-hover:text-white transition-colors" />
                        </div>
                    </div>

                    <div className="w-full max-w-6xl mx-auto px-6 pt-32 h-full flex flex-col relative z-10">
                        {/* Search Input */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="relative border-b border-white/10 focus-within:border-white/40 transition-colors duration-500 pb-8 mb-16"
                        >
                            {isSearching ? (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                                </div>
                            ) : (
                                <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 text-zinc-600" />
                            )}
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="SEARCH..."
                                className="w-full bg-transparent text-6xl md:text-8xl font-black uppercase tracking-tighter text-white placeholder:text-zinc-800 outline-none pl-20"
                            />
                        </motion.div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">

                            {/* State 1: Empty Query -> Trending */}
                            {!query && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8">Trending Searches</p>
                                    <div className="flex flex-wrap gap-4 mb-16">
                                        {TRENDING_SEARCHES.map(term => (
                                            <button
                                                key={term}
                                                onClick={() => setQuery(term)}
                                                className="px-8 py-4 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-sm font-bold uppercase tracking-wide"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Link href="/collections/new-in" onClick={closeSearch} className="group relative h-48 rounded-2xl overflow-hidden bg-zinc-100 flex items-center justify-center">
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                            <span className="relative z-10 text-xl font-bold text-white flex items-center gap-2">
                                                Shop New Arrivals <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                                            </span>
                                        </Link>
                                        <Link href="/collections/best-sellers" onClick={closeSearch} className="group relative h-48 rounded-2xl overflow-hidden bg-zinc-900 flex items-center justify-center text-white">
                                            <span className="relative z-10 text-xl font-bold flex items-center gap-2">
                                                View Best Sellers <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                                            </span>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {/* State 2: Results */}
                            {query && (
                                <div className="space-y-6">
                                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                        {isSearching ? (
                                            "Searching..."
                                        ) : (
                                            results.length > 0 ? `Results for "${query}"` : `No results for "${query}"`
                                        )}
                                    </p>

                                    {!isSearching && results.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {results.map(product => {
                                                const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
                                                const currencyCode = product.priceRange?.minVariantPrice?.currencyCode || "INR";

                                                return (
                                                    <Link
                                                        key={product.id}
                                                        href={`/products/${product.handle}`}
                                                        onClick={closeSearch}
                                                        className="flex gap-4 p-4 rounded-2xl hover:bg-zinc-50 transition-colors group"
                                                    >
                                                        <div className="relative w-24 h-32 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={product.featuredImage?.url || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop"}
                                                                alt={product.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col justify-center">
                                                            <h4 className="text-lg font-bold text-zinc-900 group-hover:underline decoration-zinc-300 underline-offset-4">{product.title}</h4>
                                                            <span className="text-zinc-900 font-medium mt-2">
                                                                {price ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: currencyCode }).format(price) : "Price N/A"}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    ) : !isSearching && (
                                        <div className="py-20 text-center">
                                            <p className="text-zinc-400 text-lg">We couldn&apos;t find any matches.</p>
                                            <button onClick={() => setQuery("")} className="text-zinc-900 font-bold underline mt-4 hover:opacity-70">Clear search</button>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

