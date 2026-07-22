import type { Metadata, Viewport } from 'next';
import './globals.css';
import SmoothScroll from '@/components/providers/SmoothScroll';
import CartProvider from '@/components/providers/CartProvider';
import AuthProvider from '@/components/providers/AuthProvider';
import Cursor from '@/components/ui/Cursor';
import ChatWidget from '@/components/ui/ChatWidget';

export const metadata: Metadata = {
  metadataBase: new URL('https://lumivex.store'),
  title: 'Lumivex — Research Compounds for Laboratory Use | UK & EU Supplier',
  description:
    'Lumivex supplies laboratories with high-purity, batch-tested research peptides and reference compounds — manufactured in-house, third-party analysed, fully traceable. Research use only — not for human or veterinary use.',
  keywords: [
    'research peptides',
    'research reference materials',
    'laboratory research compounds',
    'certificate of analysis',
    'third-party tested peptides',
    'R&D compounds',
    'in vitro research materials',
  ],
  openGraph: {
    title: 'Lumivex — Research Compounds for Laboratory Use',
    description:
      'High-purity, batch-tested research peptides and reference compounds for laboratory R&D across the UK & EU. Research use only — not for human or veterinary use.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  // Draw edge-to-edge under notches; safe-area insets are handled in CSS.
  viewportFit: 'cover',
  themeColor: '#1C1A17',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Cursor />
        <AuthProvider>
          <CartProvider>
            <SmoothScroll>{children}</SmoothScroll>
            <ChatWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
