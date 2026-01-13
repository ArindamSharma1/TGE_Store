"use client";

import { cn } from "@/lib/utils/cn";

interface VariantSelectorProps {
    label: string;
    options: string[];
    selected?: string;
    onSelect: (value: string) => void;
    className?: string;
}

export function VariantSelector({
    label,
    options,
    selected,
    onSelect,
    className,
}: VariantSelectorProps) {
    return (
        <div className={cn("space-y-3", className)}>
            <span className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                {label}: <span className="text-zinc-900">{selected}</span>
            </span>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const isSelected = selected === option;
                    return (
                        <button
                            key={option}
                            onClick={() => onSelect(option)}
                            className={cn(
                                "h-10 min-w-[3rem] px-4 rounded-full border text-sm font-medium transition-all duration-200",
                                isSelected
                                    ? "border-zinc-900 bg-zinc-900 text-white"
                                    : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-900"
                            )}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
