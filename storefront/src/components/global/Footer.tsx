"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export function Footer() {
    const currentYear = new Date().getFullYear();
    const pathname = usePathname();

    if (pathname === "/checkout") return null;

    const sections = [
        {
            title: "Collections",
            links: [
                { name: "New Arrivals", href: "/collections/new-in" },
                { name: "Ready to Wear", href: "/collections/clothing" },
                { name: "Footwear", href: "/collections/shoes" },
                { name: "Objects", href: "/collections/accessories" }
            ]
        },
        {
            title: "Support",
            links: [
                { name: "Client Services", href: "/contact" },
                { name: "Shipping & Returns", href: "/returns" },
                { name: "Size Guide", href: "/size-guide" },
                { name: "FAQ", href: "/faq" }
            ]
        },
        {
            title: "Legal",
            links: [
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Cookie Policy", href: "/cookies" }
            ]
        },
    ];

    return (
        <footer className="bg-white pt-32 pb-16 border-t border-zinc-100">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-32">

                    {/* Brand Column (Editorial) */}
                    <div className="md:col-span-4 lg:col-span-5 space-y-8">
                        <Link href="/" className="block relative w-24 h-6 opacity-0 animate-in fade-in duration-700">
                            <Image
                                src="/logo-main-white.svg"
                                alt="TGE"
                                fill
                                className="object-contain brightness-0"
                            />
                        </Link>
                        <p className="text-sm leading-relaxed text-zinc-500 max-w-sm font-medium opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            Engineering the new uniform for the modern creative class.
                            Silent design, loud impact.
                        </p>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        {sections.map((section, idx) => (
                            <div key={section.title} className="space-y-8 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${200 + idx * 100}ms` }}>
                                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 select-none">
                                    {section.title}
                                </h3>
                                <ul className="space-y-4">
                                    {section.links.map(link => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="block text-sm text-zinc-500 hover:text-zinc-900 transition-all duration-300 hover:translate-x-1"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar (Asymmetric) */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-12 border-t border-zinc-100 opacity-0 animate-in fade-in duration-1000 delay-500">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                                Systems Normal
                            </span>
                        </div>
                        <p className="text-[10px] text-zinc-300 font-medium">
                            © {currentYear} TGE Inc.
                        </p>
                    </div>

                    <div className="flex gap-8">
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-wider font-medium text-[10px]"
                        >
                            Instagram
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-wider font-medium text-[10px]"
                        >
                            Twitter
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
