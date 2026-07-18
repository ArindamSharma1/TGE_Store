"use client";

import Link from "next/link";
import { useScroll } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchContext";
import { usePathname } from "next/navigation";
import { IndexMenu } from "./IndexMenu";

export function TopRail() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { openCart, cartCount } = useCart();
    const { openSearch } = useSearch();
    const pathname = usePathname();

    useEffect(() => {
        return scrollY.on("change", (latest) => setIsScrolled(latest > 50));
    }, [scrollY]);

    // Close menu on route change
    useEffect(() => { setMenuOpen(false); }, [pathname]);

    if (pathname === "/checkout") return null;

    // On homepage (dark hero), TopRail starts transparent with bone text
    const isHomepage = pathname === "/";

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled || !isHomepage
                        ? "bg-bone/95 backdrop-blur-md border-b border-graphite/20"
                        : "bg-transparent"
                )}
            >
                <div className="max-w-[1600px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

                    {/* Logo / Mark */}
                    <Link
                        href="/"
                        className={cn(
                            "text-[11px] tracking-widest font-bold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
                            isScrolled || !isHomepage ? "text-carbon" : "text-bone"
                        )}
                    >
                        TGE
                    </Link>

                    {/* Desktop Nav */}
                    <nav
                        className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2"
                        aria-label="System navigation"
                    >
                        {[
                            { label: "New System", href: "/collections/new-system" },
                            { label: "Uniforms", href: "/collections/uniforms" },
                            { label: "Layers", href: "/collections/layers" },
                            { label: "Objects", href: "/collections/objects" },
                            { label: "Journal", href: "/journal" },
                        ].map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                className={cn(
                                    "text-[11px] uppercase tracking-[0.05em] transition-colors hover:text-acid focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 focus-visible:decoration-acid",
                                    isScrolled || !isHomepage ? "text-carbon" : "text-bone"
                                )}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Utility Actions */}
                    <div className="flex items-center gap-5">
                        <button
                            onClick={openSearch}
                            className={cn(
                                "text-[11px] uppercase tracking-[0.05em] transition-colors hover:text-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
                                isScrolled || !isHomepage ? "text-carbon" : "text-bone"
                            )}
                            aria-label="Search"
                        >
                            Search
                        </button>

                        <button
                            onClick={openCart}
                            className={cn(
                                "text-[11px] uppercase tracking-[0.05em] transition-colors hover:text-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
                                isScrolled || !isHomepage ? "text-carbon" : "text-bone"
                            )}
                            aria-label={`System — ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
                        >
                            System ({cartCount})
                        </button>

                        <button
                            onClick={() => setMenuOpen(true)}
                            className={cn(
                                "text-[11px] uppercase tracking-[0.05em] transition-colors hover:text-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
                                isScrolled || !isHomepage ? "text-carbon" : "text-bone"
                            )}
                            aria-label="Open full navigation"
                            aria-expanded={menuOpen}
                        >
                            Menu
                        </button>
                    </div>
                </div>
            </header>

            <IndexMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
}
