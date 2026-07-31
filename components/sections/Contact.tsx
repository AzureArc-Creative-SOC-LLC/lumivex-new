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
  const [showSuccess, setShowSuccess] = useState(false);

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
                setShowSuccess(true);
                window.setTimeout(() => setShowSuccess(false), 4000);
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

      {/* Success toast */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4 transition-all duration-500 ease-lux sm:justify-end sm:right-6 sm:px-0 ${
          showSuccess ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-charcoal px-5 py-3.5 text-ivory shadow-[0_20px_50px_-15px_rgba(28,26,23,0.5)]">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="#1C1A17"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <p className="text-[13px] font-light text-ivory/90">
            Enquiry sent — we&apos;ll be in touch within one business day.
          </p>
          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            aria-label="Dismiss"
            className="ml-1 text-ivory/40 transition-colors hover:text-ivory"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
