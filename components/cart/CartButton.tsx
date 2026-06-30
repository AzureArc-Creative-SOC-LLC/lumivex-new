'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/providers/CartProvider';

/**
 * Cart icon with a live item-count badge. Clicking it navigates to /cart —
 * the badge briefly pops when an item is added so the action is acknowledged.
 */
export default function CartButton({ dark = false }: { dark?: boolean }) {
  const { count, lastAdded } = useCart();
  const [pop, setPop] = useState(false);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setPop(true);
    const t = setTimeout(() => setPop(false), 450);
    return () => clearTimeout(t);
  }, [lastAdded]);

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-500 ${
        dark
          ? 'text-charcoal/80 hover:text-charcoal'
          : 'text-ivory/85 hover:text-ivory'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[21px] w-[21px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      {count > 0 && (
        <span
          className={`absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold leading-none text-ivory transition-transform duration-300 ${
            pop ? 'scale-125' : 'scale-100'
          }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
