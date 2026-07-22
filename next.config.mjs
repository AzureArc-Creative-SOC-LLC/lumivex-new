import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Turbopack only resolves modules inside its detected root (this
    // project's package-lock.json). The send-order-confirmation API route
    // imports ../../../../../shared-email/order-email.js, which lives
    // outside that root, so widen it to the common /var/www/ ancestor
    // (2 up: past /var/www/lumivexlabs/app/ and /var/www/lumivexlabs/).
    root: path.join(__dirname, '../..'),
  },
  // Trim production bundles by dropping console.* (keeps warnings/errors)
  compiler: {
    removeConsole: { exclude: ['error', 'warn'] },
  },
  images: {
    // Optimize on demand: resize to the requested size and serve modern
    // formats. Quality stays high (set per-image where clarity matters).
    formats: ['image/avif', 'image/webp'],
    // Next 16 only generates the quality levels listed here. 90 is used by the
    // product gallery, where label text has to stay legible when zoomed.
    qualities: [75, 90],
    // Cache optimized variants aggressively (1 year).
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
