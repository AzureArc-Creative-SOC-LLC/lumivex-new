/**
 * Lumivex logo — a minimalist molecular hexagon mark (gold) paired with a
 * refined wordmark. The wordmark inherits `currentColor` so it adapts to dark
 * or light backgrounds; the mark stays gold as a fixed brand accent.
 */
export default function Logo({
  className = '',
  showMark = true,
}: {
  className?: string;
  showMark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {showMark && (
        <svg
          viewBox="0 0 32 32"
          className="h-[22px] w-[22px] shrink-0"
          fill="none"
          aria-hidden
        >
          {/* hexagon */}
          <path
            d="M29 16 22.5 27.26 9.5 27.26 3 16 9.5 4.74 22.5 4.74Z"
            stroke="#B8965A"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          {/* molecular bonds */}
          <path
            d="M16 16 29 16M16 16 9.5 4.74M16 16 9.5 27.26"
            stroke="#B8965A"
            strokeWidth="1.1"
            strokeOpacity="0.7"
          />
          {/* nodes */}
          <circle cx="16" cy="16" r="2.4" fill="#B8965A" />
          <circle cx="29" cy="16" r="1.5" fill="#B8965A" />
          <circle cx="9.5" cy="4.74" r="1.5" fill="#B8965A" />
          <circle cx="9.5" cy="27.26" r="1.5" fill="#B8965A" />
        </svg>
      )}
      <span className="text-[19px] font-medium leading-none tracking-[0.16em]">
        LUMIVEX
      </span>
    </span>
  );
}
