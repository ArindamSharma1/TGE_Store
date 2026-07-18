import Image from "next/image";

export function FieldImagery() {
  return (
    <section className="py-spacing-editorial px-spacing-component bg-chalk">
      <div className="max-w-[1600px] mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-spacing-section-gap">
          <h2 className="text-display-m uppercase max-w-2xl">
            Observed in <br/> the field
          </h2>
          <p className="text-meta text-graphite mt-4 md:mt-0 max-w-xs text-left md:text-right">
            COMMUNITY & CONTEXT // GARMENTS IN MOTION ACROSS TRANSIT SCALES.
          </p>
        </div>

        {/* Masonry/Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-spacing-component items-start">
          
          {/* Left Column */}
          <div className="md:col-span-5 flex flex-col gap-spacing-component">
            <figure className="relative">
              <div className="relative aspect-[4/5] bg-fog overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
                  alt="Field Note 01 - Transit"
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 flex justify-between text-meta text-graphite">
                <span>01 — TRANSIT, TOKYO</span>
                <span>[ SHIFT OVERSHIRT ]</span>
              </figcaption>
            </figure>

            <figure className="relative mt-8 md:mt-16 ml-0 md:ml-12">
              <div className="relative aspect-square bg-fog overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop"
                  alt="Field Note 02 - Rain"
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 flex justify-between text-meta text-graphite">
                <span>02 — 14:00, HEAVY RAIN</span>
                <span>[ TRANSIT SHELL ]</span>
              </figcaption>
            </figure>
          </div>

          {/* Right Column */}
          <div className="md:col-span-7 flex flex-col gap-spacing-component md:pt-32">
             <figure className="relative">
              <div className="relative aspect-[16/9] bg-fog overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=1200&auto=format&fit=crop"
                  alt="Field Note 03 - Studio"
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 flex justify-between text-meta text-graphite">
                <span>03 — STUDIO ARCHITECTURE</span>
                <span>[ DAILY TROUSER ]</span>
              </figcaption>
            </figure>

            <div className="bg-carbon text-bone p-spacing-inner md:p-16 mt-8 md:mt-24 max-w-[500px] ml-auto relative">
               <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-acid/50" />
               <p className="text-body-large font-medium italic mb-6">
                 "The system simplifies the morning. I stopped thinking about what to wear and started thinking about what to do."
               </p>
               <p className="text-meta text-acid uppercase tracking-widest">— Field Note / 04</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
