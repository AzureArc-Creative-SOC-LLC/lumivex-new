'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart, formatPrice } from '@/components/providers/CartProvider';

type Status = 'idle' | 'processing' | 'done';

const SHIPPING = 12; // Flat cold-chain dispatch fee (GBP).

// Promo codes → fractional discount applied to the subtotal.
const PROMOS: Record<string, number> = {
  VORA10: 0.1,
};

export default function CheckoutView() {
  const { items, subtotal, count, clear } = useCart();
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [orderRef, setOrderRef] = useState('');

  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  const discount = appliedPromo
    ? Math.round(subtotal * PROMOS[appliedPromo])
    : 0;
  const total = Math.max(0, subtotal + (count > 0 ? SHIPPING : 0) - discount);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (PROMOS[code] != null) {
      setAppliedPromo(code);
      setPromoError('');
    } else {
      setAppliedPromo(null);
      setPromoError('That code isn’t valid.');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (count === 0 || status === 'processing') return;
    setStatus('processing');

    // Placeholder order flow — simulates a payment/order API call.
    // Replace with a real checkout integration (Stripe, etc.) when available.
    setTimeout(() => {
      const ref =
        'LMX-' +
        Array.from({ length: 6 }, (_, i) =>
          '0123456789ABCDEFGHJKMNPQRSTUVWXYZ'.charAt(
            (total + count + i * 7 + items.length * 13) % 33
          )
        ).join('');
      setOrderRef(ref);
      setStatus('done');
      clear();
    }, 1600);
  };

  // Order confirmation (placeholder success state).
  if (status === 'done') {
    return (
      <div className="container-wide flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/15 text-gold"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-9 w-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
        </motion.div>
        <h1 className="mt-8 text-display font-extralight tracking-tightest text-charcoal">
          Order received
        </h1>
        <p className="mt-5 max-w-md text-base font-light leading-relaxed text-charcoal/60">
          Thank you. This is a placeholder confirmation — no payment has been
          taken. Your reference is{' '}
          <span className="font-medium text-charcoal">{orderRef}</span>. A member
          of the Lumivex team would normally follow up with documentation and
          cold-chain dispatch details.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/#products"
            className="rounded-full bg-charcoal px-8 py-4 text-sm font-medium text-ivory transition-colors duration-500 hover:bg-gold"
          >
            Continue shopping
          </Link>
          <Link
            href="/"
            className="rounded-full border border-charcoal/15 px-8 py-4 text-sm font-medium text-charcoal transition-colors duration-500 hover:border-charcoal/40"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="container-wide flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <h1 className="text-section font-extralight tracking-tightest text-charcoal">
          Nothing to check out
        </h1>
        <p className="mt-4 max-w-sm text-base font-light text-charcoal/55">
          Your cart is empty. Add a research compound to continue.
        </p>
        <Link
          href="/#products"
          className="mt-9 rounded-full bg-charcoal px-8 py-4 text-sm font-medium text-ivory transition-colors duration-500 hover:bg-gold"
        >
          Browse the catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="container-wide py-10 md:py-16">
      <div className="mb-10">
        <button
          onClick={() => router.push('/cart')}
          className="link-underline mb-6 text-[13px] font-medium text-charcoal/55 hover:text-charcoal"
        >
          ← Back to cart
        </button>
        <span className="eyebrow">Final step</span>
        <h1 className="mt-4 text-display font-extralight tracking-tightest text-charcoal">
          Checkout
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16"
      >
        {/* Form fields */}
        <div className="lg:col-span-7">
          <Fieldset title="Contact">
            <Field label="First name" name="firstName" placeholder="Jordan" />
            <Field label="Last name" name="lastName" placeholder="Avery" />
            <Field
              label="Email address"
              name="email"
              type="email"
              placeholder="jordan@lab.com"
              full
            />
            <Field
              label="Mobile"
              name="mobile"
              type="tel"
              placeholder="+44 7700 900123"
              full
            />
          </Fieldset>

          <Fieldset title="Shipping address">
            <Field
              label="Address line 1"
              name="line1"
              placeholder="123 Research Park"
              full
            />
            <Field
              label="Address line 2"
              name="line2"
              placeholder="Unit 4B"
              full
              optional
            />
            <Field label="City" name="city" placeholder="London" />
            <Field label="Postcode" name="postcode" placeholder="SW1A 1AA" />
            <Field
              label="Country"
              name="country"
              placeholder="United Kingdom"
              full
            />
          </Fieldset>

          <Fieldset title="Payment">
            <div className="mb-2 flex items-center gap-2 rounded-[4px] bg-cream px-4 py-3 text-[12px] font-light text-charcoal/55 sm:col-span-2">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 text-gold"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <rect x="5" y="11" width="14" height="9" rx="1.5" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              Placeholder payment — no card is charged in this demo.
            </div>
            <Field
              label="Card number"
              name="card"
              placeholder="4242 4242 4242 4242"
              full
            />
            <Field label="Expiry" name="expiry" placeholder="MM / YY" />
            <Field label="CVC" name="cvc" placeholder="123" />
          </Fieldset>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <div className="rounded-[6px] bg-cream p-8 md:p-10 lg:sticky lg:top-24">
            <h2 className="text-[11px] uppercase tracking-eyebrow text-charcoal/40">
              Order Summary
            </h2>

            <ul className="mt-6 space-y-4 border-b border-charcoal/10 pb-6">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[4px] bg-[#eef1f4]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-charcoal px-1 text-[10px] font-semibold text-ivory">
                      {item.qty}
                    </span>
                  </div>
                  <span className="flex-1 text-[13px] font-light text-charcoal/70">
                    {item.name}
                  </span>
                  <span className="text-[13px] font-medium text-charcoal">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Promo code */}
            <div className="mt-6 border-b border-charcoal/10 pb-6">
              {appliedPromo ? (
                <div className="flex items-center justify-between gap-3 rounded-[4px] border border-gold/40 bg-gold/10 px-4 py-3">
                  <span className="flex items-center gap-2 text-[13px] font-medium text-charcoal">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 text-gold"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                    {appliedPromo} applied
                  </span>
                  <button
                    type="button"
                    onClick={removePromo}
                    className="link-underline text-[12px] font-medium text-charcoal/50 hover:text-charcoal"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          applyPromo();
                        }
                      }}
                      placeholder="Promo code"
                      aria-label="Promo code"
                      className="min-w-0 flex-1 rounded-[4px] border border-charcoal/15 bg-ivory px-4 py-3 text-sm font-light uppercase tracking-wide text-charcoal outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-charcoal/30 focus:border-gold"
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="shrink-0 rounded-[4px] border border-charcoal/20 px-5 text-[13px] font-medium text-charcoal transition-colors hover:border-charcoal/50"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="mt-2 text-[12px] font-light text-red-600/80">
                      {promoError}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm font-light text-charcoal/55">
                <span>Subtotal</span>
                <span className="font-medium text-charcoal">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-light text-charcoal/55">
                <span>Shipping</span>
                <span className="font-medium text-charcoal">
                  {formatPrice(SHIPPING)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm font-light text-gold">
                  <span>Discount ({appliedPromo})</span>
                  <span className="font-medium">−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-charcoal/10 pt-4">
                <span className="text-base font-medium text-charcoal">
                  Total
                </span>
                <span className="text-2xl font-light text-charcoal">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              data-touch-target
              disabled={status === 'processing'}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-charcoal py-4 text-sm font-medium text-ivory transition-colors duration-500 hover:bg-gold disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === 'processing' ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" />
                  Processing…
                </>
              ) : (
                `Place order · ${formatPrice(total)}`
              )}
            </button>

            <p className="mt-5 text-center text-[12px] font-light text-charcoal/45">
              By placing this order you confirm the compounds are for laboratory
              research use only.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

function Fieldset({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mb-10">
      <legend className="mb-5 text-[11px] uppercase tracking-eyebrow text-charcoal/40">
        {title}
      </legend>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        {children}
      </div>
    </fieldset>
  );
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  full = false,
  optional = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  full?: boolean;
  optional?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-2 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-[12px] font-medium text-charcoal/55">
        {label}
        {optional && (
          <span className="ml-1 font-light text-charcoal/35">(optional)</span>
        )}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={!optional}
        className="rounded-[4px] border border-charcoal/15 bg-ivory px-4 py-3 text-sm font-light text-charcoal outline-none transition-colors placeholder:text-charcoal/30 focus:border-gold"
      />
    </label>
  );
}
