import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Account/checkout flows hold no indexable content.
      disallow: ['/account/', '/checkout', '/cart'],
    },
    sitemap: 'https://lumivex.store/sitemap.xml',
  };
}
