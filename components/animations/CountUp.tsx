'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Counts a numeric value up from 0 when it scrolls into view.
 * Preserves the original number of decimal places in `value`.
 */
export default function CountUp({
  value,
  className = '',
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const target = parseFloat(value);
    if (Number.isNaN(target)) {
      el.textContent = value;
      return;
    }
    const decimals = value.includes('.') ? value.split('.')[1].length : 0;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      el.textContent = value;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        v: target,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => {
          el.textContent = counter.v.toFixed(decimals);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
