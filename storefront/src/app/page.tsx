"use client";

import { Hero } from "@/components/modules/Hero";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 pb-20">
      <Hero />

      {/* TRENDING BENTO GRID */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Trending Now</h2>
          <Button variant="ghost" className="rounded-full">View All</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[600px]">

          {/* Large Item (Left) */}
          <GlassCard className="col-span-1 md:col-span-2 relative h-[400px] md:h-full group bg-white border-zinc-100">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop"
              alt="Featured Trend"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-6 left-6 z-10">
              <span className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2 inline-block">
                Editor's Pick
              </span>
              <h3 className="text-white text-3xl font-black uppercase drop-shadow-md">Urban Utility</h3>
            </div>
          </GlassCard>

          {/* Right Column Stack */}
          <div className="flex flex-col gap-4 h-full">
            <GlassCard className="flex-1 relative group bg-white border-zinc-100 min-h-[200px]">
              <Image
                src="https://images.unsplash.com/photo-1550614000-4b9519e07d0f?q=80&w=1000&auto=format&fit=crop"
                alt="Trend 2"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-lg font-bold uppercase drop-shadow-sm">Denim logic</h3>
              </div>
            </GlassCard>
            <GlassCard className="flex-1 relative group bg-white border-zinc-100 min-h-[200px]">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-b8ea6f0a5d44?q=80&w=1000&auto=format&fit=crop"
                alt="Trend 3"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-lg font-bold uppercase drop-shadow-sm">Accessories</h3>
              </div>
            </GlassCard>
          </div>

        </div>
      </section>

      {/* CATEGORY PILLS */}
      <section className="mx-auto max-w-7xl px-4 mb-20">
        <div className="flex flex-wrap gap-2 justify-center">
          {["New Arrivals", "Best Sellers", "Coats & Jackets", "Dresses", "Footwear", "Accessories", "Sale"].map((cat) => (
            <Link key={cat} href={`/collections/${cat.toLowerCase().replace(" ", "-")}`}>
              <Button variant="outline" className="rounded-full border-zinc-300 bg-white hover:bg-zinc-900 hover:text-white transition-all h-12 px-6 text-sm uppercase font-bold tracking-wide">
                {cat}
              </Button>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
