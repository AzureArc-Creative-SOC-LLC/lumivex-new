'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * Supplementary shots used when a product doesn't define its own gallery.
 * Swap these for real product angles/packaging photos when available.
 */
const CONTEXT_SHOTS = [
  '/images/inhouse-image1-seo.webp',
  '/images/inhouse-image2-seo.webp',
  '/images/whyus1-seo.webp',
];

export default function ProductGallery({
  image,
  alt,
  gallery,
}: {
  image: string;
  alt: string;
  gallery?: string[];
}) {
  const images =
    gallery && gallery.length > 0 ? gallery : [image, ...CONTEXT_SHOTS];
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Main image — transparent, blends with the page */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[8px]">
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          quality={90}
          className="animate-[fadeIn_0.4s_ease] object-contain p-8"
        />
      </div>

      {/* Thumbnails — centered row, active one ringed in gold */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={`relative aspect-square w-[68px] shrink-0 overflow-hidden rounded-[6px] bg-ivory transition-all duration-300 ${
              active === i
                ? 'ring-2 ring-gold ring-offset-2 ring-offset-ivory'
                : 'border border-charcoal/10 opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={src}
              alt={`${alt} thumbnail ${i + 1}`}
              fill
              sizes="68px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
