import Image from "next/image";
import Link from "next/link";

export function MaterialStudy() {
  return (
    <section className="py-spacing-transition-major px-spacing-component bg-bone overflow-hidden">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-spacing-section-gap items-center">
        
        {/* Images Column */}
        <div className="lg:col-span-7 relative">
          
          {/* Main Large Image */}
          <div className="relative aspect-[4/3] w-full max-w-[800px] ml-auto">
            <Image
              src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=1200&auto=format&fit=crop"
              alt="Heavy Cotton Twill Material Macro"
              fill
              className="object-cover"
            />
            <div className="absolute top-spacing-component right-spacing-component bg-acid text-carbon px-3 py-1">
               <span className="text-mono font-bold tracking-widest">MAT_03</span>
            </div>
          </div>
          
          {/* Smaller Detail Image (Offset) */}
          <div className="absolute -bottom-16 -left-4 md:left-12 aspect-[3/4] w-1/2 max-w-[300px] border-4 border-bone shadow-xl">
             <Image
              src="https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=600&auto=format&fit=crop"
              alt="Material Construction Detail"
              fill
              className="object-cover"
            />
          </div>
          
          {/* Technical Corner Brackets */}
          <div className="hidden md:block absolute -top-8 -left-8 w-12 h-12 border-t-2 border-l-2 border-graphite/30" />
        </div>
        
        {/* Content Column */}
        <div className="lg:col-span-5 pt-24 lg:pt-0 pl-0 md:pl-12 lg:pl-0">
          <p className="text-meta text-graphite mb-spacing-component">MATERIAL STUDY / 02</p>
          
          <h3 className="text-display-l uppercase mb-spacing-component leading-none">
            Substance<br/>& Form
          </h3>
          
          <div className="w-12 h-[1px] bg-carbon mb-spacing-component" />
          
          <p className="text-body-large text-graphite mb-spacing-control">
            We engineer our textiles to withstand the friction of daily transition. High-density weaves that break in without breaking down.
          </p>
          
          <div className="text-mono text-carbon mb-spacing-section-inner flex flex-col gap-2 opacity-80">
            <p>COMPOSITION: 80% COTTON, 20% NYLON</p>
            <p>WEIGHT: 320 GSM</p>
            <p>TREATMENT: DWR FINISH</p>
          </div>
          
          <Link 
            href="/journal/materials" 
            className="group inline-flex items-center text-meta uppercase tracking-widest"
          >
            <span className="border-b border-carbon pb-1 group-hover:border-oxide group-hover:text-oxide transition-colors">
              Explore Material Library
            </span>
          </Link>
        </div>
        
      </div>
    </section>
  );
}
