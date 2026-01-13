import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full border border-border bg-pure-white px-3 py-2 text-sm text-charcoal-black placeholder:text-disabled-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-charcoal-black disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150 ease-in-out",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
