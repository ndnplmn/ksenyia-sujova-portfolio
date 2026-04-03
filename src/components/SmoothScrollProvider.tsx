'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Force scroll to top on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Detect touch devices
    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    if (isMobile) {
      // On mobile: just tell ScrollTrigger to use native scroll
      ScrollTrigger.normalizeScroll(false);
      return;
    }

    // Desktop: Create Lenis instance manually (not via ReactLenis)
    // so we can wire it to GSAP's ticker — the ONLY way they work together
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 0,
    });

    // ── THE CRITICAL CONNECTION ──────────────────────────────────────────────
    // Feed Lenis's scroll position into GSAP's ScrollTrigger on every frame.
    // Without this, ScrollTrigger reads native scroll (0) while Lenis
    // smoothly animates — causing jumps, stuck pins, and broken scrub.
    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0); // Zero lag for perfect 1:1 sync

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
