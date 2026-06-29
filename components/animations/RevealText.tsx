'use client';

import { useEffect, useRef, createElement } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

type Props = {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  /** split granularity */
  split?: 'lines' | 'words' | 'chars';
  delay?: number;
  stagger?: number;
  /** start trigger position */
  start?: string;
  duration?: number;
};

export default function RevealText({
  children,
  as = 'div',
  className = '',
  split = 'lines',
  delay = 0,
  stagger = 0.06,
  start = 'top 85%',
  duration = 1.1,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReduced) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    let split_: SplitType | null = null;
    let ctx: gsap.Context | null = null;

    // Wait for fonts so split metrics are correct.
    const run = () => {
      split_ = new SplitType(el, {
        types: split === 'chars' ? 'lines,words,chars' : split === 'words' ? 'lines,words' : 'lines',
        lineClass: 'split-line',
      });

      const targets =
        split === 'chars'
          ? split_.chars
          : split === 'words'
          ? split_.words
          : split_.lines;

      if (!targets || targets.length === 0) return;

      ctx = gsap.context(() => {
        gsap.set(el, { autoAlpha: 1 });
        gsap.fromTo(
          targets,
          {
            yPercent: 115,
            opacity: 0,
            filter: 'blur(8px)',
          },
          {
            yPercent: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration,
            ease: 'power4.out',
            stagger,
            delay,
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
            },
          }
        );
      }, el);
    };

    if (document.fonts && document.fonts.status !== 'loaded') {
      document.fonts.ready.then(run);
    } else {
      run();
    }

    return () => {
      ctx?.revert();
      split_?.revert();
    };
  }, [split, delay, stagger, start, duration]);

  return createElement(
    as,
    { ref, className: `${className}`, style: { visibility: 'hidden' } },
    children
  );
}
