"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

// Mock data structure for the Mega Menu
const menuData = {
    "New Arrivals": {
        "Clothing": ["Dresses", "Tops", "Jeans", "Coats & Jackets", "Knitwear"],
        "Shoes": ["Sneakers", "Boots", "Heels", "Sandals"],
        "Accessories": ["Bags", "Jewelry", "Sunglasses", "Hats"],
        "Brands": ["ASOS DESIGN", "Topshop", "Nike", "Adidas"]
    },
    "Clothing": {
        "Shop by Product": ["Dresses", "Tops", "Jeans", "Coats & Jackets", "Knitwear", "Blazers", "Shorts", "Skirts"],
        "Shop by Fit": ["Petite", "Tall", "Curve", "Maternity"],
        "Trending": ["Cargo Pants", "Leather Look", "Party Wear"]
    },
    "Shoes": {
        "All Shoes": ["Sneakers", "Boots", "Heels", "Sandals", "Loafers", "Slippers"],
        "Brands": ["Dr Martens", "New Balance", "Converse", "Vans"]
    },
    "Accessories": {
        "All Accessories": ["Bags", "Jewelry", "Sunglasses", "Hats", "Belts", "Scarves"],
        "Gifts": ["Gift Cards", "Gifts for Her", "Gifts for Him"]
    },
    "Sale": {
        "Shop Sale": ["Sale Clothing", "Sale Shoes", "Sale Accessories", "Sale Face + Body"],
        "Offers": ["Student Discount", "20% Off Everything"]
    }
};

export function MegaMenu() {
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

    return (
        <nav
            className="hidden md:flex gap-8 h-full items-center"
            onMouseLeave={() => setActiveCategory(null)}
        >
            {Object.keys(menuData).map((category) => (
                <div
                    key={category}
                    className="group h-full flex items-center"
                    onMouseEnter={() => setActiveCategory(category)}
                >
                    <Link
                        href={`/collections/${category.toLowerCase().replace(" ", "-")}`}
                        className={cn(
                            "text-sm font-bold uppercase tracking-wide transition-colors py-6 border-b-2 border-transparent",
                            activeCategory === category
                                ? "text-charcoal-black border-charcoal-black"
                                : "text-secondary-text hover:text-charcoal-black"
                        )}
                    >
                        {category}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    {activeCategory === category && (
                        <div className="absolute left-0 top-full w-full bg-pure-white border-y border-border shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                                <div className="grid grid-cols-4 gap-8">
                                    {Object.entries(menuData[category as keyof typeof menuData]).map(([sectionTitle, items]) => (
                                        <div key={sectionTitle}>
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-charcoal-black mb-4">
                                                {sectionTitle}
                                            </h4>
                                            <ul className="space-y-2">
                                                {(items as string[]).map((item) => (
                                                    <li key={item}>
                                                        <Link
                                                            href={`/collections/${category.toLowerCase().replace(" ", "-")}/${item.toLowerCase().replace(" ", "-")}`}
                                                            className="text-sm text-secondary-text hover:text-charcoal-black hover:underline underline-offset-4 transition-colors block"
                                                        >
                                                            {item}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
}
