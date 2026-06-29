import type Lenis from 'lenis';

export function scrollToSection(target: string) {
  if (typeof window === 'undefined') return;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  const el = document.querySelector(target);
  if (!el) return;

  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -20, duration: 1.4 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: 'smooth' });
  }
}
