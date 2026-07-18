import Image from "next/image";
import Link from "next/link";

const fictionalProducts = [
  {
    code: "OBJ_014",
    name: "Daily Trouser",
    price: "₹4,900",
    materials: "COTTON / NYLON",
    field: "DAILY",
    objectImage: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop",
    wornImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "OBJ_021",
    name: "Shift Overshirt",
    price: "₹6,800",
    materials: "HEAVY TWILL",
    field: "WORK",
    objectImage: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=600&auto=format&fit=crop",
    wornImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "OBJ_008",
    name: "Field Tee",
    price: "₹2,400",
    materials: "SUPIMA COTTON",
    field: "BASE",
    objectImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
    wornImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "OBJ_031",
    name: "Transit Shell",
    price: "₹9,600",
    materials: "3L WEATHERPROOF",
    field: "OUTER",
    objectImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
    wornImage: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "OBJ_017",
    name: "Utility Short",
    price: "₹3,900",
    materials: "NYLON RIPSTOP",
    field: "DAILY",
    objectImage: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop",
    wornImage: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "OBJ_026",
    name: "Soft Structure Shirt",
    price: "₹5,600",
    materials: "WASHED COTTON",
    field: "WORK",
    objectImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop",
    wornImage: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop"
  }
];

export function EditorialProductRail() {
  return (
    <section className="py-spacing-editorial bg-carbon text-bone px-spacing-component overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-spacing-section-inner border-b border-graphite/40 pb-4">
          <div>
            <span className="text-meta text-acid bg-acid/10 px-2 py-1 mb-4 inline-block">NEW SYSTEM / 01</span>
            <h3 className="text-display-m uppercase">Field Objects</h3>
          </div>
          <p className="text-meta text-graphite hidden md:block">{fictionalProducts.length} ITEMS // INR</p>
        </div>
        
        <div className="flex gap-spacing-component overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
          {fictionalProducts.map((product, i) => {
            // Intentionally irregular card sizes
            const isWide = i % 3 === 0;
            const aspectClass = isWide ? "aspect-[3/4] md:aspect-square" : "aspect-[4/5]";
            const widthClass = isWide ? "min-w-[85vw] md:min-w-[500px]" : "min-w-[70vw] md:min-w-[400px]";

            return (
              <Link 
                href={`/products/${product.code.toLowerCase()}`}
                key={product.code} 
                className={`${widthClass} snap-start group block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid`}
              >
                <div className={`relative ${aspectClass} bg-graphite mb-spacing-control overflow-hidden`}>
                  
                  {/* Object Image (Resting state) */}
                  <Image
                    src={product.objectImage}
                    alt={`${product.name} Object View`}
                    fill
                    className="object-cover transition-opacity duration-700 opacity-100 group-hover:opacity-0"
                  />
                  
                  {/* Worn Image (Hover state) */}
                  <Image
                    src={product.wornImage}
                    alt={`${product.name} Worn View`}
                    fill
                    className="object-cover transition-all duration-700 opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-105"
                  />

                  {/* Top Metadata */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between z-10 pointer-events-none">
                     <span className="text-mono text-carbon bg-bone px-2 py-1">{product.materials}</span>
                     <span className="text-mono text-carbon bg-acid px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">FIELD: {product.field}</span>
                  </div>

                  {/* Hover Quick Action */}
                  <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                    <div className="w-full bg-acid text-carbon py-3 text-meta uppercase font-bold text-center">
                      Quick Add
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-mono text-fog mb-1">{product.code}</p>
                    <p className="text-body font-medium uppercase group-hover:text-acid transition-colors">{product.name}</p>
                  </div>
                  <p className="text-mono">{product.price}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
