'use client';

import { useState } from 'react';
import RevealText from '@/components/animations/RevealText';
import FadeIn from '@/components/animations/FadeIn';

function FloatingField({
  label,
  type = 'text',
  textarea = false,
  name,
}: {
  label: string;
  type?: string;
  textarea?: boolean;
  name: string;
}) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className={`pointer-events-none absolute left-0 origin-left transition-all duration-300 ease-lux ${
          active
            ? 'top-0 text-[11px] uppercase tracking-wider text-gold'
            : 'top-7 text-base text-charcoal/45'
        }`}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full resize-none border-b border-charcoal/20 bg-transparent pb-3 pt-7 text-base text-charcoal outline-none transition-colors duration-300 focus:border-gold"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full border-b border-charcoal/20 bg-transparent pb-3 pt-7 text-base text-charcoal outline-none transition-colors duration-300 focus:border-gold"
        />
      )}
    </div>
  );
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="relative bg-cream py-section">
      <div className="container-wide">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24">
          <div className="lg:col-span-5">
            <span className="eyebrow"></span>
            <RevealText
              as="h2"
              split="lines"
              className="mt-6 text-display font-extralight text-charcoal"
            >
              Start with Lumivex.
            </RevealText>
            <RevealText
              as="p"
              split="lines"
              className="mt-8 max-w-md text-base font-light leading-relaxed text-charcoal/60"
            >
              For laboratories and institutions sourcing research-grade peptides
              with full documentation, batch traceability, and verified purity.
              Our team responds within one business day.
            </RevealText>

            <div className="mt-12 space-y-6">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-charcoal/40">
                  Email
                </p>
                <a
                  href="mailto:research@lumivex.store"
                  className="link-underline mt-1 inline-block text-lg font-light text-charcoal"
                >
                  research@lumivex.store
                </a>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-charcoal/40">
                  Compliance
                </p>
                <p className="mt-1 text-sm font-light leading-relaxed text-charcoal/55">
                  Research use only  not for human or veterinary consumption.
                </p>
              </div>
            </div>
          </div>

          <FadeIn as="div" className="lg:col-span-6 lg:col-start-7" y={40}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-10"
            >
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                <FloatingField label="Full name" name="name" />
                <FloatingField label="Institution" name="institution" />
              </div>
              <FloatingField label="Email address" name="email" type="email" />
              <FloatingField label="Your enquiry" name="message" textarea />

              <button
                type="submit"
                className="group relative mt-4 inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-charcoal px-10 py-5 text-sm font-medium text-ivory transition-all duration-500 hover:scale-[0.99] sm:w-auto"
              >
                <span className="absolute inset-0 z-0 origin-left scale-x-0 bg-gold transition-transform duration-700 ease-lux group-hover:scale-x-100" />
                <span className="relative z-10">
                  {submitted ? 'Thank you — we will be in touch' : 'Submit request'}
                </span>
              </button>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
