'use client';

import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import CartButton from '@/components/cart/CartButton';

/**
 * Compact header for the product and cart pages. Unlike the homepage
 * Navigation (which scrolls between sections), this is a simple charcoal
 * bar that links back to the store and exposes the cart.
 */
export default function ShopHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/5 bg-ivory/80 backdrop-blur-glass">
      <div className="container-wide flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-charcoal transition-opacity hover:opacity-70"
          aria-label="Lumivex home"
        >
          <Logo />
        </Link>

        <nav className="flex items-center gap-5">
          <Link
            href="/#products"
            className="link-underline hidden text-[13px] font-medium text-charcoal/80 hover:text-charcoal sm:inline-block"
          >
            Continue shopping
          </Link>
          <CartButton dark />
        </nav>
      </div>
    </header>
  );
}
