import type { Metadata } from 'next';
import { PRODUCTS, RESEARCH_DISCLAIMER } from '@/lib/data';
import ShopHeader from '@/components/shop/ShopHeader';
import ShopGrid from '@/components/shop/ShopGrid';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Shop — Research Compounds | Lumivex',
  description:
    'Browse the full Lumivex catalogue of high-purity, batch-tested research peptides and reference compounds. Filter by category, sort by price, and view full certificates of analysis. Research use only.',
  openGraph: {
    title: 'Shop — Research Compounds | Lumivex',
    description:
      'Browse the full Lumivex catalogue of high-purity, batch-tested research peptides and reference compounds. Research use only.',
    type: 'website',
  },
};

export default function ShopPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Lumivex Research Compound Catalogue',
    itemListElement: PRODUCTS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://lumivex.store/product/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShopHeader />
      <main className="bg-ivory">
        {/* Catalogue */}
        <section className="py-14 md:py-20">
          <div className="container-wide">
            <ShopGrid />
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-charcoal/10 bg-cream/60 py-10">
          <div className="container-wide">
            <p className="max-w-3xl text-[12px] font-light leading-relaxed text-charcoal/50">
              {RESEARCH_DISCLAIMER}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
