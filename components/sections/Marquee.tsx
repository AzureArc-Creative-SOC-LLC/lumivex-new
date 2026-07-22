'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const WORDS = [
  'Research-Grade',
  'Batch-Tested',
  'Fully Traceable',
  'Third-Party Analysed',
  'Certificate of Analysis',
  'Research Use Only',
];

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const half = track.scrollWidth / 2;

      // Continuous base drift.
      const tween = gsap.to(track, {
        x: -half,
        duration: 28,
        ease: 'none',
        repeat: -1,
        modifiers: { x: (x) => `${parseFloat(x) % half}px` },
      });

      // Scroll velocity feeds the marquee speed + a slight skew for energy.
      const skewSetter = gsap.quickSetter(track, 'skewX', 'deg');
      let resetSkew: ReturnType<typeof gsap.delayedCall> | null = null;

      const st = ScrollTrigger.create({
        trigger: track,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = self.getVelocity();
          const clamped = gsap.utils.clamp(-3, 3, v / 300);
          tween.timeScale(1 + Math.abs(v) / 1200);
          skewSetter(clamped);
          resetSkew?.kill();
          resetSkew = gsap.delayedCall(0.2, () => {
            skewSetter(0);
            tween.timeScale(1);
          });
        },
      });

      return () => {
        st.kill();
        resetSkew?.kill();
      };
    }, track);

    return () => ctx.revert();
  }, []);

  const items = [...WORDS, ...WORDS];

  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-y border-charcoal/10 bg-ivory py-10 md:py-14"
    >
      <div
        ref={trackRef}
        className="flex w-max items-center whitespace-nowrap will-change-transform"
      >
        {items.map((word, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8 text-5xl font-extralight tracking-tightest text-charcoal md:px-12 md:text-7xl">
              {word}
            </span>
            <span className="text-3xl text-gold md:text-4xl">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
