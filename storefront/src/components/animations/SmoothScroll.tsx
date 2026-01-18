"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import dynamic from "next/dynamic";

const AnimationController = dynamic(() => import("./AnimationController"), {
    ssr: false
});

export function SmoothScroll({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.includes("/login") || pathname.includes("/register");

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="smooth-scroll-wrapper">
            <AnimationController />
            {children}
            <style jsx global>{`
                html.lenis, html.lenis body {
                  height: auto;
                }
                .lenis.lenis-smooth {
                  scroll-behavior: auto !important;
                }
                .lenis.lenis-smooth [data-lenis-prevent] {
                  overscroll-behavior: contain;
                }
                .lenis.lenis-stopped {
                  overflow: hidden;
                }
                .lenis.lenis-scrolling iframe {
                  pointer-events: none;
                }
                
                /* SplitType CSS classes */
                .line {
                    overflow: hidden;
                    padding-bottom: 2px; /* Prevent clipping */
                }
             `}</style>
        </div>
    );
}
