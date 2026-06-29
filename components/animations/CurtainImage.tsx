'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Vertical drift direction as the user scrolls down the page. */
  direction?: 'up' | 'down';
  /**
   * Desktop drift half-range, expressed as a % of the (oversized) inner
   * element. Larger / more important visuals use a bigger value. Automatically
   * scaled down on tablet and mobile. Kept subtle by design.
   */
  intensity?: number;
  /** Play the one-time curtain reveal mask when the image enters view. */
  curtain?: boolean;
  rounded?: boolean;
  /** object-fit of the image. 'contain' shows the whole image (no crop). */
  objectFit?: 'cover' | 'contain';
  /** How far (in %) the inner layer extends beyond the frame on each side. */
  oversize?: number;
  /** Baseline scale held during drift (helps cover edges for 'cover' fit). */
  baseScale?: number;
};

export default function CurtainImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  direction = 'up',
  intensity = 6,
  curtain = true,
  rounded = true,
  objectFit = 'cover',
  oversize = 14,
  baseScale = 1.06,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    const mask = maskRef.current;
    if (!wrap || !inner) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        if (mask) gsap.set(mask, { scaleY: 0 });
        gsap.set(inner, { scale: 1, yPercent: 0, filter: 'blur(0px)' });
        return;
      }

      // Responsive intensity — richer on desktop, gentler on smaller screens.
      const w = window.innerWidth;
      const factor = w < 640 ? 0.45 : w < 1024 ? 0.7 : 1;
      const amp = intensity * factor;
      const dir = direction === 'up' ? 1 : -1;

      // Baseline scale keeps edges covered together with the oversized inner
      // container, so the drift never reveals empty space (for 'cover' fit).
      gsap.set(inner, { scale: baseScale });

      // One-time curtain reveal: vertical mask lifts while the image de-zooms
      // and de-blurs into place.
      if (curtain && mask) {
        gsap.set(inner, { scale: baseScale + 0.1, filter: 'blur(12px)' });
        gsap.set(mask, { scaleY: 1, transformOrigin: 'top' });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: wrap, start: 'top 82%', once: true },
        });
        tl.to(mask, {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 1.25,
          ease: 'power4.inOut',
        }).to(
          inner,
          {
            scale: baseScale,
            filter: 'blur(0px)',
            duration: 1.6,
            ease: 'power4.out',
          },
          0.1
        );
      }

      // Continuous, scroll-linked parallax drift: starts as the image enters
      // the viewport and runs until it exits. Linear easing + scrub so it stays
      // perfectly synced to the (Lenis-driven) scroll position.
      gsap.fromTo(
        inner,
        { yPercent: dir * amp },
        {
          yPercent: -dir * amp,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, [direction, intensity, curtain]);

  return (
    <div
      ref={wrapRef}
      className={`curtain ${rounded ? 'rounded-[2px]' : ''} ${className}`}
    >
      {/* Inner is taller than the frame so vertical drift never exposes an edge */}
      <div
        ref={innerRef}
        className="curtain__inner absolute inset-x-0 w-full"
        style={{ top: `-${oversize}%`, height: `${100 + oversize * 2}%` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`${objectFit === 'contain' ? 'object-contain' : 'object-cover'} ${imgClassName}`}
        />
      </div>
      {curtain && (
        <div
          ref={maskRef}
          className="pointer-events-none absolute inset-0 z-10 bg-ivory"
        />
      )}
    </div>
  );
}
