import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Inter
import "./globals.css";
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

import { SmoothScroll } from "@/components/animations/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-zinc-900 antialiased`}>
        <SearchProvider>
          <CartProvider>
            <WishlistProvider>
              <SmoothScroll>
                <Header />
                <main>{children}</main>
                <Footer />
                <Toaster position="top-right" />
              </SmoothScroll>
            </WishlistProvider>
          </CartProvider>
        </SearchProvider>
      </body>
    </html>
  );
}
