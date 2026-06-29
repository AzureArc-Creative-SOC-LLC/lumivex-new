'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { TESTIMONIALS } from '@/lib/data';
import RevealText from '@/components/animations/RevealText';

function initials(name: string) {
  return name
    .replace(/^Dr\.\s*/, '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const Star = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-gold" aria-hidden>
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
  </svg>
);

const Chevron = ({ dir = 'right' }: { dir?: 'left' | 'right' }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {dir === 'left' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
  </svg>
);

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const n = TESTIMONIALS.length;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stop();
    timer.current = setInterval(() => {
      setDir(1);
      setIndex((p) => (p + 1) % n);
    }, 6000);
  };
  const stop = () => {
    if (timer.current) clearInterval(timer.current);
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  const go = (d: number) => {
    setDir(d);
    setIndex((p) => (p + d + n) % n);
    start();
  };
  const jump = (i: number) => {
    setDir(i > index ? 1 : -1);
    setIndex(i);
    start();
  };

  const t = TESTIMONIALS[index];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-charcoal py-section text-ivory"
      onMouseEnter={stop}
      onMouseLeave={start}
    >
      {/* ambient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(820px circle at 80% 15%, rgba(184,150,90,0.12), transparent 55%)',
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 left-6 select-none font-serif text-[20rem] leading-none text-ivory/[0.04] md:left-16"
      >
        &ldquo;
      </span>

      <div className="container-wide relative z-10">
        {/* header */}
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow text-gold-light">Voices</span>
            <RevealText
              as="h2"
              split="lines"
              className="mt-6 max-w-2xl text-display font-extralight text-ivory"
            >
              Trusted by those who measure everything.
            </RevealText>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} />
            ))}
            <span className="ml-3 text-sm font-light text-ivory/55">
              Rated by research partners
            </span>
          </div>
        </div>

        {/* featured quote */}
        <div className="relative min-h-[280px] md:min-h-[240px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={index}
              custom={dir}
              initial={{ opacity: 0, y: dir > 0 ? 28 : -28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: dir > 0 ? -24 : 24 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl"
            >
              <p className="text-2xl font-extralight leading-[1.35] tracking-tight text-ivory/90 md:text-[2.1rem]">
                {t.quote}
              </p>
              <figcaption className="mt-10 flex items-center gap-4">
                {t.image ? (
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-gold/40 ring-offset-2 ring-offset-charcoal">
                    <Image
                      src={t.image}
                      alt={t.author}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-light text-sm font-medium tracking-wide text-charcoal">
                    {initials(t.author)}
                  </span>
                )}
                <span>
                  <span className="block text-base font-medium text-ivory">
                    {t.author}
                  </span>
                  <span className="block text-sm font-light text-ivory/50">
                    {t.role}
                  </span>
                </span>
              </figcaption>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* controls */}
        <div className="mt-12 flex items-center justify-between border-t border-ivory/10 pt-8">
          <div className="flex items-center gap-4">
            <span className="text-sm font-light tabular-nums text-ivory/70">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => jump(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === index ? 'w-8 bg-gold' : 'w-3 bg-ivory/25 hover:bg-ivory/40'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-light tabular-nums text-ivory/35">
              {String(n).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 transition-colors duration-500 hover:border-gold/50 hover:text-gold"
            >
              <Chevron dir="left" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 transition-colors duration-500 hover:border-gold/50 hover:text-gold"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
