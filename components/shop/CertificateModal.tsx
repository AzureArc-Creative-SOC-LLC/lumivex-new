'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

export type CertificateData = {
  productName: string;
  verifyUrl?: string;
  certificateImages?: string[];
};

export default function CertificateModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: CertificateData;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const images = data.certificateImages ?? [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/70 px-4 py-8 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Certificate of analysis"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[8px] bg-ivory shadow-[0_40px_80px_-20px_rgba(28,26,23,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-charcoal/10 bg-cream px-6 py-5 sm:px-8">
              <div>
                <span className="eyebrow">Janoshik Analytical</span>
                <h2 className="mt-2 text-xl font-light tracking-tight text-charcoal sm:text-2xl">
                  Certificate of Analysis
                </h2>
                <p className="mt-1 text-[12px] font-light text-charcoal/55">
                  Third-party independent lab report — {data.productName}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close certificate"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/70 transition-colors hover:border-charcoal hover:text-charcoal"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M1 1L13 13M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              {/* Certificate images */}
              {images.length > 0 && (
                <div className="space-y-4">
                  {images.map((src, i) => (
                    <div
                      key={src + i}
                      className="relative w-full overflow-hidden rounded-[6px] border border-charcoal/10 bg-cream"
                    >
                      <Image
                        src={src}
                        alt={`Certificate of analysis page ${i + 1}`}
                        width={1200}
                        height={1600}
                        sizes="(max-width: 767px) 100vw, 900px"
                        className="h-auto w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex flex-col-reverse items-stretch gap-3 border-t border-charcoal/10 bg-cream px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-[11px] font-light text-charcoal/50">
                Independently verified by Janoshik Analytical.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                {data.verifyUrl && (
                  <a
                    href={data.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-charcoal/20 px-5 py-2.5 text-center text-[12px] font-medium text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-ivory"
                  >
                    Verify on janoshik.com ↗
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
