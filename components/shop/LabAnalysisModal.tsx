'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type LabAnalysisData = {
  purity?: string;
  batchNumber?: string;
  fillVolume?: string;
  compounds?: { name: string; concentration: string; content: string }[];
};

export default function LabAnalysisModal({
  open,
  onClose,
  onViewReport,
  data,
}: {
  open: boolean;
  onClose: () => void;
  onViewReport: () => void;
  data: LabAnalysisData;
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

  const facts = [
    { label: 'Batch Number', value: data.batchNumber },
    { label: 'Fill Volume', value: data.fillVolume },
    { label: 'Purity', value: data.purity, gold: true },
  ].filter((f) => !!f.value);

  const compounds = data.compounds ?? [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-charcoal/80 px-4 py-8 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Janoshik third-party lab analysis"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[10px] bg-charcoal px-6 py-9 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] sm:px-9"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close lab analysis"
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-ivory/20 text-ivory/70 transition-colors hover:border-ivory hover:text-ivory"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[8px] bg-ivory/10 text-ivory">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path
                    d="M8 1.667v4.86a2 2 0 01-.28 1.02l-4.1 6.95A2 2 0 005.34 17.5h9.32a2 2 0 001.72-2.99l-4.1-6.96a2 2 0 01-.28-1.02V1.667M6.25 1.667h7.5M5.6 12.5h8.8"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2 className="mt-5 text-lg font-semibold uppercase tracking-wider text-ivory sm:text-xl">
                Janoshik Third-Party Lab Analysis
              </h2>
              <p className="mt-3 text-[13px] font-light text-ivory/55">
                Independently tested and verified by Janoshik Analytical.
              </p>
            </div>

            {/* Fact tiles */}
            {facts.length > 0 && (
              <div
                className={`mt-7 grid gap-3 ${
                  facts.length >= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
                }`}
              >
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="rounded-[6px] border border-ivory/15 px-4 py-4 text-center"
                  >
                    <div className="text-[10px] uppercase tracking-wider text-ivory/45">
                      {f.label}
                    </div>
                    <div
                      className={`mt-2 text-base font-semibold ${
                        f.gold ? 'text-gold-light' : 'text-ivory'
                      }`}
                    >
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Compound table */}
            {compounds.length > 0 && (
              <>
                <div className="mt-4 overflow-hidden rounded-[6px] border border-ivory/15">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-ivory/[0.07] text-[10px] uppercase tracking-wider text-ivory/45">
                      <tr>
                        <th className="px-4 py-3 font-medium">Compound</th>
                        <th className="px-4 py-3 text-center font-medium">
                          Concentration
                        </th>
                        <th className="px-4 py-3 text-center font-medium">
                          Verified Content
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ivory/10">
                      {compounds.map((c) => (
                        <tr key={c.name}>
                          <td className="px-4 py-3 font-semibold text-ivory">
                            {c.name}
                          </td>
                          <td className="px-4 py-3 text-center text-ivory/75">
                            {c.concentration}
                          </td>
                          <td className="px-4 py-3 text-center text-ivory/75">
                            {c.content}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-center text-[11px] font-light leading-relaxed text-ivory/40">
                  Concentration is measured per mL; verified content reflects the
                  total assayed mass across the stated fill volume.
                </p>
              </>
            )}

            <button
              onClick={onViewReport}
              className="mt-7 w-full rounded-[6px] bg-cream px-5 py-3.5 text-[13px] font-semibold text-charcoal transition-colors hover:bg-gold hover:text-ivory"
            >
              View Full Janoshik Report
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
