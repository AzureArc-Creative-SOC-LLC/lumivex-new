import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS, getProduct, getRelatedProducts } from '@/lib/data';
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
  return {
    title: `${product.name} — Lumivex Research Compounds`,
    description: product.description,
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

  return (
    <>
      <ShopHeader />
      <main>
        <ProductDetail product={product} related={related} />
      </main>
      <Footer />
    </>
  );
}
