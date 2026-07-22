'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
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

        // Scroll: the hero image lags behind the page (premium floating
        // effect) plus a subtle scale. The image starts flush with the
        // viewport — all drift headroom comes from the scale, never from an
        // initial offset, so the subject is never cropped at rest.
        //
        // Invariant: scale grows the box by 50 * (scale - 1) on each edge,
        // so `50 * (scaleEnd - 1) >= yEnd` keeps the top edge covered for the
        // whole scrub. Drift is richer on desktop, gentler on small screens.
        const vw = window.innerWidth;
        const factor = vw < 640 ? 0.55 : vw < 1024 ? 0.78 : 1;
        gsap.fromTo(
          image,
          { yPercent: 0, scale: 1 },
          {
            yPercent: 8 * factor,
            scale: 1 + 0.2 * factor,
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
      {/* Background — the subject fills nearly the full height of the source
          frame, so the box sits flush with the viewport and the crop is
          anchored high: any overflow is taken from the floor at the bottom
          (hidden behind the CTAs and gradient) rather than the pen and face. */}
      <div
        ref={imageRef}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="/images/hero-seo-new.webp"
          alt="Lumivex Labs research laboratory"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[80%_50%] sm:object-[62%_25%] md:object-[50%_15%]"
        />
      </div>

      {/* Legibility wash — a sibling of the parallax box, not a child, so it
          stays pinned while the image drifts and scales beneath it. Weighted
          to the left, where the copy sits over the near-white table top, and
          fading out before the subject on the right. Narrow screens crop in
          toward her, so the copy needs cover across the full width there.

          Olive-gold rather than neutral black: it shares the ~37deg hue of the
          gold token, so the shade reads as part of the shot's warmth. It is
          taken well below the token's lightness though — ivory on gold itself
          is only 2.5:1, while this holds ~10:1. Stops end on a matching hue at
          /0, not `transparent` (= transparent black), which fades through grey. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#332E18]/88 via-[#4A4226]/62 to-[#4A4226]/28 md:from-[#332E18]/72 md:via-[#3E3820]/34 md:to-[#4A4226]/0"
      />

      {/* Gold edge vignette, echoing the framing of the reference art */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[16%] bg-gradient-to-l from-gold/32 to-gold/0 md:block"
      />

      {/* Foot wash — the shot's near-white table top lands under the body copy,
          the CTAs and the scroll cue at every width, and the horizontal wash
          above is at its weakest by then, leaving ivory type on near-white.
          This lifts the bottom band back to a readable contrast: heaviest on
          portrait, where the table occupies the most height. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#2A2413]/90 via-[#332E18]/55 to-[#332E18]/0 md:h-[40%] md:from-[#2A2413]/72 md:via-[#332E18]/34"
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="container-wide relative z-10 flex flex-col items-start text-left will-change-transform"
      >
        {/* Gold on the subject's skin tone is ~1.2:1 at the mobile crop, so the
            eyebrow runs ivory there and only picks up gold once the crop moves
            the copy back over the gradient at md. */}
        <span
          data-hero-fade
          className="eyebrow mb-8 text-ivory/90 md:text-gold-light"
        >
          Engineered for precision · Verified by third-party analysis
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
          research compounds  manufactured in-house, batch tested, and fully
          traceable for R&amp;D applications. Research use only  not for human
          or veterinary use.
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
            className="link-underline rounded-full px-4 py-4 text-sm font-medium text-ivory/90"
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
