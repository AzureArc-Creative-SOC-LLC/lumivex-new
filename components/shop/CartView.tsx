'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, formatPrice } from '@/components/providers/CartProvider';
import { CHECKOUT_ACKNOWLEDGEMENT } from '@/lib/data';

export default function CartView() {
  const { items, subtotal, count, updateQty, removeItem, clear } = useCart();

  if (count === 0) {
    return (
      <div className="container-wide flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <svg
          viewBox="0 0 24 24"
          className="h-14 w-14 text-charcoal/20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 8h14l-1 12H6L5 8Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
        <h1 className="mt-8 text-section font-extralight tracking-tightest text-charcoal">
          Your cart is empty
        </h1>
        <p className="mt-4 max-w-sm text-base font-light text-charcoal/55">
          Explore our catalogue of high-purity research compounds, each supplied
          with full documentation.
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
      <div className="mb-10 flex items-end justify-between">
        <div>
          <span className="eyebrow">Your selection</span>
          <h1 className="mt-4 text-display font-extralight tracking-tightest text-charcoal">
            Cart
          </h1>
        </div>
        <button
          onClick={clear}
          className="link-underline text-[13px] font-medium text-charcoal/50 hover:text-charcoal"
        >
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Items */}
        <div className="lg:col-span-7">
          <div className="border-t border-charcoal/10">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-5 border-b border-charcoal/10 py-6"
                >
                  <Link
                    href={`/product/${item.slug}`}
                    className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[4px] bg-[#eef1f4]"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-charcoal/40">
                          {item.category}
                        </span>
                        <h3 className="mt-1 text-lg font-light text-charcoal">
                          <Link
                            href={`/product/${item.slug}`}
                            className="transition-colors hover:text-gold"
                          >
                            {item.name}
                          </Link>
                        </h3>
                      </div>
                      <span className="text-lg font-light text-charcoal">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center rounded-full border border-charcoal/15">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="flex h-9 w-9 items-center justify-center text-lg text-charcoal/70 transition-colors hover:text-charcoal"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-light text-charcoal">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="flex h-9 w-9 items-center justify-center text-lg text-charcoal/70 transition-colors hover:text-charcoal"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="link-underline text-[12px] font-medium text-charcoal/45 hover:text-charcoal"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Link
            href="/#products"
            className="link-underline mt-8 inline-block text-[13px] font-medium text-charcoal/70 hover:text-charcoal"
          >
            ← Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <div className="rounded-[6px] bg-cream p-8 lg:sticky lg:top-24 md:p-10">
            <h2 className="text-[11px] uppercase tracking-eyebrow text-charcoal/40">
              Order Summary
            </h2>

            <div className="mt-7 space-y-4">
              <Row label={`Subtotal (${count} item${count === 1 ? '' : 's'})`}>
                {formatPrice(subtotal)}
              </Row>
              <div className="border-t border-charcoal/10 pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-medium text-charcoal">
                    Total
                  </span>
                  <span className="text-2xl font-light text-charcoal">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="mt-1 text-right text-[11px] uppercase tracking-wider text-charcoal/40">
                  USD · tax included
                </p>
              </div>
            </div>

            <p className="mt-6 rounded-[4px] border-l-2 border-gold bg-ivory px-4 py-3 text-[11.5px] font-light leading-relaxed text-charcoal/60">
              {CHECKOUT_ACKNOWLEDGEMENT}
            </p>

            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-full bg-charcoal py-4 text-center text-sm font-medium text-ivory transition-colors duration-500 hover:bg-gold"
            >
              Proceed to checkout
            </Link>

            <p className="mt-5 flex items-center justify-center gap-2 text-[12px] font-light text-charcoal/45">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-gold"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="5" y="11" width="14" height="9" rx="1.5" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              Secure, encrypted checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm font-light text-charcoal/55">{label}</span>
      <span className="text-sm font-medium text-charcoal">{children}</span>
    </div>
  );
}
