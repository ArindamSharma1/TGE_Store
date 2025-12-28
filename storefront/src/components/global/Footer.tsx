import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-pure-white pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-black">Help & Information</h3>
                        <ul className="mt-4 space-y-2">
                            {["Help", "Track Order", "Delivery & Returns", "Sitemap"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-secondary-text hover:text-charcoal-black transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-black">About TGS</h3>
                        <ul className="mt-4 space-y-2">
                            {["About Us", "Careers", "Corporate Responsibility", "Investors"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-secondary-text hover:text-charcoal-black transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-black">More From Us</h3>
                        <ul className="mt-4 space-y-2">
                            {["Mobile App", "Gift Vouchers", "Black Friday", "TGS x Future"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-secondary-text hover:text-charcoal-black transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-black">Social</h3>
                        <ul className="mt-4 space-y-2">
                            {["Facebook", "Instagram", "Twitter", "Snapchat"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-secondary-text hover:text-charcoal-black transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-disabled-text">
                        &copy; {currentYear} TGS. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <span className="text-xs text-disabled-text">Privacy & Cookies</span>
                        <span className="text-xs text-disabled-text">Ts&Cs</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
