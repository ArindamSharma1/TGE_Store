"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { usePathname } from "next/navigation";

export function Footer() {
    const currentYear = new Date().getFullYear();
    const pathname = usePathname();

    if (pathname === "/checkout") return null;

    const footerLinks = [
        {
            title: "Shop",
            links: [
                { name: "New In", href: "/collections/new-in" },
                { name: "Clothing", href: "/collections/clothing" },
                { name: "Shoes", href: "/collections/shoes" },
                { name: "Accessories", href: "/collections/accessories" }
            ]
        },
        {
            title: "Support",
            links: [
                { name: "Help Center", href: "/contact" },
                { name: "Returns", href: "/returns" },
                { name: "Shipping", href: "/returns" },
                { name: "Contact", href: "/contact" }
            ]
        },
        {
            title: "Legal",
            links: [
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Cookies", href: "/cookies" }
            ]
        },
    ];

    return (
        <footer className="bg-zinc-50 pt-24 pb-12 border-t border-zinc-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-6">
                        <div className="relative w-32 h-10">
                            <Image
                                src="/logo-main-white.svg"
                                alt="TGE Store"
                                fill
                                className="object-contain brightness-0"
                            />
                        </div>
                        <p className="text-zinc-500 text-sm max-w-xs">
                            Defining the new standard for modern fashion retail.
                            Clean lines, bold choices.
                        </p>
                        <div className="flex gap-2">
                            <Button
                                size="icon"
                                variant="outline"
                                className="rounded-full w-10 h-10 border-zinc-200 text-zinc-900"
                                asChild
                                href="https://www.instagram.com/arindam._.sharma/"
                                target="_blank"
                            >
                                <span className="sr-only">Instagram</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.407-.06 4.123-.06h.08c2.643 0 2.987.012 4.043.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643.012 2.987.06 4.043.049 1.064.218 1.791.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.407-.06 4.123-.06h.08z" clipRule="evenodd" /></svg>
                            </Button>
                        </div>
                    </div>

                    {footerLinks.map((group) => (
                        <div key={group.title}>
                            <h3 className="font-bold text-zinc-900 mb-6">{group.title}</h3>
                            <ul className="space-y-4">
                                {group.links.map(link => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-zinc-500 hover:text-zinc-900 text-sm transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-zinc-200">
                    <p className="text-zinc-400 text-xs font-medium">
                        © {currentYear} TGE Store. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-zinc-500 text-xs font-medium">Systems Normal</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
