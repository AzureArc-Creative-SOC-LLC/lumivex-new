'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/data';
import { useCart } from '@/components/providers/CartProvider';
import ProductGallery from '@/components/shop/ProductGallery';

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-ivory">
      <div className="container-wide py-10 md:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[12px] font-light text-charcoal/45">
          <Link href="/" className="transition-colors hover:text-charcoal">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link
            href="/#products"
            className="transition-colors hover:text-charcoal"
          >
            Shop
          </Link>
          <span aria-hidden>/</span>
          <span className="text-charcoal/70">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-md lg:sticky lg:top-24 lg:mx-0 lg:max-w-none lg:self-start"
          >
            <ProductGallery
              image={product.image}
              alt={product.name}
              gallery={product.gallery}
            />
          </motion.div>

          {/* Right — details */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            <span className="eyebrow">{product.tag}</span>
            <h1 className="mt-5 text-display font-extralight leading-[1] tracking-tightest text-charcoal">
              {product.name}
            </h1>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl font-light text-charcoal md:text-4xl">
                {product.price}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-charcoal/40">
                GBP
              </span>
              <span className="ml-auto text-[11px] uppercase tracking-wider text-gold">
                {product.purity} purity
              </span>
            </div>

            <p className="mt-7 text-base font-light leading-relaxed text-charcoal/65">
              {product.longDescription}
            </p>

            {/* Quantity + add to cart */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center rounded-full border border-charcoal/15">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-12 w-12 items-center justify-center text-xl text-charcoal/70 transition-colors hover:text-charcoal"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-10 text-center text-base font-light text-charcoal">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-12 w-12 items-center justify-center text-xl text-charcoal/70 transition-colors hover:text-charcoal"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`w-fit rounded-full px-6 py-2.5 text-[13px] font-medium transition-all duration-500 ${
                  added
                    ? 'bg-gold text-ivory'
                    : 'bg-charcoal text-ivory hover:bg-gold'
                }`}
              >
                {added ? 'Added to cart ✓' : 'Add to cart'}
              </button>
            </div>

            <Link
              href="/cart"
              className="link-underline mt-5 w-fit text-[13px] font-medium text-charcoal/70 hover:text-charcoal"
            >
              View cart &amp; checkout →
            </Link>

            <p className="mt-10 rounded-[4px] bg-cream px-5 py-4 text-[12px] font-light leading-relaxed text-charcoal/50">
              For laboratory and research use only. Not for human or veterinary
              use, food, or drug applications. Each order ships with a full
              certificate of analysis and batch documentation.
            </p>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-24 md:mt-32">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <span className="eyebrow">Continue exploring</span>
                <h2 className="mt-4 text-section font-extralight tracking-tightest text-charcoal">
                  Related compounds
                </h2>
              </div>
              <Link
                href="/#products"
                className="link-underline hidden text-[13px] font-medium text-charcoal sm:inline-block"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function RelatedCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  return (
    <article className="group overflow-hidden rounded-[4px] bg-cream transition-shadow duration-700 hover:shadow-[0_30px_60px_-30px_rgba(28,26,23,0.25)]">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[3/2] overflow-hidden bg-[#eef1f4]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover transition-transform duration-[1.2s] ease-lux group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-ivory/85 px-3 py-1 text-[10px] uppercase tracking-wider text-charcoal backdrop-blur-sm">
          {product.category}
        </span>
      </Link>
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-light text-charcoal">
            <Link
              href={`/product/${product.slug}`}
              className="transition-colors hover:text-gold"
            >
              {product.name}
            </Link>
          </h3>
          <span className="shrink-0 text-lg font-light text-charcoal">
            {product.price}
          </span>
        </div>
        <button
          onClick={() => addItem(product)}
          className="mt-1 rounded-full bg-charcoal py-2.5 text-[12px] font-medium text-ivory transition-colors duration-500 hover:bg-gold"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
