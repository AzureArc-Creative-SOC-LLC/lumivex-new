'use client';

import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
  ariaLabel?: string;
};

export default function MagneticButton({
  children,
  className = '',
  onClick,
  as = 'button',
  href,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, { x: x * 0.25, y: y * 0.35, duration: 0.5, ease: 'power3.out' });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
  };

  const common = {
    ref,
    className: `group relative inline-flex items-center justify-center overflow-hidden rounded-full px-9 py-4 text-sm font-medium transition-colors duration-500 ${className}`,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onClick,
    'aria-label': ariaLabel,
  };

  const inner = (
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  );

  if (as === 'a') {
    return (
      <a href={href} {...common}>
        {inner}
      </a>
    );
  }
  return <button {...common}>{inner}</button>;
}
