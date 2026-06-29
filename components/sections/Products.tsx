'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PRODUCTS } from '@/lib/data';
import { useCart } from '@/components/providers/CartProvider';
import RevealText from '@/components/animations/RevealText';
import CurtainImage from '@/components/animations/CurtainImage';

export default function Products() {
  const { addItem } = useCart();

  return (
    <section id="products" className="relative bg-ivory py-section">
      <div className="container-wide">
        <div className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">The Catalogue</span>
            <RevealText
              as="h2"
              split="lines"
              className="mt-6 text-display font-extralight text-charcoal"
            >
              High-purity compounds, supplied for R&amp;D.
            </RevealText>
          </div>
          <RevealText
            as="p"
            split="lines"
            className="max-w-sm text-base font-light leading-relaxed text-charcoal/55"
          >
            Each compound ships with full documentation, batch traceability, and
            verified purity. For laboratory research use only.
          </RevealText>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {PRODUCTS.map((product, i) => (
            <motion.article
              key={product.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.9,
                delay: (i % 2) * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-[4px] bg-cream transition-shadow duration-700 hover:shadow-[0_40px_80px_-30px_rgba(28,26,23,0.25)]"
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
                  sizes="(max-width: 640px) 100vw, 50vw"
                  curtain={false}
                  rounded={false}
                  oversize={0}
                  baseScale={1.06}
                  direction={i % 2 === 0 ? 'up' : 'down'}
                  intensity={2}
                />
                <div className="absolute inset-0 z-[5] bg-gradient-to-t from-charcoal/30 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <span className="absolute left-5 top-5 rounded-full bg-ivory/85 px-4 py-1.5 text-[10px] uppercase tracking-wider text-charcoal backdrop-blur-sm">
                  {product.category}
                </span>
              </Link>

              <div className="flex flex-col gap-4 p-7 md:p-9">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-light tracking-tight text-charcoal md:text-[1.75rem]">
                    <Link
                      href={`/product/${product.slug}`}
                      className="transition-colors hover:text-gold"
                    >
                      {product.name}
                    </Link>
                    <span className="ml-2 align-middle text-[10px] uppercase tracking-wider text-charcoal/40">
                      {product.tag}
                    </span>
                  </h3>
                  <span className="shrink-0 text-right">
                    <span className="block text-2xl font-light text-charcoal">
                      {product.price}
                    </span>
                    <span className="block text-[10px] uppercase tracking-wider text-charcoal/40">
                      GBP
                    </span>
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Link
                    href={`/product/${product.slug}`}
                    className="shrink-0 rounded-full border border-charcoal/15 px-5 py-2.5 text-center text-[12px] font-medium text-charcoal transition-colors duration-500 hover:border-charcoal/40"
                  >
                    View more
                  </Link>
                  <button
                    onClick={() => addItem(product)}
                    className="shrink-0 rounded-full bg-charcoal px-5 py-2.5 text-[12px] font-medium text-ivory transition-colors duration-500 hover:bg-gold"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
