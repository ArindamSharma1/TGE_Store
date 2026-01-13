import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
    size?: "sm" | "md" | "lg" | "icon";
    asChild?: boolean;
    href?: string;
    target?: string;
    rel?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", asChild = false, href, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-transform active:scale-95 disabled:pointer-events-none disabled:opacity-50 tracking-wide";

        const variants = {
            primary: "bg-zinc-900 text-white hover:bg-zinc-800",
            secondary: "bg-white text-zinc-900 hover:bg-zinc-100",
            outline: "border border-zinc-200 bg-transparent hover:bg-zinc-50 text-zinc-900",
            ghost: "hover:bg-zinc-100 text-zinc-900",
            link: "text-zinc-900 underline-offset-4 hover:underline",
        };

        const sizes = {
            sm: "h-9 px-4 text-xs",
            md: "h-11 px-6 text-sm",
            lg: "h-14 px-8 text-base",
            icon: "h-10 w-10",
        };

        const classes = cn(baseStyles, variants[variant], sizes[size], className);

        if (asChild && href) {
            return (
                <Link href={href} className={classes} {...(props as any)}>
                    {props.children}
                </Link>
            );
        }

        return (
            <button
                className={classes}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button };
