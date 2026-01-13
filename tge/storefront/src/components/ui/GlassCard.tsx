import { cn } from "@/lib/utils/cn";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    variant?: "default" | "heavy";
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, variant = "default", hoverEffect = false }: GlassCardProps) {
    return (
        <div
            className={cn(
                "rounded-[32px] overflow-hidden transition-all duration-300",
                variant === "default" ? "glass-card" : "glass-heavy",
                hoverEffect && "hover:shadow-lg hover:scale-[1.01]",
                className
            )}
        >
            {children}
        </div>
    );
}
