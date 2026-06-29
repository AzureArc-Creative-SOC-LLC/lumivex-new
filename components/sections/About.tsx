'use client';

import { img, IMAGES, STATS } from '@/lib/data';
import CurtainImage from '@/components/animations/CurtainImage';
import RevealText from '@/components/animations/RevealText';
import FadeIn from '@/components/animations/FadeIn';
import CountUp from '@/components/animations/CountUp';

export default function About() {
  return (
    <section id="about" className="relative bg-cream py-section">
      <div className="container-wide">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
          {/* Portrait */}
          <div className="lg:col-span-5">
            <CurtainImage
              src={img(IMAGES.aboutPortrait, 1200)}
              alt="Lumivex research compound, in-house"
              className="aspect-[3/4] w-full"
              sizes="(max-width: 1024px) 100vw, 42vw"
              direction="up"
              intensity={9}
            />
          </div>

          {/* Story */}
          <div className="lg:col-span-6 lg:col-start-7">
            <span className="eyebrow">About Lumivex</span>
            <RevealText
              as="h2"
              split="lines"
              className="mt-6 text-section font-extralight text-charcoal"
            >
              Effortlessly advance science and research.
            </RevealText>

            <div className="mt-8 space-y-6">
              <RevealText
                as="p"
                split="lines"
                className="text-base font-light leading-relaxed text-charcoal/65"
              >
                Lumivex develops innovative compounds for laboratory research use
                only. Our science-backed peptides and formulations are provided
                in sealed formats with regulated, research-only supply and full
                traceability across Europe & the UK.
              </RevealText>
              <RevealText
                as="p"
                split="lines"
                className="text-base font-light leading-relaxed text-charcoal/65"
              >
                Our in-house R&amp;D lab produces research-grade peptide APIs
                under ISO-certified clean-room standards — with batch validation
                and documented chain of custody from synthesis through dispatch.
              </RevealText>
            </div>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 border-t border-charcoal/10 pt-12 sm:grid-cols-3">
              {STATS.map((stat) => (
                <FadeIn key={stat.label} y={28}>
                  <div>
                    <p className="text-4xl font-extralight tracking-tightest text-charcoal md:text-5xl">
                      <CountUp value={stat.value} />
                      <span className="text-gold">{stat.suffix}</span>
                    </p>
                    <p className="mt-3 text-[11px] uppercase tracking-wider leading-snug text-charcoal/50">
                      {stat.label}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
