'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS, type Product } from '@/lib/data';
import { useCart } from '@/components/providers/CartProvider';
import CurtainImage from '@/components/animations/CurtainImage';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

const SORT_LABELS: Record<SortKey, string> = {
  featured: 'Featured',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  name: 'Name: A–Z',
};

export default function ShopGrid() {
  const [sort, setSort] = useState<SortKey>('featured');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      const matchesQuery =
        query.trim().length === 0 ||
        p.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        p.category.toLowerCase().includes(query.trim().toLowerCase());
      return matchesQuery;
    });

    list = [...list];
    if (sort === 'price-asc') list.sort((a, b) => a.priceValue - b.priceValue);
    if (sort === 'price-desc') list.sort((a, b) => b.priceValue - a.priceValue);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [sort, query]);

  return (
    <div>
      {/* Controls */}
      <div className="mb-10 flex flex-col gap-6 md:mb-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/35"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search the catalogue…"
              className="w-full rounded-full border border-charcoal/12 bg-ivory py-3 pl-11 pr-5 text-[13px] text-charcoal placeholder:text-charcoal/35 outline-none transition-colors focus:border-charcoal/30"
            />
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-[11px] uppercase tracking-wider text-charcoal/40">
              Sort
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-charcoal/12 bg-ivory px-4 py-2.5 text-[13px] text-charcoal outline-none transition-colors focus:border-charcoal/30"
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <option key={key} value={key}>
                  {SORT_LABELS[key]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-[13px] font-light text-charcoal/45">
          {filtered.length} {filtered.length === 1 ? 'compound' : 'compounds'}
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-[4px] border border-charcoal/10 bg-cream/50 px-8 py-20 text-center">
          <p className="text-lg font-light text-charcoal/60">
            No compounds match your search.
          </p>
          <button
            onClick={() => setQuery('')}
            className="link-underline mt-4 text-[13px] font-medium text-charcoal"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <ShopCard key={product.id} product={product} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function ShopCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.6,
        delay: (index % 6) * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col overflow-hidden rounded-[4px] bg-cream transition-shadow duration-700 hover:shadow-[0_40px_80px_-30px_rgba(28,26,23,0.25)]"
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[3/2] overflow-hidden bg-[#eef1f4]"
        aria-label={`View ${product.name}`}
      >
        <CurtainImage
          src={product.image}
          alt={product.name}
          className="absolute inset-0 h-full w-full"
          imgClassName="transition-transform duration-[1.2s] ease-lux group-hover:scale-[1.05]"
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          curtain={false}
          rounded={false}
          oversize={0}
          baseScale={1.06}
          direction={index % 2 === 0 ? 'up' : 'down'}
          intensity={2}
          quality={75}
        />
        <div className="absolute inset-0 z-[5] bg-gradient-to-t from-charcoal/25 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3.5 py-1.5 text-[10px] uppercase tracking-wider text-charcoal backdrop-blur-sm">
          {product.tag}
        </span>
        {product.purity && (
          <span className="absolute right-4 top-4 rounded-full bg-charcoal/80 px-3.5 py-1.5 text-[10px] uppercase tracking-wider text-ivory backdrop-blur-sm">
            {product.purity} purity
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-charcoal/40">
            {product.category}
          </span>
          <h3 className="mt-1.5 text-xl font-light leading-snug tracking-tight text-charcoal">
            <Link href={`/product/${product.slug}`} className="transition-colors hover:text-gold">
              {product.name}
            </Link>
          </h3>
        </div>

        <p className="line-clamp-2 text-[13px] font-light leading-relaxed text-charcoal/55">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span>
            <span className="block text-xl font-light text-charcoal">{product.price}</span>
            <span className="block text-[10px] uppercase tracking-wider text-charcoal/40">USD</span>
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="shrink-0 rounded-full border border-charcoal/15 px-4 py-2.5 text-center text-[12px] font-medium text-charcoal transition-colors duration-500 hover:border-charcoal/40"
            >
              View
            </Link>
            <button
              onClick={() => addItem(product)}
              className="shrink-0 rounded-full bg-charcoal px-4 py-2.5 text-[12px] font-medium text-ivory transition-colors duration-500 hover:bg-gold"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
