"use client";

import { Button } from "@/components/ui/Button";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

interface CollectionHeaderProps {
    title: string;
    description?: string;
    count?: number;
}

export function CollectionHeader({ title, description, count }: CollectionHeaderProps) {
    return (
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between py-8">
            <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900">
                    {title}
                </h1>
                {description && (
                    <p className="text-zinc-500 max-w-md text-sm md:text-base">
                        {description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="rounded-full border-zinc-200 w-10 h-10 md:hidden">
                    <SlidersHorizontal className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
