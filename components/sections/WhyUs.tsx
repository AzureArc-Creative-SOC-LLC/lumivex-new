'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STATS, WHY_US } from '@/lib/data';
import { scrollToSection } from '@/lib/lenis';

/* Minimalist line icons, one per capability */
const ICONS: ReactNode[] = [
  <path key="i" d="M9 3h6M10 3v6L4.6 18.4A2 2 0 0 0 6.3 21.5h11.4a2 2 0 0 0 1.7-3.1L14 9V3M7.5 14h9" />,
  <path key="i" d="M3 12h4l2.5 7 4-15 2.5 8H21" />,
  <>
    <circle key="a" cx="12" cy="12" r="8" />
    <circle key="b" cx="12" cy="12" r="3" />
    <path key="c" d="M12 1v3M12 20v3M1 12h3M20 12h3" />
  </>,
  <path key="i" d="M12 3s6.5 6.8 6.5 11.2A6.5 6.5 0 0 1 5.5 14.2C5.5 9.8 12 3 12 3z" />,
  <>
    <path key="a" d="M12 3l7.5 2.8v5.4c0 4.6-3.2 7.6-7.5 8.8-4.3-1.2-7.5-4.2-7.5-8.8V5.8L12 3z" />
    <path key="b" d="M9 12l2 2 4-4.5" />
  </>,
  <path key="i" d="M12 2v20M4.2 7l15.6 10M19.8 7L4.2 17M12 6l-2.2-2.2M12 6l2.2-2.2M12 18l-2.2 2.2M12 18l2.2 2.2" />,
];

function Icon({ index, className = 'h-[15px] w-[15px]' }: { index: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {ICONS[index]}
    </svg>
  );
}

export default function WhyUs() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set('[data-circle], [data-reveal]', { autoAlpha: 1 });
        return;
      }
      gsap.set('[data-circle], [data-reveal]', { autoAlpha: 0 });

      gsap.fromTo(
        '[data-circle]',
        { scale: 0.82 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.14,
          clearProps: 'transform',
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        }
      );

      gsap.fromTo(
        '[data-reveal]',
        { y: 26 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          clearProps: 'transform',
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        }
      );

      // Gentle floating accent dots + small circles
      gsap.to('[data-float-a]', {
        y: 14,
        duration: 3.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
      gsap.to('[data-float-b]', {
        y: -12,
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="why-us" className="relative overflow-hidden bg-cream py-section">
      <div ref={rootRef} className="container-wide">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
          {/* Left — circular image collage */}
          <div className="relative mx-auto h-[500px] w-full max-w-[580px] sm:h-[560px] lg:h-[600px]">
            {/* halftone dots */}
            <div
              data-float-b
              className="pointer-events-none absolute left-0 top-6 h-40 w-40 opacity-50"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(28,26,23,0.22) 1.4px, transparent 1.6px)',
                backgroundSize: '15px 15px',
                maskImage:
                  'radial-gradient(circle at center, black 55%, transparent 72%)',
                WebkitMaskImage:
                  'radial-gradient(circle at center, black 55%, transparent 72%)',
              }}
            />

            {/* accent dots */}
            <span
              data-float-a
              className="absolute left-[6%] top-[30%] h-3 w-3 rounded-full bg-gold"
            />
            <span
              data-float-b
              className="absolute right-[18%] top-[6%] h-4 w-4 rounded-full border border-gold/60"
            />
            <span
              data-float-a
              className="absolute bottom-[14%] right-[8%] h-2.5 w-2.5 rounded-full bg-charcoal/30"
            />

            {/* main circle */}
            <div
              data-circle
              className="absolute left-1/2 top-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full shadow-[0_30px_60px_-30px_rgba(28,26,23,0.4)] sm:h-[370px] sm:w-[370px] lg:h-[420px] lg:w-[420px]"
            >
              <Image
                src="/images/whuus-1.avif"
                alt="Lumivex research scientist"
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>

            {/* small circle — top right */}
            <div
              data-circle
              data-float-b
              className="absolute right-[2%] top-[3%] h-[140px] w-[140px] overflow-hidden rounded-full ring-[6px] ring-cream shadow-[0_20px_40px_-24px_rgba(28,26,23,0.5)] sm:h-[175px] sm:w-[175px]"
            >
              <Image
                src="/images/whyus2.jpeg"
                alt="Lumivex research laboratory team"
                fill
                sizes="140px"
                className="object-cover"
              />
            </div>

            {/* small circle — bottom left */}
            <div
              data-circle
              data-float-a
              className="absolute bottom-[2%] left-[2%] h-[118px] w-[118px] overflow-hidden rounded-full ring-[6px] ring-cream shadow-[0_20px_40px_-24px_rgba(28,26,23,0.5)] sm:h-[150px] sm:w-[150px]"
            >
              <Image
                src="/images/whyus3.jpeg"
                alt="Laboratory glassware"
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right — editorial content */}
          <div className="lg:pl-6">
            <span
              data-reveal
              className="text-[11px] font-medium uppercase tracking-eyebrow text-gold"
            >
              Why Lumivex
            </span>
            <h2
              data-reveal
              className="mt-5 text-section font-extralight leading-[1.05] tracking-tight text-charcoal"
            >
              An R&amp;D-compliant supply chain.
            </h2>
            <p
              data-reveal
              className="mt-5 max-w-xl text-[15px] font-light leading-relaxed text-charcoal/55"
            >
              Every compound is engineered, validated, and dispatched under one
              roof — with documented integrity from synthesis to delivery and a
              certificate of analysis behind every batch.
            </p>

            {/* stats strip */}
            <div
              data-reveal
              className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-5 border-y border-charcoal/10 py-5"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-extralight tracking-tightest text-charcoal">
                    {s.value}
                    <span className="text-gold">{s.suffix}</span>
                  </p>
                  <p className="mt-1.5 text-[10.5px] uppercase tracking-wider text-charcoal/45">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* capability chip-cards */}
            <ul
              data-reveal
              className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
            >
              {WHY_US.map((item, i) => (
                <li
                  key={item.no}
                  className="group flex items-center gap-3 rounded-xl border border-charcoal/[0.07] bg-white/60 px-3.5 py-2.5 transition-all duration-500 hover:-translate-y-0.5 hover:border-gold/30 hover:bg-white hover:shadow-[0_14px_30px_-20px_rgba(28,26,23,0.4)]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-charcoal/10 bg-cream text-gold transition-colors duration-500 group-hover:border-gold/40 group-hover:bg-gold group-hover:text-ivory">
                    <Icon index={i} />
                  </span>
                  <span className="text-[13px] font-medium leading-tight text-charcoal">
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>

            <button
              data-reveal
              onClick={() => scrollToSection('#products')}
              className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-charcoal px-7 py-3.5 text-sm font-medium text-ivory transition-colors duration-500 hover:bg-gold"
            >
              Explore the catalogue
              <span
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
