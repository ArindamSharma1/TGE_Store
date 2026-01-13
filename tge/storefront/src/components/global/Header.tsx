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
// import { medusaClient } from "@/lib/medusa/client";
export function Header() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const { openCart, cartCount } = useCart();
    const { openSearch } = useSearch();
    const pathname = usePathname();
    const [customer, setCustomer] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
            const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_92932433455c59ad80b7c71deeab97d0c9cfc0cf7b97a1a1d1e9013d9b4ae94f";
            const token = localStorage.getItem("medusa_auth_token");

            if (!token) {
                setCustomer(null);
                setIsLoggedIn(false);
                return;
            }

            try {
                const res = await fetch(`${BACKEND_URL}/store/customers/me`, {
                    headers: {
                        "Content-Type": "application/json",
                        "x-publishable-api-key": PUBLISHABLE_KEY,
                        "Authorization": `Bearer ${token}`
                    },
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    setCustomer(data.customer);
                    setIsLoggedIn(true);
                } else {
                    setCustomer(null);
                    setIsLoggedIn(false);
                    // If token is invalid, clear it
                    localStorage.removeItem("medusa_auth_token");
                }
            } catch (e) {
                setCustomer(null);
                setIsLoggedIn(false);
            }
        };

        checkAuth();
    }, [pathname]);

    useEffect(() => {
        return scrollY.on("change", (latest) => {
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

                    <nav
                        className={cn(
                            "rounded-2xl px-2 py-1.5 flex items-center gap-1 transition-all duration-300 backdrop-blur-xl border border-white/10",
                            isScrolled ? "bg-white/80 shadow-sm border-zinc-200/50" : "bg-black/20 hover:bg-black/30 text-white"
                        )}
                    >
                        <Button variant="ghost" size="icon" className="rounded-xl md:hidden text-current hover:bg-white/10">
                            <Menu className="w-5 h-5" />
                        </Button>
                        <Link href="/" className="px-3 py-1.5 flex items-center">
                            <Image
                                src="/logo-main-white.svg"
                                alt="TGE Store"
                                width={80}
                                height={24}
                                className={cn(
                                    "h-5 w-auto object-contain transition-all",
                                    isScrolled ? "brightness-0 invert-0" : "brightness-0 invert"
                                )}
                            />
                        </Link>
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors",
                                        isScrolled ? "hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900" : "hover:bg-white/10 text-white/90 hover:text-white"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "rounded-2xl p-1 flex items-center gap-1 transition-all duration-300 backdrop-blur-xl border border-white/10",
                            isScrolled ? "bg-white/80 shadow-sm border-zinc-200/50 text-zinc-900" : "bg-black/20 hover:bg-black/30 text-white"
                        )}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl w-9 h-9 hover:bg-white/10 text-current"
                                onClick={openSearch}
                            >
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className={cn(
                            "rounded-2xl p-1 flex items-center gap-1 transition-all duration-300 backdrop-blur-xl border border-white/10",
                            isScrolled ? "bg-white/80 shadow-sm border-zinc-200/50 text-zinc-900" : "bg-black/20 hover:bg-black/30 text-white"
                        )}>
                            {/* Updated User Icon Logic */}
                            <Button
                                asChild
                                href={customer ? "/account" : "/login"}
                                variant="ghost"
                                size="icon"
                                className="rounded-xl w-9 h-9 hover:bg-white/10 text-current"
                            >
                                <User className="w-4 h-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl w-9 h-9 hover:bg-white/10 text-current relative"
                                onClick={openCart}
                            >
                                <ShoppingBag className="w-4 h-4" />
                                {cartCount > 0 && (
                                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                                )}
                            </Button>
                        </div>
                    </div>

                </div>
            </header>
        </>
    );
}
