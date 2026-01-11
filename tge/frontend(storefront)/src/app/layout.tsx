import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Inter
import "./globals.css";
import SmoothScroll from "@/components/global/SmoothScroll";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { Toaster } from "@/components/ui/Toaster";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartDrawer } from "@/components/modules/cart/CartDrawer";
import { SearchOverlay } from "@/components/modules/search/SearchOverlay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | TGE Store",
    default: "TGE Store | Modern Fashion",
  },
  description: "The ultimate destination for modern fashion. Discover our latest collections of everyday essentials and statement pieces.",
  keywords: ["fashion", "modern", "clothing", "apparel", "TGE Store"],
  openGraph: {
    title: "TGE Store | Modern Fashion",
    description: "The ultimate destination for modern fashion.",
    url: "https://tgestore.com",
    siteName: "TGE Store",
    locale: "en_US",
    type: "website",
    images: [{
      url: "/og-image.jpg",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TGE Store | Modern Fashion",
    description: "The ultimate destination for modern fashion.",
    images: ["/og-image.jpg"],
  },
  metadataBase: new URL('https://tgestore.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans bg-zinc-50`} suppressHydrationWarning>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              <SmoothScroll>
                <Header />
                <CartDrawer />
                <SearchOverlay />
                <main className="min-h-screen">
                  {children}
                  <Toaster />
                </main>
                <Footer />
              </SmoothScroll>
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
