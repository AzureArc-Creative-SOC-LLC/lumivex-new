'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NAV_LINKS } from '@/lib/data';
import { scrollToSection } from '@/lib/lenis';
import Magnetic from '@/components/ui/Magnetic';
import Logo from '@/components/ui/Logo';
import CartButton from '@/components/cart/CartButton';
import { useAuth } from '@/components/providers/AuthProvider';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#home');
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.filter((l) => l.href.startsWith('#'))
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const go = (href: string) => {
    setMenuOpen(false);
    scrollToSection(href);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-[calc(34px+env(safe-area-inset-top))] z-50 transition-all duration-700 ease-lux ${
          scrolled
            ? 'border-b border-charcoal/5 bg-ivory/70 backdrop-blur-glass py-3.5 md:py-4'
            : 'border-b border-transparent py-5 md:py-7'
        }`}
      >
        <nav className="container-wide flex items-center justify-between">
          <button
            onClick={() => go('#home')}
            className={`transition-colors duration-500 ${
              scrolled ? 'text-charcoal' : 'text-ivory'
            }`}
            aria-label="Lumivex home"
          >
            <Logo />
          </button>

          <ul className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                {link.href.startsWith('#') ? (
                  <button
                    onClick={() => go(link.href)}
                    className={`link-underline text-[13px] font-medium tracking-wide transition-colors duration-500 ${
                      active === link.href ? 'is-active' : ''
                    } ${scrolled ? 'text-charcoal/80 hover:text-charcoal' : 'text-ivory/80 hover:text-ivory'}`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`link-underline text-[13px] font-medium tracking-wide transition-colors duration-500 ${
                      scrolled ? 'text-charcoal/80 hover:text-charcoal' : 'text-ivory/80 hover:text-ivory'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href={user ? '/account/wallet' : '/login'}
              className={`link-underline text-[13px] font-medium tracking-wide transition-colors duration-500 ${
                scrolled ? 'text-charcoal/80 hover:text-charcoal' : 'text-ivory/80 hover:text-ivory'
              }`}
            >
              {user ? 'Account' : 'Sign in'}
            </Link>
            <CartButton dark={scrolled} />
            <Magnetic strength={0.4} className="inline-block">
              <Link
                href="/shop"
                className={`inline-block rounded-full px-6 py-2.5 text-[13px] font-medium transition-all duration-500 ${
                  scrolled
                    ? 'bg-charcoal text-ivory hover:bg-gold'
                    : 'border border-ivory/40 text-ivory hover:bg-ivory hover:text-charcoal'
                }`}
              >
                Shop Now
              </Link>
            </Magnetic>
          </div>

          {/* Mobile: cart + toggle */}
          <div className="flex items-center gap-1 lg:hidden">
            <CartButton dark={scrolled || menuOpen} />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
              aria-label="Toggle menu"
            >
            <span
              className={`h-[1.5px] w-6 transition-all duration-300 ${
                menuOpen ? 'translate-y-[6.5px] rotate-45 bg-charcoal' : scrolled ? 'bg-charcoal' : 'bg-ivory'
              }`}
            />
            <span
              className={`h-[1.5px] w-6 transition-all duration-300 ${
                menuOpen ? 'opacity-0' : scrolled ? 'bg-charcoal' : 'bg-ivory'
              }`}
            />
            <span
              className={`h-[1.5px] w-6 transition-all duration-300 ${
                menuOpen ? '-translate-y-[6.5px] -rotate-45 bg-charcoal' : scrolled ? 'bg-charcoal' : 'bg-ivory'
              }`}
            />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={`safe-pt safe-pb safe-px fixed inset-0 z-40 flex flex-col justify-center bg-ivory/95 px-8 backdrop-blur-glass transition-all duration-700 ease-lux lg:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href}>
              {link.href.startsWith('#') ? (
                <button
                  data-touch-target
                  onClick={() => go(link.href)}
                  className="block w-full py-2 text-left text-[clamp(2rem,11vw,2.75rem)] font-light tracking-tightest text-charcoal transition-colors hover:text-gold"
                  style={{
                    transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
                    transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                    opacity: menuOpen ? 1 : 0,
                    transitionProperty: 'transform, opacity, color',
                    transitionDuration: '600ms',
                  }}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  data-touch-target
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block w-full py-2 text-left text-[clamp(2rem,11vw,2.75rem)] font-light tracking-tightest text-charcoal transition-colors hover:text-gold"
                  style={{
                    transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
                    transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                    opacity: menuOpen ? 1 : 0,
                    transitionProperty: 'transform, opacity, color',
                    transitionDuration: '600ms',
                  }}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div
          className="mt-10 flex flex-wrap items-center gap-3"
          style={{
            transitionDelay: menuOpen ? `${NAV_LINKS.length * 60}ms` : '0ms',
            transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            opacity: menuOpen ? 1 : 0,
            transitionProperty: 'transform, opacity',
            transitionDuration: '600ms',
          }}
        >
          <Link
            data-touch-target
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="rounded-full bg-charcoal px-8 py-4 text-sm font-medium text-ivory transition-colors hover:bg-gold"
          >
            Shop Now
          </Link>
          <Link
            data-touch-target
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center rounded-full border border-charcoal/15 px-8 py-4 text-sm font-medium text-charcoal transition-colors hover:border-charcoal/40"
          >
            View Cart
          </Link>
        </div>
      </div>
    </>
  );
}
