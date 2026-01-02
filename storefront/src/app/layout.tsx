import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Inter
import "./globals.css";
import SmoothScroll from "@/components/global/SmoothScroll";
import { Header } from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { Toaster } from "@/components/ui/Toaster";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";
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
  description: "The ultimate destination for modern fashion.",
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
        </CartProvider>
      </body>
    </html>
  );
}
