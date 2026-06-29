'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;

    const xToDot = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' });
    const yToDot = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' });
    const xToRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const yToRing = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

    const move = (e: MouseEvent) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    const over = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [data-cursor="hover"]')) {
        gsap.to(ring, { scale: 1.8, opacity: 0.5, duration: 0.3 });
      }
    };
    const out = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [data-cursor="hover"]')) {
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 });
      }
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  );
}
