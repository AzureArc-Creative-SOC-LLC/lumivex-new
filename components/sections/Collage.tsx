'use client';

import { img, IMAGES } from '@/lib/data';
import CurtainImage from '@/components/animations/CurtainImage';
import RevealText from '@/components/animations/RevealText';

export default function Collage() {
  return (
    <section className="relative bg-ivory py-section">
      <div className="container-wide">
        {/* Intro row */}
        <div className="mb-20 grid grid-cols-1 gap-10 md:mb-28 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="eyebrow">In-House — R&amp;D</span>
            <RevealText
              as="h2"
              split="lines"
              className="mt-6 text-display font-extralight text-charcoal"
            >
              End-to-end fulfilment for R&amp;D supply.
            </RevealText>
          </div>
          <div className="flex items-end lg:col-span-4 lg:col-start-9">
            <RevealText
              as="p"
              split="lines"
              className="text-base font-light leading-relaxed text-charcoal/60"
            >
              Compliant, batch-tested peptides and compounds for non-human
              research  supported by third-party verification and documented
              supply chain integrity.
            </RevealText>
          </div>
        </div>

        {/* Asymmetric collage — each image drifts independently, alternating
            up / down for a layered editorial feel */}
        <div className="grid grid-cols-12 gap-5 md:gap-7">
          <div className="group col-span-12 overflow-hidden rounded-[3px] md:col-span-7">
            <CurtainImage
              src={img(IMAGES.collage1, 1400)}
              alt="Lumivex research team in the laboratory"
              className="aspect-[4/3] w-full transition-transform duration-700 ease-lux group-hover:scale-[1.04]"
              sizes="(max-width: 767px) 100vw, 58vw"
              direction="up"
              intensity={7}
            />
          </div>

          <div className="group col-span-7 mt-10 overflow-hidden rounded-[3px] md:col-span-5 md:mt-24">
            <CurtainImage
              src={img(IMAGES.collage2, 1000)}
              alt="Scientist analysing a sample at the microscope"
              className="aspect-[3/4] w-full transition-transform duration-700 ease-lux group-hover:scale-[1.04]"
              sizes="(max-width: 767px) 60vw, 40vw"
              direction="down"
              intensity={10}
            />
          </div>

          <div className="group col-span-5 overflow-hidden rounded-[3px] md:col-span-4 md:col-start-1">
            <CurtainImage
              src={img(IMAGES.collage3, 900)}
              alt="Pipetting research compounds in the lab"
              className="aspect-square w-full transition-transform duration-700 ease-lux group-hover:scale-[1.04]"
              sizes="(max-width: 767px) 40vw, 33vw"
              direction="up"
              intensity={6}
            />
          </div>

          <div className="col-span-12 flex items-center md:col-span-5 md:col-start-8">
            <RevealText
              as="p"
              split="words"
              className="text-base font-light leading-relaxed text-charcoal/60 md:text-lg"
            >
              Manufactured in our in-house synthesis facility  every compound
              produced under controlled conditions to meet stringent R&amp;D
              specifications.
            </RevealText>
          </div>

          {/* Content opposite the molecular / DNA image */}
          <div className="col-span-12 flex flex-col justify-center md:col-span-6 md:col-start-1 md:self-center">
            <span className="eyebrow">Molecular Precision</span>
            <RevealText
              as="h3"
              split="lines"
              className="mt-6 text-section font-extralight text-charcoal"
            >
              Characterised down to the molecule.
            </RevealText>
            <RevealText
              as="p"
              split="lines"
              className="mt-6 max-w-md text-base font-light leading-relaxed text-charcoal/60"
            >
              Every batch is validated by HPLC and mass spectrometry, with a
              certificate of analysis documenting identity, purity, and structure
              before a single unit is released.
            </RevealText>

            <div className="mt-10 flex items-center gap-10 border-t border-charcoal/10 pt-8">
              <div>
                <p className="text-4xl font-extralight tracking-tightest text-charcoal">
                  99.2<span className="text-gold">%+</span>
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-wider text-charcoal/50">
                  Lowest assayed batch
                </p>
              </div>
              <div>
                <p className="text-4xl font-extralight tracking-tightest text-charcoal">
                  HPLC<span className="text-gold"> + </span>MS
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-wider text-charcoal/50">
                  Batch validation
                </p>
              </div>
            </div>
          </div>

          <div className="group col-span-12 overflow-hidden rounded-[3px] md:col-span-5 md:col-start-8 md:-mt-20">
            <CurtainImage
              src={img(IMAGES.collage4, 1100)}
              alt="Molecular structure of a research compound"
              className="aspect-[4/5] w-full transition-transform duration-700 ease-lux group-hover:scale-[1.04]"
              sizes="(max-width: 767px) 100vw, 42vw"
              direction="down"
              intensity={9}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
