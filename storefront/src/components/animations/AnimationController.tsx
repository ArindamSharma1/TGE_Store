"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { usePathname } from "next/navigation";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function AnimationController() {
    const pathname = usePathname();
    const cleanupRef = useRef<(() => void)[]>([]);

    useEffect(() => {
        // Wait for one frame to ensure hydration is complete and layout is stable
        const rafId = requestAnimationFrame(() => {
            const ctx = gsap.context(() => {
                const cleanups: (() => void)[] = [];

                // --- 1. LENIS SMOOTH SCROLL ---
                const lenis = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    orientation: "vertical",
                    gestureOrientation: "vertical",
                    smoothWheel: true,
                    touchMultiplier: 2,
                });

                // Sync Lenis with GSAP
                lenis.on('scroll', ScrollTrigger.update);

                const ticker = (time: number) => {
                    lenis.raf(time * 1000);
                };
                gsap.ticker.add(ticker);
                gsap.ticker.lagSmoothing(0);

                cleanups.push(() => {
                    lenis.destroy();
                    gsap.ticker.remove(ticker);
                });

                // --- 2. GSAP RECIPES ---

                // Recipe: Parallax Images
                const parallaxElements = document.querySelectorAll('[data-animate="parallax"]');
                parallaxElements.forEach((el) => {
                    gsap.fromTo(el,
                        { yPercent: -10, scale: 1 },
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

                // Recipe: Editorial Text (SplitType)
                const textElements = document.querySelectorAll('[data-animate="text"]');
                textElements.forEach((el) => {
                    // @ts-ignore
                    const split = new SplitType(el as HTMLElement, { types: 'lines, words' });

                    // @ts-ignore
                    if (split.revert) cleanups.push(() => split.revert());

                    gsap.from(split.lines, {
                        y: 50,
                        opacity: 0,
                        duration: 1,
                        stagger: 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    });
                });

                // Recipe: Grid Stagger (Optimized with Batch)
                // Selects all direct children of the grid container for batching
                const gridItems = document.querySelectorAll('[data-animate="grid"] > *');

                if (gridItems.length > 0) {
                    ScrollTrigger.batch(gridItems, {
                        onEnter: (batch) => {
                            gsap.fromTo(batch,
                                { y: 20, opacity: 0 },
                                {
                                    y: 0,
                                    opacity: 1,
                                    duration: 0.6,
                                    stagger: 0.1,
                                    ease: "power2.out",
                                    overwrite: true,
                                    force3D: true
                                }
                            );
                        },
                        start: "top 90%",
                        once: true // Only animate once for better performance
                    });
                }

                // Recipe: Button Micro-interactions
                const buttons = document.querySelectorAll('[data-animate="button"]');
                buttons.forEach((btn) => {
                    const onEnter = () => gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
                    const onLeave = () => gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' });

                    btn.addEventListener('mouseenter', onEnter);
                    btn.addEventListener('mouseleave', onLeave);

                    cleanups.push(() => {
                        btn.removeEventListener('mouseenter', onEnter);
                        btn.removeEventListener('mouseleave', onLeave);
                    });
                });

                // Store cleanups in ref
                cleanupRef.current = cleanups;
            });

            // GSAP Context cleanup
            cleanupRef.current.push(() => ctx.revert());
        });

        // Global Cleanup on Unmount / Path Change
        return () => {
            cancelAnimationFrame(rafId);
            cleanupRef.current.forEach(fn => fn());
            cleanupRef.current = [];
            ScrollTrigger.getAll().forEach(t => t.kill());
        };

    }, [pathname]); // Re-run completely on route change

    return null;
}
