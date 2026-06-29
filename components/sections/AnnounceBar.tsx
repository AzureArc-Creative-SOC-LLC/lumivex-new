'use client';

import { ANNOUNCEMENTS } from '@/lib/data';

export default function AnnounceBar() {
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div className="safe-pt fixed inset-x-0 top-0 z-[60] overflow-hidden border-b border-ivory/10 bg-charcoal text-ivory">
      <div className="flex h-[34px] items-center">
        <div className="flex shrink-0 animate-[marquee_38s_linear_infinite] items-center whitespace-nowrap will-change-transform">
          {items.map((text, i) => (
            <span
              key={i}
              className="mx-8 text-[10.5px] uppercase tracking-[0.18em] text-ivory/70"
            >
              <span className="mr-8 text-gold">✦</span>
              {text}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
