import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Changed to Inter
import "./globals.css";
import SmoothScroll from "@/components/global/SmoothScroll";

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
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans bg-zinc-50`}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
