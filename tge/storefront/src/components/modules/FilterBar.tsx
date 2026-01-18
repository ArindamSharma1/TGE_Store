"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

const CATEGORIES = ["All", "New In", "Clothing", "Shoes", "Accessories", "Sale", "Brands", "Trending"];

export function FilterBar() {
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <div className="w-full overflow-x-auto no-scrollbar -mx-4 sm:mx-0">
            <div className="flex items-center gap-3 px-4 sm:px-0 min-w-max">
                {CATEGORIES.map((cat) => (
                    <Button
                        key={cat}
                        variant="ghost"
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                            "rounded-full px-5 h-10 text-sm font-medium transition-all duration-300 border",
                            activeCategory === cat
                                ? "bg-zinc-900 text-white border-zinc-900 shadow-md"
                                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900"
                        )}
                    >
                        {cat}
                    </Button>
                ))}
            </div>
        </div>
    );
}
