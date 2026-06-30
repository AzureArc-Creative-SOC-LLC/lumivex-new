import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/data';

const BASE = 'https://lumivex.store';

export default function sitemap(): MetadataRoute.Sitemap {
  const products = PRODUCTS.map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    ...products,
  ];
}
