import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  PRODUCTS,
  RESEARCH_DISCLAIMER,
  getProduct,
  getRelatedProducts,
} from '@/lib/data';
import ShopHeader from '@/components/shop/ShopHeader';
import ProductDetail from '@/components/shop/ProductDetail';
import Footer from '@/components/sections/Footer';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: 'Product not found — Lumivex' };
  const description = `${product.description} Research use only — not for human or veterinary use.`;
  return {
    title: `${product.name} — Research Compound | Lumivex`,
    description,
    openGraph: {
      title: `${product.name} — Research Compound | Lumivex`,
      description,
      type: 'website',
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelatedProducts(slug);

  // Product schema — research positioning only. Deliberately omits
  // aggregateRating (no review system) and any health-related properties.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: `${product.description} ${RESEARCH_DISCLAIMER}`,
    category: 'Laboratory research material',
    image: `https://lumivex.store${product.image}`,
    sku: product.janoshik?.batchNumber ?? product.id,
    brand: { '@type': 'Brand', name: 'Lumivex' },
    audience: {
      '@type': 'Audience',
      audienceType: 'Qualified laboratory research professionals',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Intended use',
        value:
          'Laboratory and analytical research only. Not for human or veterinary use.',
      },
      ...(product.janoshik?.purity
        ? [
            {
              '@type': 'PropertyValue',
              name: 'Assayed purity',
              value: product.janoshik.purity,
            },
          ]
        : []),
    ],
    offers: {
      '@type': 'Offer',
      price: product.priceValue,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://lumivex.store/product/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShopHeader />
      <main>
        <ProductDetail product={product} related={related} />
      </main>
      <Footer />
    </>
  );
}
