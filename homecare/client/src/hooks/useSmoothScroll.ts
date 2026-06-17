import { useEffect } from 'react';
import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function useSmoothScroll() {
  useEffect(() => {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.8,
      infinite: false,
    });

    function raf(time: number) {
      lenis!.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Anchor link smooth scroll
    const handleAnchor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute('href')?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis!.scrollTo(el, { offset: -80, duration: 1.4 });
    };
    document.addEventListener('click', handleAnchor);

    return () => {
      lenis!.destroy();
      lenis = null;
      document.removeEventListener('click', handleAnchor);
    };
  }, []);
}

// Programmatic scroll helper
export function scrollTo(target: string | HTMLElement | number, options?: { offset?: number; duration?: number }) {
  if (!lenis) return;
  lenis.scrollTo(target as any, { offset: -80, duration: 1.2, ...options });
}
