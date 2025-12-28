"use client";

import { motion } from "framer-motion";

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    direction?: "up" | "down" | "none";
}

export function FadeIn({ children, delay = 0, className, direction = "up" }: FadeInProps) {
    const directions = {
        up: { y: 20 },
        down: { y: -20 },
        none: { y: 0 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.6,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98] // cubic-bezier for smooth feel
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
