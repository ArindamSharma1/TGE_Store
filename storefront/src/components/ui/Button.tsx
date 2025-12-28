import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        // Base styles: Rectangular (no pill), 150ms transition, ease-in-out
        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider";

        const variants: Record<string, string> = {
            primary: "bg-charcoal-black text-pure-white hover:opacity-90",
            secondary: "bg-off-white text-charcoal-black hover:bg-border",
            outline: "border border-border bg-transparent hover:bg-off-white text-charcoal-black",
            ghost: "hover:bg-off-white hover:text-charcoal-black",
            link: "text-charcoal-black underline-offset-4 hover:underline",
        };

        const sizes: Record<string, string> = {
            default: "h-10 px-8 py-2",
            sm: "h-8 px-4 text-xs",
            lg: "h-12 px-10 text-base",
            icon: "h-10 w-10",
        };

        return (
            <Comp
                className={cn(baseStyles, variants[variant!] || variants.primary, sizes[size!] || sizes.default, className)}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
