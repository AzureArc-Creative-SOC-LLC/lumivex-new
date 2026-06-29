'use client';

import { FOOTER_LINKS } from '@/lib/data';
import { scrollToSection } from '@/lib/lenis';
import RevealText from '@/components/animations/RevealText';
import FadeIn from '@/components/animations/FadeIn';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal pt-section text-ivory">
      <div className="container-wide">
        <div className="grid grid-cols-1 gap-12 pb-20 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <FadeIn>
              <p className="eyebrow text-gold-light">Lumivex</p>
            </FadeIn>
            <RevealText
              as="p"
              split="lines"
              className="mt-6 max-w-md text-2xl font-extralight leading-snug text-ivory/80 md:text-3xl"
            >
              Premium research compounds — engineered for precision, validated by
              science.
            </RevealText>
            <FadeIn>
              <p className="mt-8 max-w-sm text-[12px] font-light leading-relaxed text-ivory/40">
                Lumivex has never operated on any social media platforms. Our
                official site is lumivex.store — please beware of scam sites.
              </p>
            </FadeIn>
          </div>

          <div className="lg:col-span-3 lg:col-start-8">
            <p className="text-[11px] uppercase tracking-wider text-ivory/40">
              Navigate
            </p>
            <ul className="mt-6 space-y-3">
              {FOOTER_LINKS.navigate.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="link-underline text-sm font-light text-ivory/70 hover:text-ivory"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[11px] uppercase tracking-wider text-ivory/40">
              Legal
            </p>
            <ul className="mt-6 space-y-3">
              {FOOTER_LINKS.legal.map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="link-underline text-sm font-light text-ivory/70 hover:text-ivory"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Oversized brand wordmark */}
        <div className="border-t border-ivory/10 pt-10">
          <h2 className="select-none text-center text-[22vw] font-extralight leading-none tracking-tightest text-ivory/[0.06] md:text-[17vw]">
            LUMIVEX
          </h2>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-ivory/10 py-8 text-[12px] font-light text-ivory/40 md:flex-row">
          <p>© {2026} Lumivex. All rights reserved.</p>
          <p className="uppercase tracking-wider text-ivory/35">
            Research use only — not for human consumption
          </p>
        </div>
      </div>
    </footer>
  );
}
