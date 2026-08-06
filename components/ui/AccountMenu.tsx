'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';

/**
 * Replaces the plain "Sign in" text link with a user icon. Clicking it
 * always opens a small dropdown — signed out that's just a "Sign in" link,
 * signed in it's "My orders" (order history list), "Track" (single-order
 * status timeline), and sign-out. Mirrors CartButton's icon-button
 * shape/sizing so the two sit consistently in the header.
 */
export default function AccountMenu({ dark = false }: { dark?: boolean }) {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const iconClasses = `relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-500 ${
    dark ? 'text-charcoal/80 hover:text-charcoal' : 'text-ivory/85 hover:text-ivory'
  }`;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          // Don't open until we know whether a stored token is actually
          // valid — otherwise the menu briefly shows "Sign in" and then
          // flips to the signed-in items once /auth/verify resolves.
          if (loading) return;
          setOpen((v) => !v);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        aria-busy={loading}
        className={`${iconClasses} ${loading ? 'cursor-wait opacity-60' : ''}`}
      >
        <UserIcon />
      </button>

      <AnimatePresence>
        {open && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-[8px] bg-ivory p-1.5 text-charcoal shadow-[0_20px_60px_-15px_rgba(28,26,23,0.3)] ring-1 ring-charcoal/[0.08]"
          >
            {user ? (
              <>
                <p className="truncate px-3 pb-2 pt-2 text-[11px] font-light text-charcoal/45">
                  {user.email}
                </p>
                <div className="border-t border-charcoal/[0.08] pt-1">
                  <MenuLink href="/account/orders" onNavigate={() => setOpen(false)}>
                    My orders
                  </MenuLink>
                  <MenuLink href="/account/track" onNavigate={() => setOpen(false)}>
                    Track
                  </MenuLink>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="block w-full rounded-[5px] px-3 py-2.5 text-left text-[13px] font-medium text-charcoal/70 transition-colors duration-200 hover:bg-cream hover:text-charcoal"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <MenuLink href="/login" onNavigate={() => setOpen(false)}>
                Sign in
              </MenuLink>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({
  href,
  onNavigate,
  children,
}: {
  href: string;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onNavigate}
      className="block rounded-[5px] px-3 py-2.5 text-[13px] font-medium text-charcoal/70 transition-colors duration-200 hover:bg-cream hover:text-charcoal"
    >
      {children}
    </Link>
  );
}

function UserIcon() {
  return (
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
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
    </svg>
  );
}
