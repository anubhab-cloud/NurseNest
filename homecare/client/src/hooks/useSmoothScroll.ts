import { useEffect } from 'react';
import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function useSmoothScroll() {
  useEffect(() => {
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.8,
      } as any);

      let rafId: number;
      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      const handleAnchor = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
        if (!anchor) return;
        const id = anchor.getAttribute('href')?.slice(1);
        if (!id) return;
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        lenis?.scrollTo(el as any, { offset: -80, duration: 1.4 });
      };
      document.addEventListener('click', handleAnchor);

      return () => {
        cancelAnimationFrame(rafId);
        lenis?.destroy();
        lenis = null;
        document.removeEventListener('click', handleAnchor);
      };
    } catch (err) {
      // Lenis failed silently — page still works without smooth scroll
      console.warn('Lenis smooth scroll init failed:', err);
    }
  }, []);
}

export function scrollTo(target: string | HTMLElement | number, options?: { offset?: number; duration?: number }) {
  if (!lenis) return;
  try { lenis.scrollTo(target as any, { offset: -80, duration: 1.2, ...options }); } catch { }
}
