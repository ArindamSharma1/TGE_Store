"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { usePathname } from "next/navigation";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const lenisRef = useRef<Lenis | null>(null);

    // 1. Initialize Lenis (Smooth Scroll)
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // "Heavy" luxurious feel
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            gsap.ticker.remove((time) => lenis.raf(time * 1000));
        };
    }, []);

    // 2. The Global Animation Manager (Scans DOM on route change)
    useLayoutEffect(() => {
        // Allow DOM to paint first/Lenis to init
        const ctx = gsap.context(() => {

            // --- RECIPE 1: Parallax Image ---
            // Target: [data-animate="parallax"]
            const parallaxElements = document.querySelectorAll('[data-animate="parallax"]');
            parallaxElements.forEach((el) => {
                gsap.fromTo(el,
                    {
                        yPercent: -10,
                        scale: 1
                    },
                    {
                        yPercent: 10,
                        scale: 1.1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: el,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    }
                );
            });

            // --- RECIPE 2: Editorial Text ---
            // Target: [data-animate="text"]
            // Effect: Split lines, stagger reveal from y: 50
            const textElements = document.querySelectorAll('[data-animate="text"]');
            textElements.forEach((el) => {
                // Split text first
                const split = new SplitType(el as HTMLElement, { types: 'lines, words' });

                // Animate lines
                gsap.from(split.lines, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%", // Trigger just before it enters fully
                        toggleActions: "play none none reverse"
                    }
                });
            });

            // --- RECIPE 3: Product Grid ---
            // Target: [data-animate="grid"]
            // Effect: Stagger children fade up
            const gridContainers = document.querySelectorAll('[data-animate="grid"]');
            gridContainers.forEach((el) => {
                const children = el.children;
                gsap.from(children, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                });
            });

            // --- RECIPE 4: Micro-Interactions (Buttons) ---
            // Target: [data-animate="button"]
            const buttons = document.querySelectorAll('[data-animate="button"]');
            buttons.forEach((btn) => {
                btn.addEventListener('mouseenter', () => {
                    gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
                });
                btn.addEventListener('mouseleave', () => {
                    gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' });
                });
            });

        });

        return () => {
            ctx.revert(); // Cleanup GSAP animations on unmount/route change
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [pathname]); // Re-run when route changes

    return (
        <div className="smooth-scroll-wrapper">
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
