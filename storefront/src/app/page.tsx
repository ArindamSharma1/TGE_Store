import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { Hero } from "@/components/modules/Hero";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero
          heading="SUMMER DROP 2024"
          subheading="Fresh styles just landed. 500+ new items added today."
          ctaText="SHOP NEW ARRIVALS"
          imageUrl="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
        />

        <FadeIn delay={0.2}>
          <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl font-bold uppercase tracking-wide text-charcoal-black">Trending Now</h2>
              <Button variant="link" className="hidden md:inline-flex">View All</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {/* Product cards will go here */}
              <div className="aspect-[3/4] bg-gray-200"></div>
              <div className="aspect-[3/4] bg-gray-200"></div>
              <div className="aspect-[3/4] bg-gray-200"></div>
              <div className="aspect-[3/4] bg-gray-200"></div>
            </div>
          </section>
        </FadeIn>
      </main>
      <Footer />
    </>
  );
}
