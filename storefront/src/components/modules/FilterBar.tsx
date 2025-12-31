"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

const CATEGORIES = ["All", "New In", "Clothing", "Shoes", "Accessories", "Sale", "Brands", "Trending"];

export function FilterBar() {
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <div className="w-full overflow-x-auto no-scrollbar py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex items-center gap-2 min-w-max">
                {CATEGORIES.map((cat) => (
                    <Button
                        key={cat}
                        variant={activeCategory === cat ? "primary" : "outline"}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                            "rounded-full px-6 transition-all duration-300",
                            activeCategory === cat
                                ? "bg-zinc-900 text-white border-zinc-900 shadow-lg scale-105"
                                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900"
                        )}
                    >
                        {cat}
                    </Button>
                ))}
            </div>
        </div>
    );
}
