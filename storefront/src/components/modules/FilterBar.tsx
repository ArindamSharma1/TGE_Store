"use client";

import { cn } from "@/lib/utils/cn";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const SORT_OPTIONS = [
    { label: "Newest", value: "created-desc" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Best Selling", value: "best-selling" },
];

const FILTER_GROUPS = [
    {
        id: "use",
        label: "Use",
        options: ["Daily", "Work", "Travel", "After Hours", "Outer"],
    },
    {
        id: "fit",
        label: "Fit",
        options: ["Close", "Standard", "Relaxed"],
    },
    {
        id: "material",
        label: "Material",
        options: ["Cotton", "Nylon", "Wool", "Recycled"],
    },
    {
        id: "availability",
        label: "Availability",
        options: ["In Stock", "Pre-Order"],
    },
];

export function FilterBar({ resultCount }: { resultCount?: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [openGroup, setOpenGroup] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const currentSort = searchParams.get("sort") || "created-desc";
    const activeSort = SORT_OPTIONS.find((o) => o.value === currentSort)?.label || "Sort";

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const existing = params.getAll(key);
        if (existing.includes(value)) {
            params.delete(key);
            existing.filter((v) => v !== value).forEach((v) => params.append(key, v));
        } else {
            params.append(key, value);
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const setSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);
        router.replace(`?${params.toString()}`, { scroll: false });
        setOpenGroup(null);
    };

    const clearAll = () => {
        router.replace("?", { scroll: false });
        setOpenGroup(null);
    };

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpenGroup(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const hasFilters = FILTER_GROUPS.some(g => searchParams.getAll(g.id).length > 0);

    return (
        <div ref={ref} className="w-full relative">
            <div className="flex items-center justify-between border-b border-graphite/20 pb-3 gap-4 overflow-x-auto">
                <div className="flex items-center gap-spacing-control flex-nowrap min-w-max">
                    {/* Filter groups */}
                    {FILTER_GROUPS.map((group) => {
                        const selected = searchParams.getAll(group.id);
                        const isOpen = openGroup === group.id;
                        return (
                            <button
                                key={group.id}
                                onClick={() => setOpenGroup(isOpen ? null : group.id)}
                                className={cn(
                                    "text-meta uppercase flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
                                    selected.length > 0 ? "text-carbon" : "text-graphite hover:text-carbon",
                                    isOpen && "text-carbon"
                                )}
                                aria-expanded={isOpen}
                            >
                                {group.label}
                                {selected.length > 0 && (
                                    <span className="bg-acid text-carbon px-1.5 py-0.5 text-[10px] leading-none">
                                        {selected.length}
                                    </span>
                                )}
                            </button>
                        );
                    })}

                    {hasFilters && (
                        <button
                            onClick={clearAll}
                            className="text-meta uppercase text-graphite hover:text-oxide underline underline-offset-4 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Right: Sort + count */}
                <div className="flex items-center gap-spacing-control flex-shrink-0">
                    {resultCount !== undefined && (
                        <span className="text-mono text-graphite">{resultCount.toString().padStart(2, "0")} OBJECTS</span>
                    )}
                    <div className="relative">
                        <button
                            onClick={() => setOpenGroup(openGroup === "sort" ? null : "sort")}
                            className="text-meta uppercase text-graphite hover:text-carbon transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
                        >
                            {activeSort}
                        </button>
                        {openGroup === "sort" && (
                            <div className="absolute right-0 top-full mt-2 bg-bone border border-graphite/20 min-w-[180px] z-30">
                                {SORT_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setSort(opt.value)}
                                        className={cn(
                                            "w-full text-left px-4 py-3 text-meta uppercase hover:bg-chalk transition-colors",
                                            currentSort === opt.value ? "text-carbon font-bold" : "text-graphite"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dropdown panels */}
            {FILTER_GROUPS.map((group) => openGroup === group.id && (
                <div
                    key={group.id}
                    className="absolute top-full left-0 mt-2 bg-bone border border-graphite/20 min-w-[200px] z-30 p-4"
                >
                    <div className="flex flex-col gap-2">
                        {group.options.map((opt) => {
                            const isSelected = searchParams.getAll(group.id).includes(opt);
                            return (
                                <button
                                    key={opt}
                                    onClick={() => updateParam(group.id, opt)}
                                    className={cn(
                                        "flex items-center gap-3 text-meta uppercase text-left transition-colors",
                                        isSelected ? "text-carbon" : "text-graphite hover:text-carbon"
                                    )}
                                    aria-pressed={isSelected}
                                >
                                    <span className={cn(
                                        "w-3 h-3 border flex-shrink-0",
                                        isSelected ? "bg-acid border-acid" : "border-graphite"
                                    )} />
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
