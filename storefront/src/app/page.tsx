"use client";

import { Hero } from "@/components/modules/Hero";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/modules/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { Newsletter } from "@/components/modules/Newsletter";
import { WhyTGE } from "@/components/modules/WhyTGE";
import { NeedHelp } from "@/components/modules/NeedHelp";
import { medusaClient } from "@/lib/medusa/client";
import { useState, useEffect } from "react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { products } = await medusaClient.store.product.list({
        limit: 4,
        fields: "title,handle,thumbnail,id,variants.prices,variants.images,images"
      });
      setProducts(products);
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 pb-20">
      <Hero
        heading="New Season, New Fits"
        subheading="Light layers. Modern cuts. Built for daily wear."
      />

      {/* SECTION 2: SHOP BY GENDER */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <Reveal width="100%">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Men's Card */}
            <Link href="/collections/men" className="group relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-[32px] bg-zinc-100">
              <Image
                src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=1200&auto=format&fit=crop"
                alt="Shop Men"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-8 left-8">
                <div className="inline-flex items-center justify-center rounded-full bg-white text-zinc-900 border-none font-bold px-8 h-12 shadow-sm transition-colors group-hover:bg-zinc-100">
                  Shop Men
                </div>
              </div>
            </Link>

            {/* Women's Card */}
            <Link href="/collections/women" className="group relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-[32px] bg-zinc-100">
              <Image
                src="https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=1200&auto=format&fit=crop"
                alt="Shop Women"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-8 left-8">
                <div className="inline-flex items-center justify-center rounded-full bg-white text-zinc-900 border-none font-bold px-8 h-12 shadow-sm transition-colors group-hover:bg-zinc-100">
                  Shop Women
                </div>
              </div>
            </Link>
          </div>
          <div className="mt-8 flex justify-center">
            <Button asChild href="/collections/all" size="lg" className="rounded-full px-12 h-14 text-base font-bold bg-zinc-900 text-white hover:bg-zinc-800">
              Shop All
            </Button>
          </div>
        </Reveal>
      </section>

      {/* SECTION 3: SHOP BY CATEGORY */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal width="100%">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900 mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Dailywear", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" },
              { name: "Outerwear", img: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800&auto=format&fit=crop" },
              { name: "Partywear", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop" },
              { name: "College Wear", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" }
            ].map((cat) => (
              <Link key={cat.name} href={`/collections/${cat.name.toLowerCase().replace(" ", "-")}`} className="group block relative aspect-[4/5] overflow-hidden rounded-[20px] bg-zinc-100">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="text-white text-lg font-bold uppercase tracking-wide">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* SECTION 4: TRENDING NOW */}
      <section className="mx-auto max-w-7xl px-4 py-16 border-t border-zinc-100">
        <Reveal width="100%">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900">Trending Now</h2>
            <Button asChild href="/collections/all" variant="ghost" className="hover:bg-zinc-100 rounded-full">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {products.map((product) => {
              const lowestPrice = product.variants[0]?.prices?.find((p: any) => p.currency_code === "inr")?.amount || product.variants[0]?.prices?.[0]?.amount || 0;
              const thumbnail = product.thumbnail || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop";
              const hoverImage = product.images?.[1]?.url || thumbnail;

              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={lowestPrice / 100} // Medusa prices are in Rupees
                  currencyCode={"INR"}
                  handle={product.handle}
                  thumbnail={thumbnail}
                  images={{ main: thumbnail, hover: hoverImage }}
                  defaultVariantId={product.variants[0]?.id}
                />
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* SECTION 5: FEATURED COLLECTION */}
      <section className="mx-auto max-w-7xl px-4 py-8 mb-8">
        <Reveal width="100%">
          <div className="relative w-full h-[500px] md:h-[600px] rounded-[32px] overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop"
              alt="Summer Edit"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-12 left-8 md:left-12">
              <h2 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                The Weekend Edit
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-md font-medium">
                Effortless outlines for days off. Curated for comfort without compromising style.
              </p>
              <Button asChild href="/collections/weekend-edit" size="lg" className="rounded-full bg-white text-zinc-900 border-none hover:bg-zinc-100 font-bold px-8 h-14">
                Shop the Edit
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SECTION 6: THE LOOKBOOK */}
      <section className="mx-auto max-w-7xl px-4 py-16 border-t border-zinc-100">
        <Reveal width="100%">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Editorial Image */}
            <div className="relative aspect-[4/5] lg:aspect-square w-full overflow-hidden rounded-[32px] bg-zinc-100">
              <Image
                src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1200&auto=format&fit=crop"
                alt="Editorial Look"
                fill
                className="object-cover"
              />
            </div>

            {/* Look Details */}
            <div className="flex flex-col gap-8">
              <div>
                <span className="text-zinc-500 font-medium uppercase tracking-widest text-sm mb-2 block">
                  Editorial
                </span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900 mb-6">
                  The City Roamer
                </h2>
                <p className="text-zinc-600 text-lg leading-relaxed max-w-md">
                  Navigating the concrete jungle requires a uniform that adapts.
                  Structured layers meet technical fabrics for a look that means business.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold uppercase tracking-wide text-zinc-900 border-b border-zinc-100 pb-2">
                  Get the Look
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Technical Overshirt", price: "$140.00", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop" },
                    { name: "Wide Pleated Pant", price: "$110.00", img: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=400&auto=format&fit=crop" }
                  ].map((item, i) => (
                    <Link key={i} href="#" className="group flex gap-4 items-center bg-white p-3 rounded-2xl border border-zinc-100 hover:border-zinc-300 transition-colors">
                      <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                        <Image src={item.img} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-zinc-900 group-hover:underline">{item.name}</p>
                        <p className="text-sm text-zinc-500">{item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SECTION 7: SEEN ON YOU (SOCIAL GRID) */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <Reveal width="100%">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900 mb-2">Seen on You</h2>
            <p className="text-zinc-500">Tag @TGS_Store to be featured.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=600&auto=format&fit=crop"
            ].map((src, i) => (
              <div key={i} className="relative aspect-square overflow-hidden bg-zinc-100 group">
                <Image
                  src={src}
                  alt="Community Styling"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">@tgs_community</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* SECTION 8: WHY TGE */}
      <WhyTGE />

      {/* SECTION 9: NEED HELP */}
      <NeedHelp />

      {/* SECTION 10: NEWSLETTER (Moved to bottom) */}
      <Newsletter />

    </main>
  );
}
