"use client";

import { motion, useInView, useAnimation, Variant } from "framer-motion";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

interface RevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    className?: string;
    delay?: number;
    duration?: number;
}

export function Reveal({
    children,
    width = "fit-content",
    className,
    delay = 0.25,
    duration = 0.8
}: RevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-75px" });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    return (
        <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }} className={className}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 75, skewY: 3 },
                    visible: { opacity: 1, y: 0, skewY: 0 },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{
                    duration: duration,
                    delay: delay,
                    ease: [0.16, 1, 0.3, 1] // The "Apple" ease
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}
