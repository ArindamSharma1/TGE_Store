"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const SORT_OPTIONS = [
    { label: "Newest", value: "created-desc" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Best Selling", value: "best-selling" },
];

const CATEGORIES = [
    { name: "All", href: "/collections/all" },
    { name: "T-Shirts", href: "/collections/t-shirts" },
    { name: "Jackets", href: "/collections/jackets" },
    { name: "Pants", href: "/collections/pants" },
    { name: "Accessories", href: "/collections/accessories" },
];

export function FilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    // Get current state from URL
    const currentSort = searchParams.get('sort') || 'created-desc';
    const activeLabel = SORT_OPTIONS.find(o => o.value === currentSort)?.label || "Sort By";

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', value);
        router.replace(`?${params.toString()}`, { scroll: false });
        setIsSortOpen(false);
    };

    return (
        <div className="w-full flex items-center justify-between gap-4">
            {/* Left: Filter Categories (Navigation) */}
            <div className="overflow-x-auto no-scrollbar flex-1 -mx-4 sm:mx-0">
                <div className="flex items-center gap-2 px-4 sm:px-0 min-w-max">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mr-2">Filters</span>
                    {CATEGORIES.map((cat) => {
                        const isActive = pathname === cat.href;
                        return (
                            <Button
                                key={cat.name}
                                asChild
                                href={cat.href}
                                variant="ghost"
                                className={cn(
                                    "rounded-full px-4 h-8 text-xs font-medium transition-all duration-300 border",
                                    isActive
                                        ? "bg-zinc-900 text-white border-zinc-900"
                                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900"
                                )}
                            >
                                {cat.name}
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Right: Sort Dropdown */}
            <div className="relative shrink-0" ref={sortRef}>
                <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-2 h-10 px-5 bg-white border border-zinc-200 rounded-full text-sm font-medium text-zinc-900 hover:border-zinc-300 transition-colors shadow-sm"
                >
                    <span className="text-zinc-500">Sort by:</span>
                    <span>{activeLabel}</span>
                    <ChevronDown className={cn("w-4 h-4 text-zinc-400 transition-transform ml-1", isSortOpen && "rotate-180")} />
                </button>

                {/* Dropdown Menu */}
                <div
                    className={cn(
                        "absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-100 rounded-xl shadow-xl p-1 z-50 origin-top-right transition-all duration-200",
                        isSortOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                    )}
                >
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSort(option.value)}
                            className={cn(
                                "w-full text-left px-4 py-2 text-sm rounded-lg transition-colors",
                                currentSort === option.value
                                    ? "bg-zinc-50 text-zinc-900 font-semibold"
                                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
