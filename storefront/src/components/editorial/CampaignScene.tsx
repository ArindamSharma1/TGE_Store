import Image from "next/image";
import Link from "next/link";

export function CampaignScene() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-end pb-spacing-editorial px-spacing-component">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop"
          alt="The Shift Campaign Scene"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-carbon/30" />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col justify-end h-full pt-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full h-full pb-8">
          
          <div className="flex flex-col justify-end h-full">
            <p className="text-meta text-acid tracking-widest mb-spacing-component">TGE / FIELD 01</p>
            
            <h1 className="text-display-xl uppercase -ml-2 lg:-ml-4 mb-spacing-component overflow-hidden">
              <span className="block">The Daily</span>
              <span className="block text-bone/90">System</span>
            </h1>
            
            <p className="text-body-large max-w-md mb-spacing-section-inner text-bone">
              Built for the hours between places.
            </p>
            
            <Link 
              href="/collections/new-system" 
              className="inline-flex items-center justify-center border border-bone text-bone px-8 py-4 text-meta uppercase tracking-widest hover:bg-bone hover:text-carbon transition-colors duration-300 w-fit"
            >
              [ Enter the system ]
            </Link>
          </div>
          
          <div className="hidden md:flex flex-col items-end text-right justify-end">
            <p className="text-mono text-bone opacity-70">
              L: 28.6139° N, 77.2090° E<br/>
              T: 18:45 IST
            </p>
          </div>
          
        </div>
      </div>
      
      {/* Technical registration marks */}
      <div className="absolute top-0 left-spacing-component w-[1px] h-32 bg-bone/30" />
      <div className="absolute bottom-spacing-component right-spacing-component w-32 h-[1px] bg-bone/30" />
      
      {/* Corner Brackets */}
      <div className="absolute top-spacing-component left-spacing-component w-4 h-4 border-t border-l border-bone/50" />
      <div className="absolute bottom-spacing-component left-spacing-component w-4 h-4 border-b border-l border-bone/50" />
      <div className="absolute top-spacing-component right-spacing-component w-4 h-4 border-t border-r border-bone/50" />
      <div className="absolute bottom-spacing-component right-spacing-component w-4 h-4 border-b border-r border-bone/50" />
    </section>
  );
}
