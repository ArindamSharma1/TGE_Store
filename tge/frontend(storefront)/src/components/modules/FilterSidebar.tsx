"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function FilterSidebar() {
    return (
        <aside className="hidden lg:block w-64 shrink-0 pr-8 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="space-y-8">
                {/* Category Filter */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal-black mb-4">Category</h3>
                    <ul className="space-y-2">
                        {["Dresses", "Tops", "Jeans", "Jackets", "Shoes"].map((item) => (
                            <li key={item}>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-charcoal-black focus:ring-charcoal-black" />
                                    <span className="text-sm text-secondary-text group-hover:text-charcoal-black transition-colors">{item}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Size Filter */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal-black mb-4">Size</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                            <button
                                key={size}
                                className="h-8 w-full border border-border text-xs font-medium text-charcoal-black hover:bg-charcoal-black hover:text-pure-white transition-colors"
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Filter */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal-black mb-4">Color</h3>
                    <ul className="space-y-2">
                        {["Black", "White", "Blue", "Red", "Green"].map((color) => (
                            <li key={color}>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <span
                                        className="w-4 h-4 rounded-full border border-border"
                                        style={{ backgroundColor: color.toLowerCase() }}
                                    />
                                    <span className="text-sm text-secondary-text group-hover:text-charcoal-black transition-colors">{color}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Price Range (Mock) */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal-black mb-4">Price</h3>
                    <div className="flex items-center gap-2">
                        <input type="text" placeholder="Min" className="w-full h-8 border border-border px-2 text-sm" />
                        <span className="text-secondary-text">-</span>
                        <input type="text" placeholder="Max" className="w-full h-8 border border-border px-2 text-sm" />
                    </div>
                </div>
            </div>
        </aside>
    );
}
