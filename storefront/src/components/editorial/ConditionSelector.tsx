"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type Condition = 'IN MOTION' | 'AT WORK' | 'AFTER HOURS';

const conditions: Record<Condition, string> = {
    'IN MOTION': 'Built for changing ground.',
    'AT WORK': 'Structure for the long middle.',
    'AFTER HOURS': 'The uniform after the uniform.'
};

export function ConditionSelector() {
    const [activeCondition, setActiveCondition] = useState<Condition>('IN MOTION');

    return (
        <section className="py-spacing-section-gap px-spacing-component border-b border-graphite/20 bg-bone">
            <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                
                <div className="flex flex-col">
                    <h2 className="text-heading uppercase mb-2">Conditions</h2>
                    <p className="text-body text-graphite h-6 transition-opacity duration-300">
                        {conditions[activeCondition]}
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-spacing-control">
                    {(Object.keys(conditions) as Condition[]).map((condition) => {
                        const isActive = activeCondition === condition;
                        return (
                            <button 
                                key={condition}
                                onClick={() => setActiveCondition(condition)}
                                className={cn(
                                    "px-6 py-4 text-meta uppercase tracking-widest border transition-all duration-300 min-w-[140px]",
                                    isActive 
                                        ? "border-acid bg-carbon text-bone shadow-[inset_0_-2px_0_0_#D8FF3E]" 
                                        : "border-graphite/30 text-graphite hover:border-carbon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
                                )}
                                aria-pressed={isActive}
                            >
                                {condition}
                            </button>
                        );
                    })}
                </div>
                
            </div>
        </section>
    );
}
