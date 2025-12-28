"use client";

import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MegaMenu } from "@/components/global/MegaMenu";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-pure-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex shrink-0 items-center">
                    <Link href="/" className="font-satoshi text-2xl font-bold tracking-widest uppercase text-charcoal-black">
                        TGS
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <MegaMenu />

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" aria-label="Search">
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Account">
                        <User className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Cart">
                        <ShoppingBag className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
