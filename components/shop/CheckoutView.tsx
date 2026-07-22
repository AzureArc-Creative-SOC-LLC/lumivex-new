'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart, formatPrice } from '@/components/providers/CartProvider';
import { CHECKOUT_ACKNOWLEDGEMENT } from '@/lib/data';
import { orders, promos, ApiError } from '@/lib/api';

type Status = 'idle' | 'processing' | 'done';


export default function CheckoutView() {
  const { items, subtotal, count, clear } = useCart();
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  // Research-use attestation — blocks submission until acknowledged.
  const [attested, setAttested] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  // Snapshot of the total at time of order, so the success popup keeps
  // showing the right amount after we clear the cart.
  const [orderTotal, setOrderTotal] = useState(0);
  const [submitError, setSubmitError] = useState('');

  // Promo code — now resolved against the microservice.
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    percent: number;
  } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoValidating, setPromoValidating] = useState(false);

  const discount = appliedPromo
    ? Math.round(subtotal * (appliedPromo.percent / 100))
    : 0;
  const total = Math.max(0, subtotal - discount);

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code || promoValidating) return;
    setPromoValidating(true);
    setPromoError('');
    try {
      const res = await promos.validate(code);
      setAppliedPromo({ code, percent: res.percent });
    } catch (err) {
      setAppliedPromo(null);
      const msg =
        err instanceof ApiError && err.status === 404
          ? "That code isn’t valid."
          : err instanceof Error
            ? err.message
            : 'Could not validate code.';
      setPromoError(msg);
    } finally {
      setPromoValidating(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (count === 0 || status === 'processing') return;

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') ?? '').trim();
    if (!email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!attested) {
      setSubmitError(
        'Please confirm the research-use acknowledgement before placing your order.'
      );
      return;
    }

    setStatus('processing');
    setSubmitError('');

    try {
      const res = await orders.create({
        email,
        firstName: String(fd.get('firstName') ?? '').trim(),
        lastName: String(fd.get('lastName') ?? '').trim(),
        phone: String(fd.get('mobile') ?? '').trim(),
        address: [fd.get('line1'), fd.get('line2')]
          .filter(Boolean)
          .join(', '),
        city: String(fd.get('city') ?? '').trim(),
        postcode: String(fd.get('postcode') ?? '').trim(),
        country: String(fd.get('country') ?? '').trim(),
        subtotal,
        total,
        discountAmount: discount,
        promoCode: appliedPromo?.code ?? null,
        promoDiscount: appliedPromo?.percent,
        itemsArray: items.map((i) => ({
          name: i.name,
          quantity: i.qty,
          unitPrice: i.price,
          productId: i.id,
          sku: i.slug || i.id,
        })),
        payment_method: 'manual',
      });
      // Fire the shared-email order confirmation using the order the backend
      // actually persisted — not the raw form fields — so the email always
      // reflects what was saved. Best-effort: never blocks the checkout flow.
      void (async () => {
        try {
          const { order, items: orderItems } = await orders.byNumber(res.orderNumber);
          const o = order as Record<string, unknown>;
          await fetch('/api/send-order-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customer: {
                name: String(o.customer_name ?? ''),
                email: String(o.customer_email ?? email),
              },
              order: {
                orderNumber: String(o.order_number ?? res.orderNumber),
                currency: String(o.currency ?? 'GBP'),
                items: orderItems.map((it) => {
                  const row = it as Record<string, unknown>;
                  return {
                    name: String(row.name ?? ''),
                    quantity: Number(row.quantity ?? 1),
                    price: Number(row.unit_price ?? 0),
                  };
                }),
                subtotal: Number(o.subtotal ?? subtotal),
                shipping: 0,
                tax: 0,
                discount: Number(o.discount_amount ?? discount),
                total: Number(o.total ?? total),
                shippingAddress: [
                  o.shipping_address,
                  o.shipping_city,
                  o.shipping_zip ?? o.shipping_postcode,
                  o.shipping_country,
                ]
                  .filter(Boolean)
                  .join(', '),
              },
            }),
          });
        } catch (err) {
          console.error('[checkout] order confirmation email failed:', err);
        }
      })();

      setOrderRef(res.orderNumber);
      setOrderTotal(total);
      setStatus('done');
      clear();
    } catch (err) {
      setStatus('idle');
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Something went wrong placing your order. Please try again.'
      );
    }
  };

  if (count === 0 && status !== 'done') {
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
    <>
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

          <Fieldset title="Billing address">
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
                    {appliedPromo.code} applied · {appliedPromo.percent}% off
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
                      disabled={promoValidating}
                      className="shrink-0 rounded-[4px] border border-charcoal/20 px-5 text-[13px] font-medium text-charcoal transition-colors hover:border-charcoal/50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {promoValidating ? 'Checking…' : 'Apply'}
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
              {discount > 0 && (
                <div className="flex justify-between text-sm font-light text-gold">
                  <span>Discount ({appliedPromo?.code})</span>
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

            {/* Research-use compliance notice + blocking attestation */}
            <div className="mt-7 rounded-[4px] border-l-2 border-gold bg-ivory px-4 py-4">
              <p className="text-[11.5px] font-light leading-relaxed text-charcoal/60">
                {CHECKOUT_ACKNOWLEDGEMENT}
              </p>
              <label className="mt-3 flex items-start gap-2.5 text-[12px] font-light leading-relaxed text-charcoal/70">
                <input
                  type="checkbox"
                  checked={attested}
                  onChange={(e) => setAttested(e.target.checked)}
                  className="mt-0.5 shrink-0 accent-gold"
                />
                <span>
                  I confirm I am 18 or older, am acquiring these materials for
                  laboratory research purposes only, will not administer them to
                  humans or animals, and accept sole responsibility for lawful
                  handling, storage and disposal.
                </span>
              </label>
            </div>

            {submitError && (
              <p className="mt-5 rounded-[4px] border border-red-600/20 bg-red-600/5 px-4 py-3 text-[13px] font-light text-red-600/90">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              data-touch-target
              disabled={status === 'processing' || !attested}
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
              Payment by bank transfer. We’ll email you secure payment
              instructions and a capture link for your screenshot.
            </p>
          </div>
        </div>
      </form>
      </div>

      {/* Order-placed popup */}
      <AnimatePresence>
        {status === 'done' && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-placed-title"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-charcoal/45 backdrop-blur-sm" />

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md overflow-hidden rounded-[14px] bg-ivory p-8 text-center shadow-[0_40px_120px_-30px_rgba(28,26,23,0.6)] md:p-10"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </motion.div>

              <h2
                id="order-placed-title"
                className="mt-6 text-3xl font-extralight tracking-tightest text-charcoal"
              >
                Order placed
              </h2>
              <p className="mt-3 text-sm font-light leading-relaxed text-charcoal/60">
                Thank you. Check your inbox  we’ve sent payment instructions
                and a secure capture link for you to upload your bank-transfer
                screenshot.
              </p>

              <div className="mt-6 flex items-center justify-between gap-4 rounded-[8px] bg-cream px-5 py-4 text-left">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-charcoal/40">
                    Order reference
                  </p>
                  <p className="mt-0.5 font-medium tracking-wide text-charcoal">
                    {orderRef}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-charcoal/40">
                    Total
                  </p>
                  <p className="mt-0.5 text-lg font-light text-charcoal">
                    {formatPrice(orderTotal)}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#products"
                  className="flex-1 rounded-full bg-charcoal px-6 py-3.5 text-sm font-medium text-ivory transition-colors duration-500 hover:bg-gold"
                >
                  Continue shopping
                </Link>
                <Link
                  href="/"
                  className="flex-1 rounded-full border border-charcoal/15 px-6 py-3.5 text-sm font-medium text-charcoal transition-colors duration-500 hover:border-charcoal/40"
                >
                  Back to home
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
