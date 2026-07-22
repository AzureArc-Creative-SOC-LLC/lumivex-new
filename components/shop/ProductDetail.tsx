'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RESEARCH_DISCLAIMER, type Product } from '@/lib/data';
import { useCart } from '@/components/providers/CartProvider';
import ProductGallery from '@/components/shop/ProductGallery';
import CertificateModal from '@/components/shop/CertificateModal';
import LabAnalysisModal from '@/components/shop/LabAnalysisModal';

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
  const [certOpen, setCertOpen] = useState(false);
  const [labOpen, setLabOpen] = useState(false);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const hasCertificate =
    !!product.janoshik &&
    ((product.janoshik.certificateImages?.length ?? 0) > 0 ||
      !!product.janoshik.verifyUrl);

  // Surface each product's own lab analysis when its page opens — once per
  // product per browser session, so browsing back to it isn't a nag.
  useEffect(() => {
    if (!hasCertificate) return;
    const key = `lab-analysis-seen:${product.slug}`;
    if (sessionStorage.getItem(key)) return;
    const t = setTimeout(() => {
      sessionStorage.setItem(key, '1');
      setLabOpen(true);
    }, 700);
    return () => clearTimeout(t);
  }, [hasCertificate, product.slug]);

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
            <span className="eyebrow">{product.category}</span>
            <h1 className="mt-5 text-display font-extralight leading-[1] tracking-tightest text-charcoal">
              {product.name}{' '}
              <span className="text-charcoal/35">({product.tag})</span>
            </h1>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl font-light text-charcoal md:text-4xl">
                {product.price}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-charcoal/40">
                USD
              </span>
              {!hasCertificate && product.purity && (
                <span className="ml-auto text-[11px] uppercase tracking-wider text-gold">
                  {product.purity} purity
                </span>
              )}
            </div>

            <p className="mt-7 text-base font-light leading-relaxed text-charcoal/65">
              {product.longDescription}
            </p>

            {/* Research-only disclaimer — placement 1 of 3: product info */}
            <p className="mt-7 border-l-2 border-gold bg-cream px-5 py-4 text-[12px] font-light leading-relaxed text-charcoal/60">
              <span className="font-medium text-charcoal">
                For research purposes only.
              </span>{' '}
              Not intended for human or veterinary use. Not intended to
              diagnose, treat, cure, or prevent any disease. Supplied strictly
              for laboratory and analytical research conducted by qualified
              professionals.
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

            {/* Research-only disclaimer — placement 2 of 3: beside Add to Cart */}
            <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-charcoal/45">
              Research use only — not for human or veterinary use
            </p>

            {hasCertificate && (
              <>
                <button
                  onClick={() => setCertOpen(true)}
                  className="link-underline mx-auto mt-10 flex w-fit items-center gap-2 text-[13px] font-medium text-gold"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M8.17 1.17H3.5a1.17 1.17 0 00-1.17 1.16v9.34A1.17 1.17 0 003.5 12.83h7a1.17 1.17 0 001.17-1.16V4.67L8.17 1.17z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.17 1.17v3.5h3.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  View Janoshik Analytical Report
                </button>

                <LabAnalysisPanel
                  purity={product.janoshik?.purity ?? product.purity}
                  batchNumber={product.janoshik?.batchNumber}
                  fillVolume={product.janoshik?.fillVolume}
                  compounds={product.janoshik?.compounds}
                />
              </>
            )}

            {/* Package contents / storage / supply chain */}
            <DetailTabs
              details={product.details}
              highlights={product.highlights}
            />
          </motion.div>
        </div>

        {hasCertificate && product.janoshik && (
          <>
            <LabAnalysisModal
              open={labOpen}
              onClose={() => setLabOpen(false)}
              onViewReport={() => {
                setLabOpen(false);
                setCertOpen(true);
              }}
              data={{
                purity: product.janoshik.purity,
                batchNumber: product.janoshik.batchNumber,
                fillVolume: product.janoshik.fillVolume,
                compounds: product.janoshik.compounds,
              }}
            />
            <CertificateModal
              open={certOpen}
              onClose={() => setCertOpen(false)}
              data={{
                productName: product.name,
                verifyUrl: product.janoshik.verifyUrl,
                certificateImages: product.janoshik.certificateImages,
              }}
            />
          </>
        )}

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

        {/* Research-only disclaimer — placement 3 of 3: product footer */}
        <section className="mt-20 border-t border-charcoal/10 pt-10 md:mt-24">
          <p className="text-[11px] uppercase tracking-eyebrow text-charcoal/40">
            Compliance notice
          </p>
          <p className="mt-4 max-w-3xl text-[13px] font-light leading-relaxed text-charcoal/55">
            {RESEARCH_DISCLAIMER}
          </p>
        </section>
      </div>
    </div>
  );
}

function LabAnalysisPanel({
  purity,
  batchNumber,
  fillVolume,
  compounds,
}: {
  purity?: string;
  batchNumber?: string;
  fillVolume?: string;
  compounds?: { name: string; concentration: string; content: string }[];
}) {
  const facts = [
    { label: 'Batch Number', value: batchNumber },
    { label: 'Fill Volume', value: fillVolume },
    { label: 'Purity', value: purity },
  ].filter((f) => !!f.value);

  if (facts.length === 0 && !compounds?.length) return null;

  return (
    <div className="mt-6 rounded-[6px] border border-charcoal/10 bg-cream p-6">
      <div className="text-center">
        <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path
              d="M10 1.667a4.167 4.167 0 100 8.333 4.167 4.167 0 000-8.333zM5.833 12.5v5.833l4.167-2.083 4.167 2.083V12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h3 className="mt-3 text-sm font-medium text-charcoal">
          Janoshik Third-Party Lab Analysis
        </h3>
        <p className="mt-1 text-[12px] font-light text-charcoal/50">
          Independently tested and verified by Janoshik Analytical.
        </p>
      </div>

      {facts.length > 0 && (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {facts.map((f) => (
            <div
              key={f.label}
              className="rounded-[4px] border border-charcoal/10 bg-ivory px-4 py-3 text-center"
            >
              <div className="text-[10px] uppercase tracking-wider text-charcoal/45">
                {f.label}
              </div>
              <div className="mt-1 text-sm font-medium text-charcoal">
                {f.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {compounds && compounds.length > 0 && (
        <>
          <div className="mt-5 overflow-hidden rounded-[4px] border border-charcoal/10">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-ivory text-[10px] uppercase tracking-wider text-charcoal/45">
                <tr>
                  <th className="px-3 py-2 font-medium">Compound</th>
                  <th className="px-3 py-2 font-medium">Concentration</th>
                  <th className="px-3 py-2 font-medium">Verified Content</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/10 bg-ivory/50">
                {compounds.map((c) => (
                  <tr key={c.name}>
                    <td className="px-3 py-2 font-medium text-charcoal">
                      {c.name}
                    </td>
                    <td className="px-3 py-2 text-charcoal/70">
                      {c.concentration}
                    </td>
                    <td className="px-3 py-2 text-charcoal/70">{c.content}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] font-light leading-relaxed text-charcoal/45">
            Concentration is measured per mL; verified content reflects the
            total assayed mass across the stated fill volume.
          </p>
        </>
      )}
    </div>
  );
}

function DetailTabs({
  details,
  highlights,
}: {
  details?: Product['details'];
  highlights: string[];
}) {
  const tabs = [
    { label: 'Package Contents', body: details?.contents },
    { label: 'Storage Logic', body: details?.storage },
  ].filter((t) => !!t.body);

  const [active, setActive] = useState(0);

  if (tabs.length === 0) {
    if (highlights.length === 0) return null;
    return (
      <ul className="mt-10 space-y-2.5">
        {highlights.map((h) => (
          <li
            key={h}
            className="flex items-start gap-3 text-[13px] font-light text-charcoal/70"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
              aria-hidden
            />
            {h}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="mt-10">
      <div
        role="tablist"
        className="flex gap-7 overflow-x-auto border-b border-charcoal/10"
      >
        {tabs.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`-mb-px shrink-0 border-b-2 pb-3 text-[13px] font-medium transition-colors ${
              active === i
                ? 'border-gold text-charcoal'
                : 'border-transparent text-charcoal/45 hover:text-charcoal'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p
        role="tabpanel"
        className="mt-5 whitespace-pre-line text-sm font-light leading-relaxed text-charcoal/65"
      >
        {tabs[active].body}
      </p>
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
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
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
