import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopRail } from "@/components/navigation/TopRail";
import { Footer } from "@/components/global/Footer";
import { Toaster } from "@/components/ui/Toaster";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartDrawer } from "@/components/modules/cart/CartDrawer";
import { SearchOverlay } from "@/components/modules/search/SearchOverlay";
import { SmoothScroll } from "@/components/animations/SmoothScroll";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | TGE Store",
    default: "TGE — The Garment Experiment",
  },
  description: "A daily uniform system for creative people moving between work, city, travel, and after-hours culture.",
  keywords: ["fashion", "streetwear", "system", "uniform", "TGE", "garment experiment"],
  openGraph: {
    title: "TGE — The Garment Experiment",
    description: "A daily uniform system for creative people moving between work, city, travel, and after-hours culture.",
    url: "https://tgestore.com",
    siteName: "TGE",
    locale: "en_US",
    type: "website",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TGE — The Garment Experiment",
    description: "A daily uniform system for creative people moving between work, city, travel, and after-hours culture.",
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
      <body className={`${instrumentSerif.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SearchProvider>
          <CartProvider>
            <WishlistProvider>
              <SmoothScroll>
                <TopRail />
                <main>{children}</main>
                <Footer />
                <CartDrawer />
                <SearchOverlay />
                <Toaster position="top-right" />
              </SmoothScroll>
            </WishlistProvider>
          </CartProvider>
        </SearchProvider>
      </body>
    </html>
  );
}
