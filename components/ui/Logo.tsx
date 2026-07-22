/**
 * Lumivex logo — a brilliant-cut diamond profile in gold, showing table,
 * crown facets, girdle, and pavilion. Reads as luxury / high-cosmetic. The
 * wordmark inherits `currentColor` so it adapts to dark or light backgrounds;
 * the mark stays gold as a fixed brand accent.
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
          {/* pavilion axis — subtle center line */}
          <path
            d="M16 12 L16 27"
            stroke="#B8965A"
            strokeWidth="0.85"
            strokeOpacity="0.35"
          />
          {/* outer silhouette: table, crown, girdle, pavilion, culet */}
          <path
            d="M12 6 L20 6 L27 12 L16 27 L5 12 Z"
            stroke="#B8965A"
            strokeWidth="1.5"
            strokeLinejoin="miter"
          />
          {/* girdle */}
          <path
            d="M5 12 L27 12"
            stroke="#B8965A"
            strokeWidth="1.2"
          />
          {/* crown facets */}
          <path
            d="M12 6 L16 12 L20 6"
            stroke="#B8965A"
            strokeWidth="1.2"
            strokeLinejoin="miter"
          />
        </svg>
      )}
      <span className="text-[19px] font-normal leading-none tracking-[0.22em]">
        LUMIVEX
      </span>
    </span>
  );
}
