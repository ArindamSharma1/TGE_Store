"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
    { index: "01", label: "New System", href: "/collections/new-system", description: "First access. Edition 01." },
    { index: "02", label: "Uniforms", href: "/collections/uniforms", description: "For the long middle." },
    { index: "03", label: "Layers", href: "/collections/layers", description: "Structural and transitional." },
    { index: "04", label: "Objects", href: "/collections/objects", description: "Field-tested carry objects." },
    { index: "05", label: "Journal", href: "/journal", description: "Field notes, materials, people." },
    { index: "06", label: "TGE", href: "/about", description: "The Garment Experiment." },
];

const SECONDARY_ITEMS = [
    { label: "Support", href: "/support" },
    { label: "Account", href: "/account" },
    { label: "Search", href: "#search" },
];

interface IndexMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function IndexMenu({ isOpen, onClose }: IndexMenuProps) {
    const [activeItem, setActiveItem] = useState<number | null>(null);

    // Trap focus and handle Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[70] bg-carbon text-bone flex flex-col"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Site navigation"
                >
                    {/* Top Row */}
                    <div className="flex items-center justify-between px-6 md:px-spacing-component py-5 border-b border-bone/10">
                        <Link href="/" onClick={onClose} className="text-meta tracking-widest">
                            TGE // THE GARMENT EXPERIMENT
                        </Link>
                        <button
                            onClick={onClose}
                            className="text-meta uppercase text-bone/60 hover:text-bone transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
                            aria-label="Close navigation"
                        >
                            Close
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                        {/* Left: Navigation Index */}
                        <nav className="flex-1 px-6 md:px-spacing-component py-spacing-section-inner overflow-y-auto">
                            <ol className="flex flex-col gap-1">
                                {NAV_ITEMS.map((item, i) => (
                                    <li key={item.index}>
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            onMouseEnter={() => setActiveItem(i)}
                                            onMouseLeave={() => setActiveItem(null)}
                                            className="group flex items-baseline gap-6 py-4 border-b border-bone/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
                                        >
                                            <span className="text-mono text-bone/40 w-8 flex-shrink-0">
                                                {item.index}
                                            </span>
                                            <span className={cn(
                                                "text-display-m uppercase transition-colors leading-none",
                                                activeItem === i ? "text-acid" : "text-bone"
                                            )}>
                                                {item.label}
                                            </span>
                                            <span className="text-meta text-bone/40 hidden md:block ml-auto">
                                                {item.description}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ol>

                            {/* Secondary Links */}
                            <div className="mt-spacing-section-inner flex gap-spacing-component">
                                {SECONDARY_ITEMS.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={onClose}
                                        className="text-meta text-bone/40 hover:text-bone transition-colors uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </nav>

                        {/* Right: Editorial Panel (desktop only) */}
                        <div className="hidden lg:flex w-[420px] flex-shrink-0 border-l border-bone/10 flex-col justify-between p-spacing-section-inner">
                            <div>
                                <p className="text-mono text-acid mb-spacing-component">CURRENT EDITION</p>
                                <p className="text-display-m uppercase mb-4">New<br/>System<br/>01</p>
                                <p className="text-body text-bone/60 max-w-xs">
                                    The first field edition of the daily uniform system. Six objects. Three materials. One condition.
                                </p>
                                <Link
                                    href="/collections/new-system"
                                    onClick={onClose}
                                    className="inline-block mt-6 text-meta uppercase border-b border-bone/40 pb-1 hover:border-acid hover:text-acid transition-colors"
                                >
                                    Enter New System
                                </Link>
                            </div>

                            <div className="text-mono text-bone/30">
                                <p>FIELD: 01 // DELHI</p>
                                <p>EDITION: DAILY SYSTEM</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
