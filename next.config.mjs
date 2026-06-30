/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
