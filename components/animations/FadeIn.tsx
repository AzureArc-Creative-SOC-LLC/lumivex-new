'use client';

import { useEffect, useRef, createElement } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Props = {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  y?: number;
  delay?: number;
  duration?: number;
  scale?: boolean;
  start?: string;
};

export default function FadeIn({
  children,
  as = 'div',
  className = '',
  y = 48,
  delay = 0,
  duration = 1.1,
  scale = true,
  start = 'top 88%',
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }
      gsap.fromTo(
        el,
        { autoAlpha: 0, y, scale: scale ? 0.985 : 1 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [y, delay, duration, scale, start]);

  return createElement(
    as,
    { ref, className, style: { visibility: 'hidden' } },
    children
  );
}
