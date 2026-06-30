'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { scrollToSection } from '@/lib/lenis';
import Magnetic from '@/components/ui/Magnetic';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    const title = titleRef.current;
    if (!section || !image || !content || !title) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Intro animation
      const split = new SplitType(title, { types: 'lines,chars', lineClass: 'split-line' });
      const tl = gsap.timeline({ delay: 0.35 });

      if (!prefersReduced) {
        gsap.set(title, { autoAlpha: 1 });
        tl.from(split.chars, {
          yPercent: 120,
          opacity: 0,
          filter: 'blur(10px)',
          duration: 1.4,
          ease: 'power4.out',
          stagger: 0.025,
        });
        tl.from(
          '[data-hero-fade]',
          {
            y: 30,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
            stagger: 0.12,
          },
          '-=0.9'
        );

        // Scroll: the hero image drifts upward far slower than the page
        // (premium floating effect) plus a subtle scale. Drift is richer on
        // desktop and gentler on smaller screens. Linear ease + scrub.
        const vw = window.innerWidth;
        const factor = vw < 640 ? 0.55 : vw < 1024 ? 0.78 : 1;
        gsap.fromTo(
          image,
          { yPercent: -12 * factor, scale: 1.06 },
          {
            yPercent: 15 * factor,
            scale: 1.14,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
        gsap.to(content, {
          yPercent: -22,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      } else {
        gsap.set(title, { autoAlpha: 1 });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden"
    >
      {/* Background — medical-research video, taller than the viewport so it
          can drift without exposing an edge during parallax */}
      <div
        ref={imageRef}
        className="absolute inset-x-0 -top-[22%] h-[144%] will-change-transform"
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/35 to-charcoal/70" />
        <div className="absolute inset-0 bg-charcoal/25" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="container-wide relative z-10 flex flex-col items-center text-center will-change-transform"
      >
        <span
          data-hero-fade
          className="eyebrow mb-8 text-gold-light"
        >
          Engineered for precision · Validated by science
        </span>
        <h1
          ref={titleRef}
          className="text-hero-d font-extralight text-ivory"
          style={{ visibility: 'hidden' }}
        >
          Premium<br />Research.
        </h1>
        <p
          data-hero-fade
          className="text-pretty mt-8 max-w-xl text-[15px] font-light leading-relaxed text-ivory/75 sm:mt-10 sm:text-base md:text-lg"
        >
          Supplying leading laboratories across the UK & EU with high-purity
          research compounds — manufactured in-house, batch-tested, and fully
          traceable for R&amp;D applications.
        </p>
        <div
          data-hero-fade
          className="mt-10 flex w-full flex-col items-stretch gap-3 sm:mt-12 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
        >
          <Magnetic strength={0.5} className="w-full sm:w-auto">
            <button
              data-touch-target
              onClick={() => scrollToSection('#products')}
              className="w-full rounded-full bg-ivory px-9 py-4 text-sm font-medium text-charcoal transition-colors duration-500 hover:bg-gold hover:text-ivory sm:w-auto"
            >
              Browse the Catalogue
            </button>
          </Magnetic>
          <button
            data-touch-target
            onClick={() => scrollToSection('#about')}
            className="link-underline mx-auto rounded-full px-4 py-4 text-sm font-medium text-ivory/90 sm:mx-0"
          >
            About Lumivex
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero-fade
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-eyebrow text-ivory/60">
          Scroll
        </span>
        <span className="relative h-12 w-px overflow-hidden bg-ivory/20">
          <span className="absolute left-0 top-0 h-1/2 w-full animate-[scrollLine_2s_ease-in-out_infinite] bg-gold" />
        </span>
      </div>

      <style jsx>{`
        @keyframes scrollLine {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(200%);
          }
        }
      `}</style>
    </section>
  );
}
