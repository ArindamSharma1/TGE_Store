// ... imports
import { Hero } from "@/components/modules/Hero";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/modules/ProductCard";
import { Reveal } from "@/components/animations/Reveal";
import { Newsletter } from "@/components/modules/Newsletter";
import { WhyTGE } from "@/components/modules/WhyTGE";
import { NeedHelp } from "@/components/modules/NeedHelp";
import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/shopify/queries";

// Revalidate every hour
export const revalidate = 3600;

export default async function Home() {
  let products = [];

  try {
    const { body } = await shopifyFetch<{ data: { products: { edges: any[] } } }>({
      query: getProductsQuery,
      variables: {
        sortKey: 'CREATED_AT',
        reverse: true
      }
    });

    products = body.data.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error("Failed to fetch home products:", error);
  }

  return (
    <main className="min-h-screen bg-zinc-50 pb-20">
      <Hero
        heading="Dailywear, Redefined."
        subheading="The new standard for modern essentials. Built for daily wear."
      />

      {/* SECTION 2: EDITORIAL CATEGORIES */}
      <section className="mx-auto max-w-[1400px] px-4 py-12">
        <Reveal width="100%">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Men's Editorial Card */}
            <Link href="/collections/men" className="group relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-[16px] bg-zinc-100 block">
              <Image
                src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=1200&auto=format&fit=crop"
                alt="Men's Collection"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />

              <div className="absolute bottom-10 left-10 text-white z-10">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-2">
                  Collections
                </span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
                  Men
                </h2>
                <p className="text-sm font-medium tracking-wide opacity-90">
                  Refined Utility
                </p>
              </div>
            </Link>

            {/* Women's Editorial Card */}
            <Link href="/collections/women" className="group relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-[16px] bg-zinc-100 block">
              <Image
                src="https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=1200&auto=format&fit=crop"
                alt="Women's Collection"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />

              <div className="absolute bottom-10 left-10 text-white z-10">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-2">
                  Collections
                </span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
                  Women
                </h2>
                <p className="text-sm font-medium tracking-wide opacity-90">
                  Modern Silhouette
                </p>
              </div>
            </Link>

          </div>
        </Reveal>
      </section>

      {/* SECTION 3: SHOP BY CATEGORY - EDITORIAL GRID */}
      <section className="mx-auto max-w-[1400px] px-4 py-24">
        <Reveal width="100%">
          <div className="flex justify-between items-baseline mb-12">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-12">
            {[
              { name: "Dailywear", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" },
              { name: "Outerwear", img: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800&auto=format&fit=crop" },
              { name: "Partywear", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop" },
              { name: "College Wear", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" }
            ].map((cat) => (
              <Link key={cat.name} href={`/collections/${cat.name.toLowerCase().replace(" ", "-")}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 mb-6 rounded-3xl">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-zinc-900 text-lg font-bold uppercase tracking-wide group-hover:underline underline-offset-4 decoration-1">
                    {cat.name}
                  </span>
                  <span className="text-xs text-zinc-400 mt-1 font-medium tracking-wide uppercase">
                    View Collection
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* SECTION 4: TRENDING NOW - FLOATING GRID */}
      <section className="mx-auto max-w-[1400px] px-4 pb-24">
        <Reveal width="100%">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900">Trending Now</h2>
            <Button asChild href="/collections/all" variant="link" className="text-zinc-500 hover:text-zinc-900 font-medium tracking-wide uppercase text-xs p-0 h-auto">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-12">
            {products.map((product: any) => {
              const thumbnail = product.featuredImage?.url || product.images?.edges?.[0]?.node?.url;
              const hoverImage = product.images?.edges?.[1]?.node?.url || thumbnail;
              const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
              const currencyCode = product.priceRange?.minVariantPrice?.currencyCode || "INR";

              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={price}
                  currencyCode={currencyCode}
                  handle={product.handle}
                  thumbnail={thumbnail}
                  images={{ main: thumbnail, hover: hoverImage }}
                  defaultVariantId={product.variants?.edges?.[0]?.node?.id}
                  variants={product.variants?.edges?.map((e: any) => e.node) || []}
                />
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* SECTION 5: FEATURED EDITORIAL */}
      <section className="mx-auto max-w-[1400px] px-4 py-32">
        <Reveal width="100%">
          <Link href="/collections/weekend-edit" className="block relative w-full h-[600px] md:h-[800px] rounded-2xl overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop"
              alt="Summer Edit"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-[1.01]"
            />
            {/* Functional gradient for text readability without heavy aesthetic overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-700" />

            <div className="absolute bottom-12 left-8 md:left-12 max-w-xl text-white">
              <span className="block text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-90">
                Editorial
              </span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4 text-white">
                The Weekend Edit
              </h2>
              <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed mb-8 max-w-md">
                Effortless outlines for days off. Curated for comfort without compromising style.
              </p>
              <span className="inline-block text-sm font-bold uppercase tracking-widest border-b border-white pb-1 group-hover:text-white/80 group-hover:border-white/80 transition-all">
                View Edit
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* SECTION 6: THE EDITORIAL LOOKBOOK */}
      <section className="mx-auto max-w-[1400px] px-4 py-32 border-t border-zinc-100">
        <Reveal width="100%">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            {/* Editorial Image */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-zinc-100">
              <Image
                src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1200&auto=format&fit=crop"
                alt="Editorial Look"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>

            {/* Look Details - Quiet Commerce */}
            <div className="flex flex-col gap-12">
              <div>
                <span className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs mb-4 block">
                  Editorial 001
                </span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900 mb-6 leading-[0.9]">
                  The City Roamer
                </h2>
                <p className="text-zinc-500 text-lg leading-relaxed max-w-md font-medium">
                  Navigating the concrete jungle requires a uniform that adapts.
                  Structured layers meet technical fabrics.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-200 pb-2 max-w-[200px]">
                  Shop the Look
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { name: "Technical Overshirt", price: "$140.00", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop" },
                    { name: "Wide Pleated Pant", price: "$110.00", img: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=400&auto=format&fit=crop" }
                  ].map((item, i) => (
                    <Link key={i} href="#" className="group block">
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-zinc-100 mb-4 opacity-100 group-hover:opacity-90 transition-opacity">
                        <Image src={item.img} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-zinc-900 group-hover:underline underline-offset-4 decoration-1">{item.name}</p>
                        <p className="text-xs text-zinc-400 mt-1">{item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SECTION 7: SEEN ON YOU (CULTURAL GALLERY) */}
      <section className="mx-auto max-w-[1400px] px-4 py-32">
        <Reveal width="100%">
          <div className="flex flex-col items-start mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">The Community</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-zinc-900">Seen on You</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=600&auto=format&fit=crop"
            ].map((src, i) => (
              <div key={i} className={`relative aspect-[3/4] overflow-hidden bg-zinc-100 group ${i % 2 === 1 ? 'md:translate-y-12' : ''}`}>
                <Image
                  src={src}
                  alt="Community Styling"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
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
