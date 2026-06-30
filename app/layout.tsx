import type { Metadata, Viewport } from 'next';
import './globals.css';
import SmoothScroll from '@/components/providers/SmoothScroll';
import CartProvider from '@/components/providers/CartProvider';
import AuthProvider from '@/components/providers/AuthProvider';
import Cursor from '@/components/ui/Cursor';
import ChatWidget from '@/components/ui/ChatWidget';

export const metadata: Metadata = {
  metadataBase: new URL('https://lumivex.store'),
  title: 'Lumivex — Premium Research Compounds | UK & EU R&D Supplier',
  description:
    'Lumivex supplies leading laboratories with high-purity, batch-tested research peptides and compounds — manufactured in-house with full traceability. Research use only.',
  keywords: [
    'research peptides',
    'tirzepatide',
    'retatrutide',
    'BPC-157',
    'TB-500',
    'NAD+',
    'R&D compounds',
    'laboratory research',
  ],
  openGraph: {
    title: 'Lumivex — Premium Research Compounds',
    description:
      'High-purity, batch-tested research peptides and compounds for laboratory R&D across the UK & EU. Research use only.',
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
