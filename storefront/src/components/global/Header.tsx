"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useScroll } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchContext";
import { usePathname } from "next/navigation";

export function Header() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const { openCart, cartCount } = useCart();
    const { openSearch } = useSearch();
    const pathname = usePathname();

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 20);
        });
    }, [scrollY]);

    if (pathname === "/checkout") return null;

    const navLinks = [
        { name: "Shop", href: "/collections/all" },
        { name: "New In", href: "/collections/new-in" },
        { name: "Brands", href: "/collections/brands" },
        { name: "Sale", href: "/collections/sale" },
    ];

    return (
        <>
            <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
                <div className="flex items-center justify-between w-full max-w-7xl pointer-events-auto">

                    {/* Left: Navigation Pill */}
                    <nav
                        className={cn(
                            "rounded-full px-2 py-2 flex items-center gap-1 transition-all duration-300",
                            isScrolled ? "glass-heavy shadow-md" : "glass-card"
                        )}
                    >
                        <Button variant="ghost" size="icon" className="rounded-full md:hidden">
                            <Menu className="w-5 h-5" />
                        </Button>
                        <Link href="/" className="px-4 py-2 flex items-center">
                            <Image
                                src="/logo-main-white.svg"
                                alt="TGE Store"
                                width={80}
                                height={24}
                                className="h-6 w-auto object-contain brightness-0"
                            />
                        </Link>
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-medium hover:bg-zinc-100/50 rounded-full transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Right: Utility Pills */}
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "rounded-full p-1 flex items-center gap-1 transition-all duration-300",
                            isScrolled ? "glass-heavy shadow-md" : "glass-card"
                        )}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full w-10 h-10 hover:bg-zinc-100/50"
                                onClick={openSearch}
                            >
                                <Search className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className={cn(
                            "rounded-full p-1 flex items-center gap-1 transition-all duration-300",
                            isScrolled ? "glass-heavy shadow-md" : "glass-card"
                        )}>
                            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-zinc-100/50">
                                <User className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full w-10 h-10 hover:bg-zinc-100/50 relative"
                                onClick={openCart}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-zinc-900 rounded-full border border-white"></span>
                                )}
                            </Button>
                        </div>
                    </div>

                </div>
            </header>
        </>
    );
}
