import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Turbopack only resolves modules inside its detected root (this
    // project's package-lock.json). The send-order-confirmation API route
    // imports ../../../../shared-email/order-email.js, which lives
    // outside that root, so widen it to the common Dev/frontend ancestor.
    root: path.join(__dirname, '..'),
  },
  // Trim production bundles by dropping console.* (keeps warnings/errors)
  compiler: {
    removeConsole: { exclude: ['error', 'warn'] },
  },
  images: {
    // Optimize on demand: resize to the requested size and serve modern
    // formats. Quality stays high (set per-image where clarity matters).
    formats: ['image/avif', 'image/webp'],
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
