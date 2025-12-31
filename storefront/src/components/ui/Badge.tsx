import { cn } from "@/lib/utils/cn";

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "outline" | "glass";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center justify-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                variant === "default" && "bg-zinc-900 text-white",
                variant === "outline" && "border border-zinc-200 text-zinc-900",
                variant === "glass" && "glass-card text-zinc-900 backdrop-blur-md",
                className
            )}
        >
            {children}
        </span>
    );
}
