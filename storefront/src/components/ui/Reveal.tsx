"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils/cn";

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    width?: "fit-content" | "100%";
}

export function Reveal({ children, className, delay = 0.25, width = "fit-content" }: RevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 }); // Trigger when 20% visible

    return (
        <div ref={ref} className={cn("relative overflow-hidden", width === "100%" ? "w-full" : "w-fit", className)}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        </div>
    );
}
