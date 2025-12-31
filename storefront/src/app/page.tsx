"use client";

import { Hero } from "@/components/modules/Hero";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
// Header removed (handled by layout) 
// Let's check imports. I need ProductCard.
import { ProductCard } from "@/components/modules/ProductCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 pb-20">
      <Hero
        heading="New Season, New Fits"
        subheading="Light layers. Modern cuts. Built for daily wear."
      />

      {/* SECTION 3: SHOP BY CATEGORY */}
      <section className="mx-auto max-w-7xl px-4 py-16">
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
      </section>

      {/* SECTION 4: TRENDING NOW */}
      <section className="mx-auto max-w-7xl px-4 py-16 border-t border-zinc-100">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900">Trending Now</h2>
          <Link href="/collections/all">
            <Button variant="ghost" className="hover:bg-zinc-100 rounded-full">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
          {[
            { id: "t1", title: "Heavyweight Box Tee", price: 45, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" },
            { id: "t2", title: "Technical Cargo Pant", price: 120, img: "https://images.unsplash.com/photo-1517445312882-feaee5693f59?q=80&w=800&auto=format&fit=crop" },
            { id: "t3", title: "Oversized Puffer", price: 240, img: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800&auto=format&fit=crop" },
            { id: "t4", title: "Mohair Knit Cardigan", price: 160, img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop" },
            { id: "t5", title: "Relaxed Denim", price: 95, img: "https://images.unsplash.com/photo-1541099649505-df9e19e1433d?q=80&w=800&auto=format&fit=crop" },
            { id: "t6", title: "Utility Vest", price: 110, img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop" },
            { id: "t7", title: "Constructed Blazer", price: 280, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop" },
            { id: "t8", title: "Leather Crossbody", price: 180, img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop" }
          ].map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              currencyCode="USD"
              handle={product.title.toLowerCase().replace(/ /g, "-")}
              thumbnail={product.img}
              images={{ main: product.img, hover: product.img }}
            />
          ))}
        </div>
      </section>

      {/* SECTION 5: FEATURED COLLECTION */}
      <section className="mx-auto max-w-7xl px-4 py-8 mb-8">
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
            <Link href="/collections/weekend-edit">
              <Button size="lg" className="rounded-full bg-white text-zinc-900 border-none hover:bg-zinc-100 font-bold px-8 h-14">
                Shop the Edit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: THE LOOKBOOK */}
      <section className="mx-auto max-w-7xl px-4 py-16 border-t border-zinc-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Editorial Image */}
          <div className="relative aspect-[4/5] lg:aspect-square w-full overflow-hidden rounded-[32px] bg-zinc-100">
            <Image
              src="https://images.unsplash.com/photo-1550614000-4b9519e007d9?q=80&w=1200&auto=format&fit=crop"
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
      </section>

      {/* SECTION 7: SEEN ON YOU (SOCIAL GRID) */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900 mb-2">Seen on You</h2>
          <p className="text-zinc-500">Tag @TGS_Store to be featured.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1529139574466-a302d27f3d9f?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1550614000-4b9519e007d9?q=80&w=600&auto=format&fit=crop"
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
      </section>

      {/* SECTION 8: WHY TGS */}
      <section className="mx-auto max-w-7xl px-4 py-20 border-t border-zinc-100">
        <div className="mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900">Why TGS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "Built for Daily Wear", text: "Fabrics that breathe and move with you. Our pieces are engineered for the reality of your day, not just the photo." },
            { title: "Versatile Design", text: "A modular wardrobe system. Every piece interacts with the next, reducing decision fatigue and maximizing style." },
            { title: "Modern Comfort", text: "We believe structure shouldn't mean stiffness. Experience tailored fits with the ease of loungewear." }
          ].map((feature, i) => (
            <div key={i} className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900">{feature.title}</h3>
              <p className="text-zinc-500 leading-relaxed text-sm md:text-base">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
