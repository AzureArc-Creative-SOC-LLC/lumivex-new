'use client';

import { useRef, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';
import {
  paymentCapture,
  paymentVerification,
  type CaptureValidateResponse,
  type PaymentVerdict,
  ApiError,
} from '@/lib/api';
import { formatPrice } from '@/components/providers/CartProvider';
import Logo from '@/components/ui/Logo';

type UploadStatus =
  | 'idle'
  | 'uploading'
  | 'verifying'
  | 'received'
  | 'rejected'
  | 'pending';

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = ['Bank transfer', 'Upload proof', 'Verified'] as const;

export default function PaymentCapturePage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [data, setData] = useState<CaptureValidateResponse | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoApplied, setPromoApplied] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState('');
  const [verdict, setVerdict] = useState<PaymentVerdict | null>(null);
  const [verifyNote, setVerifyNote] = useState('');

  useEffect(() => {
    if (!token) return;
    paymentCapture
      .validate(token)
      .then((res) => setData(res))
      .catch((err) => {
        const msg =
          err instanceof ApiError && (err.status === 400 || err.status === 404)
            ? 'This payment link is invalid or has expired.'
            : err instanceof Error
              ? err.message
              : 'Failed to load payment details.';
        setLoadError(msg);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code || promoLoading) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      await paymentCapture.applyPromo(token, code);
      const fresh = await paymentCapture.validate(token);
      setData(fresh);
      setPromoApplied(code);
      setPromoInput('');
    } catch (err) {
      setPromoError(err instanceof Error ? err.message : 'Could not apply promo.');
    } finally {
      setPromoLoading(false);
    }
  };

  const pickFile = (f: File | null) => {
    setFile(f);
    setUploadError('');
    setVerifyNote('');
    setVerdict(null);
    if (uploadStatus !== 'uploading' && uploadStatus !== 'verifying') {
      setUploadStatus('idle');
    }
  };

  const uploadScreenshot = async () => {
    if (!file || uploadStatus === 'uploading' || uploadStatus === 'verifying') return;
    setUploadStatus('uploading');
    setUploadError('');
    setVerifyNote('');
    setVerdict(null);
    try {
      const res = await paymentCapture.upload(token, file);
      if (res.verification_error) setUploadError(res.verification_error);

      // Run the screenshot through the payment-verification-service (OCR
      // match against order total / payee / sort code / account number) to
      // get the authoritative decision, rather than trusting payment_status
      // alone.
      setUploadStatus('verifying');
      try {
        const verified = await paymentVerification.verify(orderNumber, res.screenshotFilename);
        setVerdict(verified.verdict);
        setUploadStatus(verified.verdict.decision === 'approved' ? 'received' : 'rejected');
      } catch (err) {
        setVerifyNote(
          err instanceof Error
            ? err.message
            : 'Could not reach the verification service — falling back to manual review.'
        );
        setUploadStatus(res.payment_status);
      }
    } catch (err) {
      setUploadStatus('idle');
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    }
  };

  if (loading) {
    return (
      <div className="container-wide flex min-h-[60vh] items-center justify-center py-24">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-charcoal/20 border-t-charcoal" />
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <div className="container-wide flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <h1 className="text-section font-extralight tracking-tightest text-charcoal">
          Link unavailable
        </h1>
        <p className="mt-4 max-w-md text-base font-light text-charcoal/55">
          {loadError || 'Payment link not found.'}
        </p>
      </div>
    );
  }

  const order = data.order as Record<string, unknown>;
  const total = Number(order.total ?? 0);
  const orderNumber = String(order.order_number ?? '');

  const activeIndex = uploadStatus === 'received' ? 2 : uploadStatus === 'idle' && !file ? 0 : 1;
  const busy = uploadStatus === 'uploading' || uploadStatus === 'verifying';

  return (
    <div className="min-h-screen bg-ivory">
      <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8 sm:px-8 sm:pt-12 lg:px-12">
        {/* Minimal brand bar */}
        <div className="flex items-center justify-between">
          <Logo className="text-charcoal" />
          <span className="hidden text-[10px] font-medium uppercase tracking-eyebrow text-charcoal/40 sm:inline">
            Secure checkout
          </span>
        </div>

        {/* Header + progress */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-12 border-b border-charcoal/[0.08] pb-10 sm:mt-16"
        >
          <span className="eyebrow">Complete payment</span>
          <h1 className="mt-5 text-[44px] font-extralight leading-[0.95] tracking-tightest text-charcoal sm:text-[64px]">
            Order
          </h1>
          <p className="mt-4 inline-flex items-center rounded-[5px] bg-cream px-3 py-2 font-mono text-[12px] font-light tracking-[0.08em] text-charcoal/75 ring-1 ring-charcoal/[0.07] sm:text-[13px]">
            {orderNumber}
          </p>
          <p className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-charcoal/60">
            Transfer the total below to the account, then upload a screenshot of
            your transfer to confirm.
          </p>

          <div className="mt-10 max-w-lg">
            <ProgressSteps activeIndex={activeIndex} />
          </div>
        </motion.header>

        {/* Two-column layout */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="flex flex-col gap-5 lg:sticky lg:top-10">
              <BankTransferCard
                payeeName={data.bank.payeeName}
                reference={data.bank.reference}
                sortCode={data.bank.sortCode}
                accountNumber={data.bank.accountNumber}
                amountDue={formatPrice(total)}
              />
              {data.allowPromo && (
                <PromoCodeRow
                  value={promoInput}
                  onChange={(v) => {
                    setPromoInput(v);
                    setPromoError('');
                  }}
                  onApply={applyPromo}
                  loading={promoLoading}
                  error={promoError}
                  applied={promoApplied}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-7">
            <UploadSection
              fileRef={fileRef}
              file={file}
              dragActive={dragActive}
              setDragActive={setDragActive}
              onPick={pickFile}
              onSubmit={uploadScreenshot}
              busy={busy}
              busyLabel={uploadStatus === 'uploading' ? 'Uploading…' : 'Verifying…'}
              submitted={uploadStatus === 'received'}
              uploadError={uploadError}
              statusBanner={
                uploadStatus === 'pending' ? (
                  <StatusBanner tone="amber">
                    Screenshot received. Verification is queued; we’ll email you with the result.
                  </StatusBanner>
                ) : uploadStatus === 'rejected' && !verdict ? (
                  <StatusBanner tone="red">
                    We couldn’t verify this screenshot. Please re-upload a clearer image of the transfer.
                  </StatusBanner>
                ) : uploadStatus === 'received' && !verdict ? (
                  <StatusBanner tone="gold">
                    Payment confirmed. Thank you — your order is being prepared.
                  </StatusBanner>
                ) : null
              }
              verifyNote={verifyNote}
            />

            <VerificationPanel
              orderNumber={orderNumber}
              status={uploadStatus}
              verdict={verdict}
              expectedTotal={total}
            />
          </div>
        </div>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-charcoal/[0.08] pt-8">
          <p className="text-[11px] font-light text-charcoal/45">
            Lumivex Laboratories · Research use only
          </p>
          <p className="font-mono text-[10px] font-light tracking-[0.12em] text-charcoal/30">
            ENC-TLS 1.3
          </p>
        </footer>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Progress steps
// ──────────────────────────────────────────────────────────────────────────────

function ProgressSteps({ activeIndex }: { activeIndex: number }) {
  return (
    <ol className="flex w-full items-start" aria-label="Payment progress">
      {STEPS.map((label, index) => {
        const status = index < activeIndex ? 'complete' : index === activeIndex ? 'current' : 'upcoming';
        const isLast = index === STEPS.length - 1;
        return (
          <li
            key={label}
            className={`flex items-start ${isLast ? 'flex-none' : 'flex-1'}`}
            aria-current={status === 'current' ? 'step' : undefined}
          >
            <div className="flex flex-col items-start gap-3">
              <div className="flex h-6 items-center">
                <StepMarker status={status} />
              </div>
              <span
                className={`text-[10px] font-medium uppercase tracking-eyebrow transition-colors duration-500 ${
                  status === 'upcoming' ? 'text-charcoal/35' : 'text-charcoal/70'
                }`}
              >
                {label}
              </span>
            </div>

            {!isLast && (
              <div className="mx-3 mt-[11px] h-px flex-1 bg-sand sm:mx-5">
                <motion.div
                  className="h-px bg-gold"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: index < activeIndex ? 1 : 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.1 * index }}
                  style={{ originX: 0 }}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StepMarker({ status }: { status: 'complete' | 'current' | 'upcoming' }) {
  if (status === 'complete') {
    return (
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gold text-ivory"
      >
        <IconCheck className="h-3 w-3" strokeWidth={2.5} />
      </motion.span>
    );
  }
  if (status === 'current') {
    return (
      <span className="relative flex h-[22px] w-[22px] items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full border border-charcoal/25"
          animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="h-[14px] w-[14px] rounded-full bg-charcoal" />
      </span>
    );
  }
  return (
    <span className="flex h-[22px] w-[22px] items-center justify-center">
      <span className="h-[10px] w-[10px] rounded-full border border-taupe-deep/60 bg-ivory" />
    </span>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Bank transfer card
// ──────────────────────────────────────────────────────────────────────────────

function BankTransferCard({
  payeeName,
  reference,
  sortCode,
  accountNumber,
  amountDue,
}: {
  payeeName: string;
  reference: string;
  sortCode: string;
  accountNumber: string;
  amountDue: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable — still confirm visually */
    }
    setCopied(label);
    window.setTimeout(() => setCopied((c) => (c === label ? null : c)), 1600);
  };

  const rows = [
    { label: 'Payee', value: payeeName },
    { label: 'Reference', value: reference, mono: true },
    { label: 'Sort code', value: sortCode, mono: true },
    { label: 'Account number', value: accountNumber, mono: true },
  ];

  return (
    <section className="overflow-hidden rounded-[10px] bg-cream shadow-[0_10px_40px_-15px_rgba(28,26,23,0.12)] ring-1 ring-charcoal/[0.06]">
      <header className="flex items-start justify-between gap-4 px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
        <div>
          <span className="eyebrow">Step 01</span>
          <h2 className="mt-3 text-2xl font-extralight tracking-tightest text-charcoal sm:text-[28px]">
            Bank transfer details
          </h2>
        </div>
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[6px] bg-sand/70 text-charcoal/60">
          <IconBank className="h-4 w-4" />
        </span>
      </header>

      <dl className="grid grid-cols-1 gap-px bg-charcoal/[0.07] sm:grid-cols-2">
        {rows.map((detail) => (
          <div key={detail.label} className="bg-cream px-6 py-5 sm:px-8">
            <dt className="text-[10px] font-medium uppercase tracking-eyebrow text-charcoal/45">
              {detail.label}
            </dt>
            <dd className="mt-2 flex items-center gap-2">
              <span
                className={`break-all text-charcoal ${
                  detail.mono ? 'font-mono text-[13px] font-light tracking-[0.02em]' : 'text-[15px] font-light'
                }`}
              >
                {detail.value}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(detail.label, detail.value)}
                className="ml-auto flex h-7 w-7 flex-none items-center justify-center rounded-[5px] text-charcoal/35 transition-colors duration-200 hover:bg-sand/70 hover:text-charcoal focus:outline-none focus-visible:ring-1 focus-visible:ring-charcoal/40"
                aria-label={`Copy ${detail.label.toLowerCase()}`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied === detail.label ? (
                    <motion.span
                      key="done"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <IconCheck className="h-3.5 w-3.5 text-gold" strokeWidth={2} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <IconCopy className="h-3.5 w-3.5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </dd>
          </div>
        ))}

        <div className="col-span-full bg-charcoal px-6 py-7 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="block text-[10px] font-medium uppercase tracking-eyebrow text-ivory/45">
                Amount due
              </span>
              <p className="mt-2 text-[11px] font-light leading-relaxed text-ivory/50">
                Send as a single transfer, including the reference.
              </p>
            </div>
            <p className="text-5xl font-extralight tracking-tightest text-ivory sm:text-[56px]">
              {amountDue}
            </p>
          </div>
        </div>
      </dl>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Promo code
// ──────────────────────────────────────────────────────────────────────────────

function PromoCodeRow({
  value,
  onChange,
  onApply,
  loading,
  error,
  applied,
}: {
  value: string;
  onChange: (v: string) => void;
  onApply: () => void;
  loading: boolean;
  error: string;
  applied: string | null;
}) {
  return (
    <div className="rounded-[10px] bg-cream/70 px-6 py-5 ring-1 ring-charcoal/[0.06] sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="promo-code"
            className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-eyebrow text-charcoal/45"
          >
            <IconTag className="h-3 w-3" />
            Promo code
            <span className="normal-case tracking-normal text-charcoal/30">(optional)</span>
          </label>
          <input
            id="promo-code"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onApply();
              }
            }}
            placeholder="Enter code"
            autoComplete="off"
            className="mt-3 w-full border-b border-charcoal/15 bg-transparent pb-2 text-[15px] font-light uppercase tracking-[0.01em] text-charcoal outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-charcoal/30 focus:border-gold"
          />
        </div>
        <button
          type="button"
          onClick={onApply}
          disabled={loading}
          className="rounded-full border border-charcoal/20 px-7 py-2.5 text-[11px] font-medium uppercase tracking-eyebrow text-charcoal transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-1 focus-visible:ring-charcoal/40"
        >
          {loading ? 'Applying…' : 'Apply'}
        </button>
      </div>

      <AnimatePresence>
        {applied && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 font-mono text-[11px] font-light tracking-[0.04em] text-gold"
          >
            {applied} applied — total updated above.
          </motion.p>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-[12px] font-light text-red-600/80"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Upload
// ──────────────────────────────────────────────────────────────────────────────

function UploadSection({
  fileRef,
  file,
  dragActive,
  setDragActive,
  onPick,
  onSubmit,
  busy,
  busyLabel,
  submitted,
  uploadError,
  statusBanner,
  verifyNote,
}: {
  fileRef: React.RefObject<HTMLInputElement | null>;
  file: File | null;
  dragActive: boolean;
  setDragActive: (v: boolean) => void;
  onPick: (f: File | null) => void;
  onSubmit: () => void;
  busy: boolean;
  busyLabel: string;
  submitted: boolean;
  uploadError: string;
  statusBanner: React.ReactNode;
  verifyNote: string;
}) {
  return (
    <section className="rounded-[10px] bg-cream shadow-[0_10px_40px_-15px_rgba(28,26,23,0.12)] ring-1 ring-charcoal/[0.06]">
      <header className="px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
        <span className="eyebrow">Step 02</span>
        <h2 className="mt-3 text-2xl font-extralight tracking-tightest text-charcoal sm:text-[28px]">
          Upload your transfer screenshot
        </h2>
      </header>

      <div className="px-6 pb-6 sm:px-8 sm:pb-8">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            const dropped = e.dataTransfer.files?.[0] ?? null;
            if (dropped) onPick(dropped);
          }}
          className={`relative w-full rounded-[8px] border border-dashed px-6 py-12 text-center transition-colors duration-300 ${
            dragActive ? 'border-gold bg-sand/50' : 'border-taupe-deep/45 bg-ivory/60 hover:border-taupe-deep/70'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            className="sr-only"
          />

          <motion.span
            animate={dragActive ? { y: -4 } : { y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand/70 text-charcoal/60"
          >
            <IconUpload className="h-5 w-5" />
          </motion.span>

          <p className="mt-5 text-[15px] font-light text-charcoal/70">
            Drag and drop your screenshot here, or{' '}
            <span className="border-b border-charcoal/30 pb-px text-charcoal transition-colors duration-200 hover:border-gold hover:text-gold">
              browse files
            </span>
          </p>
          <p className="mt-3 text-[10px] font-medium uppercase tracking-eyebrow text-charcoal/40">
            PNG, JPG, or PDF · max 25 MB.
          </p>
        </button>

        <AnimatePresence initial={false}>
          {file && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex items-center gap-3 rounded-[6px] bg-sand/50 px-4 py-3">
                <IconFile className="h-4 w-4 flex-none text-charcoal/50" />
                <span className="truncate font-mono text-[12px] font-light text-charcoal/75">
                  {file.name}
                </span>
                {!busy && (
                  <button
                    type="button"
                    onClick={() => onPick(null)}
                    className="ml-auto flex h-6 w-6 flex-none items-center justify-center rounded-full text-charcoal/40 transition-colors duration-200 hover:bg-ivory hover:text-charcoal"
                    aria-label="Remove file"
                  >
                    <IconX className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {uploadError && (
          <p className="mt-4 rounded-[4px] border border-red-600/20 bg-red-600/5 px-4 py-3 text-[13px] font-light text-red-600/90">
            {uploadError}
          </p>
        )}

        <AnimatePresence mode="wait">{statusBanner}</AnimatePresence>

        {verifyNote && (
          <p className="mt-3 text-[12px] font-light text-charcoal/45">{verifyNote}</p>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!file || busy || submitted}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-8 py-3.5 text-[11px] font-medium uppercase tracking-eyebrow text-ivory transition-colors duration-300 hover:bg-gold disabled:cursor-not-allowed disabled:bg-charcoal/25 focus:outline-none focus-visible:ring-1 focus-visible:ring-charcoal/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:w-auto"
        >
          {busy && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" />
          )}
          {busy ? busyLabel : 'Submit screenshot'}
        </button>
      </div>
    </section>
  );
}

function StatusBanner({
  tone,
  children,
}: {
  tone: 'gold' | 'amber' | 'red';
  children: React.ReactNode;
}) {
  const styles = {
    gold: 'border-gold/40 bg-gold/10 text-charcoal',
    amber: 'border-amber-500/40 bg-amber-500/10 text-charcoal',
    red: 'border-red-600/30 bg-red-600/5 text-red-600/90',
  }[tone];

  return (
    <motion.p
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={`mt-4 rounded-[4px] border px-4 py-3 text-[13px] font-medium ${styles}`}
    >
      {children}
    </motion.p>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Verification panel
// ──────────────────────────────────────────────────────────────────────────────

function VerificationPanel({
  orderNumber,
  status,
  verdict,
  expectedTotal,
}: {
  orderNumber: string;
  status: UploadStatus;
  verdict: PaymentVerdict | null;
  expectedTotal: number;
}) {
  const isRejected = verdict ? verdict.decision !== 'approved' : status === 'rejected';
  const isResolved = verdict !== null;
  const confidence = verdict ? Math.round(verdict.probability * 100) : 0;

  return (
    <section className="relative overflow-hidden rounded-[10px] bg-ivory shadow-[0_30px_80px_-20px_rgba(28,26,23,0.18)] ring-1 ring-charcoal/[0.08]">
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-[3px] ${isResolved ? (isRejected ? 'bg-red-600' : 'bg-gold') : 'bg-sand'}`}
      />

      <header className="flex flex-wrap items-start justify-between gap-5 px-6 pb-6 pt-8 sm:px-8 sm:pt-10">
        <div>
          <span className="eyebrow">Verification result</span>
          <h2 className="mt-3 text-[30px] font-extralight leading-[1.05] tracking-tightest text-charcoal sm:text-[38px]">
            Proof of payment
          </h2>
          <p className="mt-3 font-mono text-[11px] font-light tracking-[0.06em] text-charcoal/40">
            {orderNumber}
          </p>
        </div>

        {isResolved ? (
          <DecisionBadge rejected={isRejected} />
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-sand/70 px-4 py-2 text-[10px] font-medium uppercase tracking-eyebrow text-charcoal/55">
            {status === 'verifying' && (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-charcoal/30 border-t-charcoal" />
            )}
            {status === 'verifying' ? 'Analysing' : 'Awaiting proof'}
          </span>
        )}
      </header>

      {isResolved && verdict ? (
        <>
          <div className="border-t border-charcoal/[0.08] px-6 py-7 sm:px-8">
            <ConfidenceMeter value={confidence} tone={isRejected ? 'red' : 'gold'} />
          </div>

          <div className="border-t border-charcoal/[0.08] px-6 py-7 sm:px-8">
            <span className="eyebrow">Match criteria</span>
            <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {verdict.reasons.map((reason, index) => {
                const meta = reasonMeta(reason);
                return (
                  <motion.li
                    key={reason}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.06 * index, ease: EASE }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className={`flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full ${
                        meta.ok ? 'bg-gold/15 text-gold' : 'bg-red-600/10 text-red-600'
                      }`}
                    >
                      {meta.ok ? (
                        <IconCheck className="h-[11px] w-[11px]" strokeWidth={2.6} />
                      ) : (
                        <IconX className="h-[11px] w-[11px]" strokeWidth={2.6} />
                      )}
                    </span>
                    <span className="text-[13px] font-light leading-relaxed text-charcoal/70">
                      {meta.label}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <div className="border-t border-charcoal/[0.08] bg-cream/60 px-6 py-7 sm:px-8">
            <span className="eyebrow">Extracted data</span>
            <dl className="mt-5 divide-y divide-charcoal/[0.07]">
              {[
                {
                  label: 'Detected amount',
                  value: verdict.extracted.best_amount != null ? formatPrice(verdict.extracted.best_amount) : '—',
                },
                { label: 'Expected total', value: formatPrice(expectedTotal) },
                { label: 'Payee expected', value: verdict.extracted.payee_expected },
                { label: 'Sort code expected', value: verdict.extracted.sort_code_expected },
                { label: 'Account no. expected', value: verdict.extracted.account_number_expected },
                { label: 'OCR confidence', value: `${Math.round(verdict.extracted.ocr_avg_conf * 100)}%` },
              ].map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-6 py-2.5">
                  <dt className="text-[12px] font-light text-charcoal/50">{row.label}</dt>
                  <dd className="truncate font-mono text-[12px] font-light tracking-[0.02em] text-charcoal/85">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </>
      ) : (
        <div className="border-t border-charcoal/[0.08] px-6 py-10 sm:px-8">
          <p className="text-[13px] font-light leading-relaxed text-charcoal/50">
            {status === 'verifying'
              ? 'Reading your screenshot and matching it against the order…'
              : 'Submit your screenshot above to run verification — the result will appear here.'}
          </p>
        </div>
      )}

      <footer className="flex items-center gap-3 border-t border-charcoal/[0.08] px-6 py-5 sm:px-8">
        <IconShield className="h-4 w-4 flex-none text-charcoal/35" />
        <p className="text-[11px] font-light leading-relaxed text-charcoal/45">
          Checked automatically against your order. A specialist reviews every flagged transfer.
        </p>
      </footer>
    </section>
  );
}

function DecisionBadge({ rejected }: { rejected: boolean }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: EASE }}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-eyebrow ${
        rejected ? 'bg-red-600/10 text-red-600 ring-1 ring-red-600/25' : 'bg-gold/12 text-gold ring-1 ring-gold/30'
      }`}
    >
      {rejected ? <IconX className="h-3 w-3" strokeWidth={2.6} /> : <IconCheck className="h-3 w-3" strokeWidth={2.6} />}
      {rejected ? 'Rejected' : 'Approved'}
    </motion.span>
  );
}

function ConfidenceMeter({ value, tone }: { value: number; tone: 'gold' | 'red' }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${Math.round(latest)}%`);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.4, ease: EASE });
    return () => controls.stop();
  }, [count, value]);

  const barColor = tone === 'gold' ? 'bg-gold' : 'bg-red-600';

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <span className="text-[10px] font-medium uppercase tracking-eyebrow text-charcoal/45">
          OCR match confidence
        </span>
        <motion.span className="font-mono text-[22px] font-light tracking-tightest text-charcoal">
          {rounded}
        </motion.span>
      </div>
      <div
        className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-sand"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="OCR match confidence"
      >
        <motion.div
          className={`h-full ${barColor}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: value / 100 }}
          transition={{ duration: 1.4, ease: EASE }}
          style={{ originX: 0 }}
        />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Reason-code → human-readable label mapping
// ──────────────────────────────────────────────────────────────────────────────

const REASON_META: Record<string, { label: string; ok: boolean }> = {
  amount_match: { label: 'Amount matches order total', ok: true },
  amount_mismatch: { label: 'Amount does not match order total', ok: false },
  payee_match: { label: 'Payee name matches', ok: true },
  payee_missing_or_mismatch: { label: 'Payee name missing or mismatched', ok: false },
  sort_code_match: { label: 'Sort code matches', ok: true },
  sort_code_not_found: { label: 'Sort code not found in screenshot', ok: false },
  account_number_match: { label: 'Account number matches', ok: true },
  account_number_not_found: { label: 'Account number not found in screenshot', ok: false },
  status_success_keyword: { label: 'Success confirmation detected', ok: true },
  ocr_confidence_ok: { label: 'OCR confidence is sufficient', ok: true },
  ocr_confidence_low: { label: 'OCR confidence is low', ok: false },
  bank_signals_missing: { label: 'Bank details missing from screenshot', ok: false },
};

function reasonMeta(code: string): { label: string; ok: boolean } {
  if (REASON_META[code]) return REASON_META[code];
  const failing = /mismatch|missing|not_found|low/.test(code);
  return { label: code.replace(/_/g, ' '), ok: !failing };
}

// ──────────────────────────────────────────────────────────────────────────────
// Inline icons (kept dependency-free, matching the rest of the codebase)
// ──────────────────────────────────────────────────────────────────────────────

function IconBase({
  children,
  className = 'h-4 w-4',
  strokeWidth = 1.6,
}: {
  children: React.ReactNode;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function IconCheck(props: { className?: string; strokeWidth?: number }) {
  return (
    <IconBase {...props}>
      <path d="m5 13 4 4L19 7" />
    </IconBase>
  );
}

function IconX(props: { className?: string; strokeWidth?: number }) {
  return (
    <IconBase {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </IconBase>
  );
}

function IconCopy(props: { className?: string }) {
  return (
    <IconBase {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </IconBase>
  );
}

function IconBank(props: { className?: string }) {
  return (
    <IconBase {...props}>
      <path d="M3 10l9-6 9 6" />
      <path d="M5 10v9M10 10v9M14 10v9M19 10v9" />
      <path d="M3 19h18" />
    </IconBase>
  );
}

function IconTag(props: { className?: string }) {
  return (
    <IconBase {...props}>
      <path d="M20.59 13.41 12 22l-9-9 8.59-8.59A2 2 0 0 1 13 4h6a1 1 0 0 1 1 1v6a2 2 0 0 1-.41 1.41Z" />
      <circle cx="15.5" cy="8.5" r="1" />
    </IconBase>
  );
}

function IconUpload(props: { className?: string }) {
  return (
    <IconBase {...props}>
      <path d="M12 16V4m0 0 4 4m-4-4-4 4" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </IconBase>
  );
}

function IconFile(props: { className?: string }) {
  return (
    <IconBase {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
    </IconBase>
  );
}

function IconShield(props: { className?: string }) {
  return (
    <IconBase {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </IconBase>
  );
}
