import { CampaignScene } from "@/components/editorial/CampaignScene";
import { ConditionSelector } from "@/components/editorial/ConditionSelector";
import { EditorialProductRail } from "@/components/editorial/EditorialProductRail";
import { MaterialStudy } from "@/components/editorial/MaterialStudy";
import { FieldImagery } from "@/components/editorial/FieldImagery";
import Link from "next/link";

export const revalidate = 3600;

export default function Home() {
  return (
    <main className="min-h-screen bg-bone text-carbon flex flex-col">
      
      {/* 1. The Shift Campaign Scene */}
      <CampaignScene />

      {/* 2. Condition Selector */}
      <ConditionSelector />

      {/* 3. Editorial Product Rail */}
      <EditorialProductRail />

      {/* 4. Material Study */}
      <MaterialStudy />

      {/* 5. Field/Community Imagery */}
      <FieldImagery />

      {/* 6. Manifesto & Final CTA */}
      <section className="py-spacing-transition-campaign px-spacing-component flex flex-col items-center text-center bg-chalk border-t border-graphite/10">
        <p className="text-meta mb-spacing-component text-graphite tracking-widest">THE ETHOS</p>
        
        <h2 className="text-display-m uppercase max-w-4xl mx-auto mb-spacing-section-gap leading-tight">
          Repetition over novelty. <br/> Systems over seasons.
        </h2>
        
        <p className="text-body-large text-graphite max-w-2xl mx-auto mb-spacing-section-inner">
          We design uniforms for the friction of changing conditions. 
          Pieces that perform in motion, hold structure at work, and disappear after hours.
        </p>

        <Link 
          href="/collections/new-system" 
          className="border border-carbon text-carbon px-12 py-5 text-meta uppercase tracking-widest hover:bg-carbon hover:text-bone transition-colors duration-300"
        >
          View New System
        </Link>
      </section>

    </main>
  );
}
